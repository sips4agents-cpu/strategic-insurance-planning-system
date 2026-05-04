export default function AgentPage() {
  return (
    <main style={{ width: "100%", minHeight: "100vh", margin: 0, padding: 0 }}>
      <iframe
        src="/sips-agent-dashboard.html"
        title="SIPS Agent Dashboard"
        style={{
          width: "100%",
          height: "100vh",
          border: "0",
          display: "block",
        }}
      />
    </main>
  );
}
