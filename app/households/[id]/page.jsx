"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

export default function HouseholdDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [household, setHousehold] = useState(null);
  const [workingNotes, setWorkingNotes] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/households/${id}`);
      const data = await res.json();
      setHousehold(data);
      setWorkingNotes(data?.notes || "");
    }
    if (id) load();
  }, [id]);

  const client = useMemo(
    () => household?.people?.find((p) => p.person_type === "client"),
    [household]
  );

  async function createCalendarEvent() {
    const start = new Date();
    const end = new Date(start.getTime() + 30 * 60000);

    const res = await fetch("/api/calendar/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: `${client?.first_name || ""} ${client?.last_name || ""} Appointment`,
        description: workingNotes || "Client appointment",
        location: "Office",
        start: start.toISOString(),
        end: end.toISOString()
      })
    });

    const data = await res.json();

    if (data.success) {
      alert("Calendar event created!");
    } else {
      alert("Error: " + data.error);
    }
  }

  if (!household) return <p>Loading...</p>;

  return (
    <main style={{ padding: "32px", fontFamily: "Arial" }}>
      <h1>Household Detail</h1>

      <div>
        <strong>Client:</strong>{" "}
        {client?.first_name} {client?.last_name}
      </div>

      <div style={{ marginTop: "20px" }}>
        <strong>Notes</strong>
        <textarea
          value={workingNotes}
          onChange={(e) => setWorkingNotes(e.target.value)}
          style={{ width: "100%", height: "100px" }}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={createCalendarEvent}>
          Create Calendar Event
        </button>
      </div>
    </main>
  );
}
