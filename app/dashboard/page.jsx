export default function DashboardPage() {
  return (
    <main style={{ padding: "32px", fontFamily: "Arial, sans-serif" }}>
      <h1>Dashboard</h1>
      <p>You are signed in.</p>

      <div style={{ marginTop: "24px", display: "grid", gap: "12px", maxWidth: "420px" }}>
        <a href="/clients" style={linkStyle}>Open Clients</a>
        <a href="/intake" style={linkStyle}>Open New Intake</a>
        <a href="/" style={linkStyle}>Return Home</a>
      </div>
    </main>
  );
}

const linkStyle = {
  padding: "12px 16px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  textDecoration: "none",
  display: "inline-block",
};
