    );
  }

  return (
    <main style={{ padding: "32px", fontFamily: "Arial, sans-serif" }}>
      <h1>Dashboard</h1>
      <p>Signed in as: {user.email}</p>

      <div style={{ marginTop: "24px", display: "grid", gap: "12px", maxWidth: "420px" }}>
        <a href="/clients" style={linkStyle}>Open Clients</a>
        <a href="/intake" style={linkStyle}>Open New Intake</a>

        <button onClick={handleSignOut} style={buttonStyle}>
          Sign Out
        </button>
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

const buttonStyle = {
  padding: "12px 16px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};
