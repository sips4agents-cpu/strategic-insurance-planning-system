export default function AppHomePage() {
  return (
    <main style={{ padding: "32px", fontFamily: "Arial, sans-serif" }}>
      <h1>Strategic Insurance Planning System</h1>
      <p>Your secure app area is now live.</p>

      <div style={{ marginTop: "24px", display: "grid", gap: "12px", maxWidth: "420px" }}>
        <a href="/" style={{ padding: "12px 16px", border: "1px solid #ccc", borderRadius: "8px", textDecoration: "none" }}>
          Home
        </a>
        <a href="/app/clients" style={{ padding: "12px 16px", border: "1px solid #ccc", borderRadius: "8px", textDecoration: "none" }}>
          Clients
        </a>
        <a href="/app/intake" style={{ padding: "12px 16px", border: "1px solid #ccc", borderRadius: "8px", textDecoration: "none" }}>
          New Intake
        </a>
        <a href="/app/security" style={{ padding: "12px 16px", border: "1px solid #ccc", borderRadius: "8px", textDecoration: "none" }}>
          Security
        </a>
      </div>
    </main>
  );
}
