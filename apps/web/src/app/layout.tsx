import './globals.css';

export const metadata = {
  title: 'BizFlow AI',
  description: 'AI-powered content generation for multiple domains',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

