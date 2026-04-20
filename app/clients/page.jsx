export default function ClientsPage() {
  return (
    <main style={{ padding: "32px", fontFamily: "Arial, sans-serif" }}>
      <h1>Clients</h1>
      <p>Client records will appear here.</p>

      <div style={{ marginTop: "24px", display: "grid", gap: "12px", maxWidth: "520px" }}>
        <div style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <strong>Sample Client:</strong> John Smith
          <div>Status: Active</div>
        </div>

        <div style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px" }}>
          <strong>Sample Client:</strong> Mary Jones
          <div>Status: Intake Needed</div>
        </div>
      </div>
    </main>
  );
}
