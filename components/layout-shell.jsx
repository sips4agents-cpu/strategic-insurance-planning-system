export default function LayoutShell({ title, subtitle, actions, children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f6f8fb', color: '#102033' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh' }}>
        <aside style={{ background: '#12233d', color: 'white', padding: 24 }}>
          <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>
            Strategic Insurance<br />Planning System
          </div>
          <nav style={{ display: 'grid', gap: 10 }}>
            <a href="/app" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</a>
            <a href="/app/clients" style={{ color: 'white', textDecoration: 'none' }}>Clients</a>
            <a href="/app/clients/new" style={{ color: 'white', textDecoration: 'none' }}>New Intake</a>
            <a href="/app/vault" style={{ color: 'white', textDecoration: 'none' }}>Document Vault</a>
            <a href="/app/security" style={{ color: 'white', textDecoration: 'none' }}>Security</a>
            <a href="/auth/signout" style={{ color: '#ffd4d4', textDecoration: 'none', marginTop: 12 }}>Sign out</a>
          </nav>
        </aside>
        <main style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 20, marginBottom: 24 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 30 }}>{title}</h1>
              {subtitle ? <p style={{ margin: '8px 0 0', color: '#536273' }}>{subtitle}</p> : null}
            </div>
            {actions}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
