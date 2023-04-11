import './globals.css';
import Redirect from './Redirect';
import useAccess from './useAccess';

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
