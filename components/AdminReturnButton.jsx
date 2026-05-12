"use client";

export default function AdminReturnButton() {
  return (
    <a
      href="/intake"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "#111",
        color: "#fff",
        padding: "14px 18px",
        borderRadius: "10px",
        textDecoration: "none",
        fontWeight: "bold",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        zIndex: 9999,
      }}
    >
      + Admin Intake
    </a>
  );
}
