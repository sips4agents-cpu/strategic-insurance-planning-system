"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ClientsPage() {
  const [households, setHouseholds] = useState([]);
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    async function loadHouseholds() {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      if (!userId) {
        setMessage("You must be signed in to view clients.");
        return;
      }

      const { data, error } = await supabase
        .from("households")
        .select(`
          id,
          created_at,
          assigned_agent,
          notes,
          people (
            id,
            person_type,
            first_name,
            last_name,
            phone,
            email,
            coverage_type
          )
        `)
        .eq("owner_user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        setMessage(error.message);
        return;
      }

      setHouseholds(data || []);
      setMessage("");
    }

    loadHouseholds();
  }, []);

  return (
    <main style={{ padding: "32px", fontFamily: "Arial, sans-serif" }}>
      <h1>Clients</h1>

      {message ? <p>{message}</p> : null}

      <div style={{ display: "grid", gap: "12px", marginTop: "24px" }}>
        {households.map((household) => {
          const client = household.people?.find((p) => p.person_type === "client");
          const spouse = household.people?.find((p) => p.person_type === "spouse");

          return (
            <div
              key={household.id}
              style={{
                border: "1px solid #d0d7de",
                borderRadius: "10px",
                padding: "16px",
              }}
            >
              <strong>
                {client?.first_name || "-"} {client?.last_name || ""}
              </strong>
              <div>Phone: {client?.phone || "-"}</div>
              <div>Email: {client?.email || "-"}</div>
              <div>Coverage Type: {client?.coverage_type || "-"}</div>
              <div>Agent: {household.assigned_agent || "-"}</div>

              {spouse ? (
                <div style={{ marginTop: "8px" }}>
                  <strong>Spouse:</strong> {spouse.first_name || "-"} {spouse.last_name || ""}
                </div>
              ) : null}

              <div style={{ marginTop: "12px" }}>
                <a
                  href={`/households/${household.id}`}
                  style={{
                    padding: "10px 14px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  Open Household Detail
                </a>
              </div>
            </div>
          );
        })}

        {!message && households.length === 0 ? <p>No clients saved yet.</p> : null}
      </div>
    </main>
  );
}
