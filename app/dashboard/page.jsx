"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    }
    loadUser();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.replace("/");
  }

  if (!user) {
    return (
      <main style={{ padding: "32px", fontFamily: "Arial, sans-serif" }}>
        <h1>Dashboard</h1>
        <p>You are not signed in.</p>
        <a href="/" style={linkStyle}>Go to Login</a>
      </main>
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
