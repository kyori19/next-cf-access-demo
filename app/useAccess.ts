import { JwtPayload, decode, verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const CERT_CACHE_TIME =  60 * 60 * 24 * 7;

async function fetchKey(iss: string, kid: string) {
  const url = new URL(`${iss}/cdn-cgi/access/certs`);

  if (!url.host.endsWith('.cloudflareaccess.com')) {
    throw new Error('invalid issuer');
  }

  const res = await fetch(url, { next: { revalidate: CERT_CACHE_TIME } });
  
  if (!res.ok) {
    throw new Error('failed to fetch certs');
  }

  const { public_certs: certs }: { public_certs: { kid: string; cert: string }[] } = await res.json();

  return certs.find(({ kid: k }: { kid: string }) => k === kid)?.cert;
}

export async function verifyToken(token: string | null | undefined) {
  try {
    if (!token) {
      throw new Error('missing token');
    }

    const audience = process.env.NCFA_AUD;
    if (!audience) {
      throw new Error('missing audience');
    }

    const jwt = decode(token, { complete: true });
    if (!jwt) {
      throw new Error('invalid token');
    }

    const { header: { kid } } = jwt;
    if (!kid) {
      throw new Error('missing kid');
    }

    let payload = jwt.payload;
    if (typeof payload === 'string') {
      payload = JSON.parse(payload);
    }

    const { iss, email } = payload as JwtPayload;
    if (!iss) {
      throw new Error('missing issuer');
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const key = await fetchKey(iss, kid);
    if (!key) {
      throw new Error('missing key');
    }

    verify(token, key, { audience });

    return {
      audience,
      kid,
      email,
    };
  } catch (err) {
    return { err };
  }
}

export default async function useAccess() {
  const token = cookies().get('CF_Authorization')?.value;
  const domain = process.env.VERCEL_URL;

  if (!domain) {
    /** Not a vercel environment, returning */
    return;
  }

  return await verifyToken(token);
}
