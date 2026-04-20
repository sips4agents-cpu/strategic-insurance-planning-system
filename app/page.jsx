"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("Signing in...");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.replace("/dashboard");
  }

  return (
    <main
      style={{
        padding: "32px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "480px",
        margin: "0 auto",
      }}
    >
    <h1>LOGIN TEST PAGE 123</h1>
      <p>Secure sign in for your agency system.</p>

      <form
        onSubmit={handleLogin}
        style={{ display: "grid", gap: "12px", marginTop: "24px" }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px" }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px" }}
          required
        />
        <button
          type="submit"
          style={{ padding: "12px", border: "none", borderRadius: "8px", cursor: "pointer" }}
        >
          Sign In
        </button>
      </form>

      {message && <p style={{ marginTop: "16px" }}>{message}</p>}
    </main>
  );
}

