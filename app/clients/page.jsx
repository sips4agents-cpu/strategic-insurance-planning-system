"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    async function loadClients() {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      if (!userId) {
        setMessage("You must be signed in to view clients.");
        return;
      }

      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        setMessage(error.message);
        return;
      }

      setClients(data || []);
      setMessage("");
    }

    loadClients();
  }, []);

  return (
    <main style={{ padding: "32px", fontFamily: "Arial, sans-serif" }}>
      <h1>Clients</h1>

      {message ? <p>{message}</p> : null}

      <div style={{ display: "grid", gap: "12px", marginTop: "24px" }}>
        {clients.map((client) => (
          <div
            key={client.id}
            style={{
              border: "1px solid #d0d7de",
              borderRadius: "10px",
              padding: "16px",
            }}
          >
            <strong>
              {client.client_first_name} {client.client_last_name}
            </strong>
            <div>Phone: {client.client_phone || "-"}</div>
            <div>Email: {client.client_email || "-"}</div>
            <div>Coverage Type: {client.client_coverage_type || "-"}</div>
            <div>Agent: {client.agent || "-"}</div>
          </div>
        ))}

        {!message && clients.length === 0 ? <p>No clients saved yet.</p> : null}
      </div>
    </main>
  );
}
