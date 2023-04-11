import { Inter } from 'next/font/google';
import { FaCheck, FaExclamation, FaTimes } from 'react-icons/fa';
import useAccess from './useAccess';
import CopyableValue from './CopiableValue';
import styles from './Authorization.module.css';

const inter = Inter({ subsets: ['latin'] });

export default async function Authorization({ token }: { token?: string }) {
  const result = await useAccess();

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
      {result && result.audience && <CopyableValue label="aud" value={result.audience} />}
      {result && result.email && <CopyableValue label="email" value={result.email} />}
    </div>
  );
};
