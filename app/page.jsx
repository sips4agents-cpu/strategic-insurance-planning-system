export default function HomePage() {
  return (
    <main style={{ padding: "32px", fontFamily: "Arial, sans-serif" }}>
      <h1>Strategic Insurance Planning System</h1>
      <p>Private login, client intake, secure data foundation, and deploy-ready structure for your insurance agency.</p>

      <div style={{ marginTop: "24px", display: "grid", gap: "12px", maxWidth: "520px" }}>
        <div style={{ padding: "14px 16px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <strong>System status:</strong> Live and deployed
        </div>

        <div style={{ padding: "14px 16px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <strong>Next step:</strong> Create your first user in Supabase Authentication
        </div>

        <a
          href="https://supabase.com/dashboard/project/jqcqbmwjhghdnmwanztj/auth/users"
          style={{
            padding: "12px 16px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            textDecoration: "none",
            display: "inline-block"
          }}
        >
          Open Supabase Users
        </a>
      </div>
    </main>
  );
}
