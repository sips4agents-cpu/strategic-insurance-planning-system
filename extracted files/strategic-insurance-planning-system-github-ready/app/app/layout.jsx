import './globals.css';

export const metadata = {
  title: 'Strategic Insurance Planning System',
  description: 'Secure agency portal starter',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
