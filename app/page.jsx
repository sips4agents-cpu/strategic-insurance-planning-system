"use client";

export default function HomePage() {
  return (
    <main
      style={{
        padding: "32px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "480px",
        margin: "0 auto",
      }}
    >
      <h1>Strategic Insurance Planning System</h1>
      <p>Secure sign in for your agency system.</p>

      <div style={{ marginTop: "24px" }}>
        <a
          href="/dashboard"
          style={{
            padding: "12px 16px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Open Dashboard
        </a>
      </div>
    </main>
  );
}

