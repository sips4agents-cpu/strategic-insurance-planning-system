export default function DashboardPage() {
  return (
    <main style={{ padding: "32px", fontFamily: "Arial, sans-serif" }}>
      <h1>Dashboard</h1>
      <p>You are signed in.</p>

      <div style={{ marginTop: "24px", display: "grid", gap: "12px", maxWidth: "520px" }}>
        <a
          href="/clients"
          style={{
            padding: "12px 16px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Open Clients
        </a>

        <a
          href="/intake"
          style={{
            padding: "12px 16px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Open New Intake
        </a>

        <a
          href="/"
          style={{
            padding: "12px 16px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Return Home
        </a>
      </div>
    </main>
  );
}
