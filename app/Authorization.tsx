import { Inter } from 'next/font/google';
import { FaCheck, FaTimes } from 'react-icons/fa';
import styles from './Authorization.module.css';

const inter = Inter({ subsets: ['latin'] });

export default function Authorization({ token }: { token?: string }) {
  const header = !token
    ? (
      <p>
        <FaTimes size='1.5em' color='red' />
        <span className={inter.className}>Unauthorized: Access is not via Cloudflare Access</span>
      </p>
    )
    : (
      <p>
        <FaCheck size='1.5em' color='green' />
        <span className={inter.className}>Authorized: Access is via Cloudflare Access</span>
      </p>
    );

  const content = token && (
    <p>
      <span className={inter.className}>token:</span>
      <code className={styles.token}>{token}</code>
    </p>
  );

  return (
    <div className={styles.card}>
      {header}
      {content}
    </div>
  );
};
