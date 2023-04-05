import { cookies } from 'next/headers';
import styles from './page.module.css';
import Authorization from './Authorization';

export default function Home() {
  const token = cookies().get('CF_Authorization')?.value;

  return (
    <main className={styles.main}>
      {/* @ts-expect-error Async Server Component */}
      <Authorization token={token} />
    </main>
  )
}
