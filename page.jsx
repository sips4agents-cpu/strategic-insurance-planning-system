export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f6f8fb', padding: 24 }}>
      <div style={{ maxWidth: 720, width: '100%', background: 'white', borderRadius: 24, padding: 32, boxShadow: '0 10px 30px rgba(16,32,51,.08)' }}>
        <p style={{ marginTop: 0, color: '#536273', fontWeight: 700 }}>Secure agency portal starter</p>
        <h1 style={{ marginTop: 0, fontSize: 42, lineHeight: 1.1 }}>Strategic Insurance Planning System</h1>
        <p style={{ color: '#536273', fontSize: 18 }}>
          Private login, client intake, secure data foundation, and deploy-ready structure for your insurance agency.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <a href="/login" style={{ padding: '12px 18px', borderRadius: 12, background: '#12233d', color: 'white', textDecoration: 'none' }}>Secure sign in</a>
          <a href="/app" style={{ padding: '12px 18px', borderRadius: 12, border: '1px solid #cbd5e1', textDecoration: 'none' }}>Open app</a>
        </div>
      </div>
    </div>
  );
}
