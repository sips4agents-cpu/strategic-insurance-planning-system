import LoginForm from '@/components/login-form';

export const metadata = {
  title: 'Login | Strategic Insurance Planning System',
};

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f6f8fb', padding: 24 }}>
      <div style={{ maxWidth: 520, width: '100%', background: 'white', borderRadius: 24, padding: 32, boxShadow: '0 10px 30px rgba(16,32,51,.08)' }}>
        <p style={{ marginTop: 0, color: '#536273', fontWeight: 700 }}>Private login</p>
        <h1 style={{ marginTop: 0 }}>Sign in securely</h1>
        <p style={{ color: '#536273' }}>Use your agency email to receive a one-time secure sign-in link.</p>
        <LoginForm />
      </div>
    </div>
  );
}
