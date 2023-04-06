import { JwtPayload, decode, verify } from 'jsonwebtoken';
import { Inter } from 'next/font/google';
import { FaCheck, FaExclamation, FaTimes } from 'react-icons/fa';
import CopyableValue from './CopiableValue';
import styles from './Authorization.module.css';

const inter = Inter({ subsets: ['latin'] });

async function fetchKey(iss: string, kid: string) {
  const url = new URL(`${iss}/cdn-cgi/access/certs`);

  if (!url.host.endsWith('.cloudflareaccess.com')) {
    throw new Error('invalid issuer');
  }

  const res = await fetch(url);
  
  if (!res.ok) {
    throw new Error('failed to fetch certs');
  }

  const { public_certs: certs }: { public_certs: { kid: string; cert: string }[] } = await res.json();

  return certs.find(({ kid: k }: { kid: string }) => k === kid)?.cert;
}

async function verifyToken(token: string, audience: string) {
  try {
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

    const key = await fetchKey(iss, kid);
    if (!key) {
      throw new Error('missing public key');
    }

    verify(token, key, { audience });

    return {
      kid,
      email,
    };
  } catch (err) {
    return { err };
  }
}

export default async function Authorization({ token }: { token?: string }) {
  const aud = process.env.NCFA_AUD;
  const result = token && aud && await verifyToken(token, aud);

  const header = !token
    ? (
      <p>
        <FaTimes size='1.3em' color='red' />
        <span className={inter.className}>Unauthorized: Access is not via Cloudflare Access</span>
      </p>
    )
    : !result || result.err
    ? (
      <p>
        <FaExclamation size='1.3em' color='yellow' />
        <span className={inter.className}>Authorization Failed: Invalid signature</span>
      </p>
    )
    : (
      <p>
        <FaCheck size='1.3em' color='green' />
        <span className={inter.className}>Authorized: Access is via Cloudflare Access</span>
      </p>
    );

  return (
    <div className={styles.card}>
      {header}
      {result && result.err && <p className={inter.className}>{result.err.toString()}</p>}
      {token && <CopyableValue label="token" value={token} />}
      {aud && <CopyableValue label="aud" value={aud} />}
      {result && result.email && <CopyableValue label="email" value={result.email} />}
    </div>
  );
};
