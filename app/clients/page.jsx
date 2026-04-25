"use client";
export const dynamic = "force-dynamic";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const statusOptions = [
  "All",
  "New Lead",
  "Intake Complete",
  "Presented",
  "Submitted",
  "Approved",
  "Follow Up",
];

const inputStyle = {
  padding: "12px",
  border: "1px solid #c9d1d9",
  borderRadius: "8px",
  fontSize: "14px",
  width: "100%",
  boxSizing: "border-box",
};

export default function ClientsPage() {
  const [households, setHouseholds] = useState([]);
  const [message, setMessage] = useState("Loading...");
  const [statusFilter, setStatusFilter] = useState("All");

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
          reason_for_call,
          status,
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

  const filteredHouseholds = useMemo(() => {
    if (statusFilter === "All") return households;
    return households.filter(
      (household) => (household.status || "New Lead") === statusFilter
    );
  }, [households, statusFilter]);

  return (
    <main style={{ padding: "32px", fontFamily: "Arial, sans-serif" }}>
      <h1>Clients</h1>

      <div style={{ marginTop: "16px", marginBottom: "20px", maxWidth: "320px" }}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={inputStyle}
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {message ? <p>{message}</p> : null}

      {!message ? (
        <p style={{ marginBottom: "20px" }}>
          Showing {filteredHouseholds.length} household
          {filteredHouseholds.length === 1 ? "" : "s"}.
        </p>
      ) : null}

      <div style={{ display: "grid", gap: "16px", marginTop: "24px" }}>
        {filteredHouseholds.map((household) => {
          const client = household.people?.find((p) => p.person_type === "client");
          const spouse = household.people?.find((p) => p.person_type === "spouse");

          return (
            <div
              key={household.id}
              style={{
                border: "1px solid #d0d7de",
                borderRadius: "10px",
                padding: "16px",
                background: "#fff",
              }}
            >
              <div>
                <strong>
                  {client?.first_name || "-"} {client?.last_name || ""}
                </strong>
              </div>

              <div>Phone: {client?.phone || "-"}</div>
              <div>Email: {client?.email || "-"}</div>
              <div>Coverage Type: {client?.coverage_type || "-"}</div>
              <div>Agent: {household.assigned_agent || "-"}</div>
              <div>Reason for Call: {household.reason_for_call || "-"}</div>
              <div>Status: {household.status || "New Lead"}</div>

              {spouse ? (
                <div style={{ marginTop: "8px" }}>
                  <strong>Spouse:</strong> {spouse.first_name || "-"} {spouse.last_name || ""}
                </div>
              ) : null}

              <div style={{ marginTop: "16px" }}>
                <a
                  href={`/households/${household.id}`}
                  style={{
                    background: "#f5f5f5",
                    border: "1px solid #999",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    textDecoration: "none",
                    color: "#000",
                    display: "inline-block",
                    fontWeight: "bold",
                  }}
                >
                  Open Household Detail
                </a>
              </div>
            </div>
          );
        })}

        {!message && filteredHouseholds.length === 0 ? (
          <p>No households found for this status.</p>
        ) : null}
      </div>
    </main>
  );
}
