import { useAccess } from 'next-cf-access';
import { Redirect } from 'next-cf-access/components';
import './globals.css';

export const metadata = {
  title: 'Next.js & Cloudflare Access Demo',
  description: 'Demo application of next-cf-access',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const res = await useAccess();

  return (
    <html lang="en">
      <body>{res && res.err ? <Redirect /> : children}</body>
    </html>
  );
}
