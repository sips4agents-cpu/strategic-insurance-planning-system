"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const formOptions = [
  {
    label: "Form L564",
    url: "https://www.cms.gov/medicare/cms-forms/cms-forms/downloads/cms-l564e.pdf",
  },
  {
    label: "Form Part B Enrollment",
    url: "https://www.cms.gov/medicare/cms-forms/cms-forms/downloads/cms40b-e.pdf",
  },
  {
    label: "IRMAA Link",
    url: "https://www.medicare.gov/publications/11579-medicare-costs.pdf",
  },
  {
    label: "HSA Guideline",
    url: "https://www.irs.gov/publications/p969",
  },
  {
    label: "Quick Rater",
    url: "/rate-summary",
  },
];

const healthOptions = [
  "Cognitive impairment",
  "Heart",
  "Stroke or TIA",
  "Diabetes with insulin",
  "AFIB",
  "More than 2 hospital stays",
  "Surgeries pending",
];

const cardStyle = {
  border: "1px solid #d0d7de",
  borderRadius: "10px",
  padding: "20px",
  display: "grid",
  gap: "12px",
};

const inputStyle = {
  padding: "12px",
  border: "1px solid #c9d1d9",
  borderRadius: "8px",
  fontSize: "14px",
  width: "100%",
  boxSizing: "border-box",
};

const buttonStyle = {
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #c9d1d9",
  background: "#fff",
  cursor: "pointer",
};

function PersonCard({ title, person }) {
  return (
    <section style={cardStyle}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <div><strong>Name:</strong> {person ? `${person.first_name || ""} ${person.last_name || ""}`.trim() || "-" : "-"}</div>
      <div><strong>Phone:</strong> {person?.phone || "-"}</div>
      <div><strong>Email:</strong> {person?.email || "-"}</div>
      <div><strong>Birthdate:</strong> {person?.birthdate || "-"}</div>
      <div><strong>Age:</strong> {person?.age || "-"}</div>
      <div><strong>Sex:</strong> {person?.sex || "-"}</div>
      <div><strong>Tobacco:</strong> {person?.tobacco || "-"}</div>
      <div><strong>Coverage Type:</strong> {person?.coverage_type || "-"}</div>
      <div><strong>Address:</strong> {person?.address || "-"}</div>
      <div><strong>City:</strong> {person?.city || "-"}</div>
      <div><strong>State:</strong> {person?.state || "-"}</div>
      <div><strong>ZIP:</strong> {person?.zip || "-"}</div>
    </section>
  );
}

export default function HouseholdDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [household, setHousehold] = useState(null);
  const [selectedForm, setSelectedForm] = useState("");
  const [health, setHealth] = useState([]);
  const [message, setMessage] = useState("Loading...");
  const [workingNotes, setWorkingNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function loadHousehold() {
    const { data, error } = await supabase
      .from("households")
      .select(`
        id,
        created_at,
        assigned_agent,
        notes,
        people (*),
        intakes (
          id,
          created_at,
          notes
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      setMessage(error.message);
      return;
    }

    setHousehold(data);
    setWorkingNotes(data?.notes || "");
    setMessage("");
  }

  useEffect(() => {
    if (id) loadHousehold();
  }, [id]);

  const client = useMemo(
    () => household?.people?.find((p) => p.person_type === "client"),
    [household]
  );

  const spouse = useMemo(
    () => household?.people?.find((p) => p.person_type === "spouse"),
    [household]
  );

  const intakeHistory = useMemo(() => {
    if (!household?.intakes) return [];
    return [...household.intakes].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [household]);

  function toggleHealth(option) {
    setHealth((prev) =>
      prev.includes(option)
        ? prev.filter((x) => x !== option)
        : [...prev, option]
    );
  }

  function sendEmail(link) {
    const email = client?.email;
    if (!email) {
      alert("No client email found.");
      return;
    }
    if (!link) {
      alert("Please select a form first.");
      return;
    }

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      "Requested Form / Link"
    )}&body=${encodeURIComponent(link)}`;
  }

  async function saveWorkingNotes() {
    setSavingNotes(true);

    const { error } = await supabase
      .from("households")
      .update({ notes: workingNotes })
      .eq("id", id);

    if (error) {
      alert(error.message);
      setSavingNotes(false);
      return;
    }

    await loadHousehold();
    setSavingNotes(false);
    alert("Working notes saved.");
  }

  async function deleteHousehold() {
    const confirmed = window.confirm(
      "Delete this contact/household? This will also remove linked people and intake history."
    );

    if (!confirmed) return;

    setDeleting(true);

    const { error } = await supabase
      .from("households")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      setDeleting(false);
      return;
    }

    window.location.replace("/clients");
  }

  if (message) {
    return <p style={{ padding: "32px", fontFamily: "Arial" }}>{message}</p>;
  }

  return (
    <main style={{ padding: "32px", fontFamily: "Arial", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Household Detail</h1>

      <section style={{ ...cardStyle, marginBottom: "20px" }}>
        <div>
          <strong>Assigned Agent:</strong> {household?.assigned_agent || "-"}
        </div>

        <div>
          <strong>Current Working Notes</strong>
        </div>

        <textarea
          value={workingNotes}
          onChange={(e) => setWorkingNotes(e.target.value)}
          rows={5}
          style={inputStyle}
          placeholder="Add or update current working notes here"
        />

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button onClick={saveWorkingNotes} style={buttonStyle} disabled={savingNotes}>
            {savingNotes ? "Saving..." : "Save Working Notes"}
          </button>

          <button
            onClick={deleteHousehold}
            style={{ ...buttonStyle, borderColor: "#c00", color: "#c00" }}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete Contact"}
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <PersonCard title="Client" person={client} />
        <PersonCard title="Spouse" person={spouse} />
      </div>

      <section style={{ ...cardStyle, marginTop: "20px" }}>
        <h2 style={{ marginTop: 0 }}>Forms & Quote Actions</h2>

        <select
          value={selectedForm}
          onChange={(e) => setSelectedForm(e.target.value)}
          style={inputStyle}
        >
          <option value="">Select Form</option>
          {formOptions.map((form, index) => (
            <option key={index} value={form.url}>
              {form.label}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button onClick={() => sendEmail(selectedForm)} style={buttonStyle}>
            Email Form
          </button>

          <button
            onClick={() => {
              if (!selectedForm) {
                alert("Please select a form first.");
                return;
              }
              window.open(selectedForm, "_blank");
            }}
            style={buttonStyle}
          >
            Open Form
          </button>
        </div>
      </section>

      <section style={{ ...cardStyle, marginTop: "20px" }}>
        <h2 style={{ marginTop: 0 }}>Health Status</h2>

        {healthOptions.map((option) => (
          <label key={option} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              checked={health.includes(option)}
              onChange={() => toggleHealth(option)}
            />
            {option}
          </label>
        ))}

        <div style={{ marginTop: "12px" }}>
          <strong>Selected:</strong> {health.length ? health.join(", ") : "None"}
        </div>
      </section>

      <section style={{ ...cardStyle, marginTop: "20px" }}>
        <h2 style={{ marginTop: 0 }}>Intake History</h2>

        {intakeHistory.length === 0 ? (
          <div>No intake history found.</div>
        ) : (
          intakeHistory.map((entry) => (
            <div
              key={entry.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "12px",
              }}
            >
              <div>
                <strong>Date:</strong>{" "}
                {entry.created_at
                  ? new Date(entry.created_at).toLocaleString()
                  : "-"}
              </div>
              <div>
                <strong>Notes:</strong> {entry.notes || "-"}
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
