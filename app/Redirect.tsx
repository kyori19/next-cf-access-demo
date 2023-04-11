'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function getRedirectUrl() {
  const { host, pathname, search } = window.location;
  const url = new URL(`https://${process.env.NEXT_PUBLIC_NCFA_DOMAIN}/.ncfa/redirect`);
  url.searchParams.set('target', host);
  url.searchParams.set('path', `${pathname}${search}`);
  return url.toString();
}

export default function Redirect() {
  const url = getRedirectUrl();
  const router = useRouter();
  
  useEffect(() => {
    router.push(url);
  }, [router, url]);

  return (
    <p>
      Redirecting you to <Link href={url}>{url}</Link>...
    </p>
  );
}
