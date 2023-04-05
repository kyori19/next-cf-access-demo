'use client';

import { Inter } from 'next/font/google';
import { useCallback, useState } from 'react';
import { FaCheck, FaCopy } from 'react-icons/fa';
import styles from './CopiableValue.module.css';

const inter = Inter({ subsets: ['latin'] });

export default function CopyableValue({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    setCopied(true);
    setInterval(() => {
      setCopied(false);
    }, 3000);
    return navigator.clipboard.writeText(value);
  }, [value]);

  const icon = copied
    ? <FaCheck size="1.5em" />
    : <FaCopy size="1.5em" />;

  return (
    <p>
      <span className={inter.className}>{label}:</span>
      <span className={styles.value}>
        <code>{value}</code>
      </span>
      <button className={styles.copy} title="Copy" onClick={copy}>{icon}</button>
    </p>
  );
}
