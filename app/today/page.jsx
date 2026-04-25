"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const agentOptions = [
  "All",
  "Admin",
  "Loyd Richardson",
  "Blake Richardson",
  "William Sykes",
  "Jimmie Bassett",
  "Christiana Grant",
];

const inputStyle = {
  padding: "12px",
  border: "1px solid #c9d1d9",
  borderRadius: "8px",
  fontSize: "14px",
  width: "100%",
  boxSizing: "border-box",
};

const cardStyle = {
  border: "1px solid #d0d7de",
  borderRadius: "10px",
  padding: "16px",
  display: "grid",
  gap: "8px",
  background: "#fff",
};

const buttonStyle = {
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #c9d1d9",
  background: "#fff",
  cursor: "pointer",
  textDecoration: "none",
  color: "#000",
  display: "inline-block",
};

function todayString() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

export default function TodayPage() {
  const [households, setHouseholds] = useState([]);
  const [message, setMessage] = useState("Loading...");
  const [selectedDate, setSelectedDate] = useState(todayString());
  const [agentFilter, setAgentFilter] = useState("All");

  async function loadHouseholds() {
    setMessage("Loading...");

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) {
      setMessage("You must be signed in to view today's dashboard.");
      return;
    }

    const { data, error } = await supabase
      .from("households")
      .select(`
        id,
        created_at,
        assigned_agent,
        reason_for_call,
        status,
        appointment_type,
        appointment_date,
        appointment_time,
        appointment_duration,
        appointment_location,
        current_premium,
        proposed_premium,
        recommended_carrier,
        recommended_plan,
        effective_date,
        health_flags,
        notes,
        people (
          id,
          person_type,
          first_name,
          last_name,
          phone,
          email,
          age,
          zip,
          coverage_type
        )
      `)
      .eq("owner_user_id", userId)
      .eq("appointment_date", selectedDate)
      .order("appointment_time", { ascending: true });

    if (error) {
      setMessage(error.message);
      return;
    }

    setHouseholds(data || []);
    setMessage("");
  }

  useEffect(() => {
    loadHouseholds();
  }, [selectedDate]);

  const filteredHouseholds = useMemo(() => {
    if (agentFilter === "All") return households;

    return households.filter((household) => {
      return (
        household.assigned_agent === agentFilter ||
        household.notes?.includes(agentFilter)
      );
    });
  }, [households, agentFilter]);

  return (
    <main style={{ padding: "32px", fontFamily: "Arial, sans-serif", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Agent Daily Dashboard</h1>
      <p>Today’s appointments and working list.</p>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "20px" }}>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={inputStyle}
        />

        <select
          value={agentFilter}
          onChange={(e) => setAgentFilter(e.target.value)}
          style={inputStyle}
        >
          {agentOptions.map((agent) => (
            <option key={agent} value={agent}>
              {agent}
            </option>
          ))}
        </select>
      </section>

      {message ? <p>{message}</p> : null}

      {!message ? (
        <p style={{ marginTop: "20px" }}>
          Showing {filteredHouseholds.length} appointment
          {filteredHouseholds.length === 1 ? "" : "s"}.
        </p>
      ) : null}

      <div style={{ display: "grid", gap: "16px", marginTop: "20px" }}>
        {filteredHouseholds.map((household) => {
          const client = household.people?.find((p) => p.person_type === "client");
          const clientName = `${client?.first_name || ""} ${client?.last_name || ""}`.trim() || "Client";

          return (
            <section key={household.id} style={cardStyle}>
              <h2 style={{ margin: 0 }}>
                {household.appointment_time || "--:--"} — {clientName}
              </h2>

              <div><strong>Type:</strong> {household.appointment_type || household.reason_for_call || "-"}</div>
              <div><strong>Agent/AOR:</strong> {household.assigned_agent || "-"}</div>
              <div><strong>Location:</strong> {household.appointment_location || "-"}</div>
              <div><strong>Phone:</strong> {client?.phone || "-"}</div>
              <div><strong>Email:</strong> {client?.email || "-"}</div>
              <div><strong>Age:</strong> {client?.age || "-"}</div>
              <div><strong>ZIP:</strong> {client?.zip || "-"}</div>
              <div><strong>Status:</strong> {household.status || "New Lead"}</div>

              <div>
                <strong>Premiums:</strong>{" "}
                Current {household.current_premium || "-"} / Proposed {household.proposed_premium || "-"}
              </div>

              <div>
                <strong>Recommendation:</strong>{" "}
                {household.recommended_carrier || "-"} {household.recommended_plan || ""}
              </div>

              <div>
                <strong>Health Flags:</strong>{" "}
                {household.health_flags?.length ? household.health_flags.join(", ") : "None"}
              </div>

              <div>
                <strong>Notes:</strong> {household.notes || "-"}
              </div>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "8px" }}>
                <a href={`/households/${household.id}`} style={buttonStyle}>
                  Open Household Detail
                </a>

                {client?.phone ? (
                  <a href={`tel:${client.phone}`} style={buttonStyle}>
                    Call Client
                  </a>
                ) : null}

                {client?.email ? (
                  <a href={`mailto:${client.email}`} style={buttonStyle}>
                    Email Client
                  </a>
                ) : null}

                <a href="https://calendar.google.com/" target="_blank" style={buttonStyle}>
                  Open Calendar
                </a>
              </div>
            </section>
          );
        })}

        {!message && filteredHouseholds.length === 0 ? (
          <p>No appointments found for this date.</p>
        ) : null}
      </div>
    </main>
  );
}
