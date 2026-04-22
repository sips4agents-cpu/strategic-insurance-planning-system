"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const formOptions = [
  { label: "Form L564", url: "https://www.cms.gov/medicare/cms-forms/cms-forms/downloads/cms-l564e.pdf" },
  { label: "Form Part B Enrollment", url: "https://www.cms.gov/medicare/cms-forms/cms-forms/downloads/cms40b-e.pdf" },
  { label: "IRMAA Link", url: "https://www.medicare.gov/publications/11579-medicare-costs.pdf" },
  { label: "HSA Guideline", url: "https://www.irs.gov/publications/p969" },
  { label: "Quick Rater", url: "/rate-summary" },
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

const statusOptions = [
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
  width: "100%",
};

const buttonStyle = {
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #c9d1d9",
  cursor: "pointer",
};

export default function HouseholdDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [household, setHousehold] = useState(null);
  const [status, setStatus] = useState("New Lead");
  const [health, setHealth] = useState([]);
  const [workingNotes, setWorkingNotes] = useState("");
  const [selectedForm, setSelectedForm] = useState("");
  const [savingWorkflow, setSavingWorkflow] = useState(false);

  async function loadHousehold() {
    const { data, error } = await supabase
      .from("households")
      .select(`*, people (*), intakes (*)`)
      .eq("id", id)
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setHousehold(data);
    setStatus(data?.status || "New Lead");
    setHealth(data?.health_flags || []);
    setWorkingNotes(data?.notes || "");
  }

  useEffect(() => {
    if (id) loadHousehold();
  }, [id]);

  const client = useMemo(
    () => household?.people?.find(p => p.person_type === "client"),
    [household]
  );

  const spouse = useMemo(
    () => household?.people?.find(p => p.person_type === "spouse"),
    [household]
  );

  function toggleHealth(option) {
    setHealth(prev =>
      prev.includes(option)
        ? prev.filter(x => x !== option)
        : [...prev, option]
    );
  }

  async function saveWorkflow() {
    try {
      setSavingWorkflow(true);

      const { error } = await supabase
        .from("households")
        .update({
          status: status,
          health_flags: health,
          notes: workingNotes,
        })
        .eq("id", id);

      if (error) {
        alert("Save failed: " + error.message);
        setSavingWorkflow(false);
        return;
      }

      await loadHousehold();
      setSavingWorkflow(false);
      alert("Saved successfully.");
    } catch (err) {
      alert("Unexpected error");
      setSavingWorkflow(false);
    }
  }

  async function deleteHousehold() {
    if (!confirm("Delete contact?")) return;

    const { error } = await supabase
      .from("households")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.replace("/clients");
  }

  function sendEmail(link) {
    if (!client?.email) return alert("No email");
    window.location.href =
      `mailto:${client.email}?body=${encodeURIComponent(link)}`;
  }

  if (!household) return <p>Loading...</p>;

  return (
    <main style={{ padding: "32px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1>Household Detail</h1>

      <div>
        <strong>Agent:</strong> {household.assigned_agent}
      </div>

      <div>
        <strong>Reason:</strong> {household.reason_for_call}
      </div>

      <h3>Status</h3>
      <select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>
        {statusOptions.map(x => <option key={x}>{x}</option>)}
      </select>

      <h3>Notes</h3>
      <textarea
        value={workingNotes}
        onChange={e => setWorkingNotes(e.target.value)}
        style={inputStyle}
      />

      <button onClick={saveWorkflow} style={buttonStyle}>
        Save Status & Notes
      </button>

      <button onClick={deleteHousehold} style={{ ...buttonStyle, color: "red" }}>
        Delete Contact
      </button>

      <h3>Client</h3>
      <div>{client?.first_name} {client?.last_name}</div>

      <h3>Health</h3>
      {healthOptions.map(option => (
        <label key={option}>
          <input
            type="checkbox"
            checked={health.includes(option)}
            onChange={() => toggleHealth(option)}
          />
          {option}
        </label>
      ))}

      <h3>Forms</h3>
      <select onChange={e => setSelectedForm(e.target.value)}>
        <option>Select Form</option>
        {formOptions.map(f => (
          <option key={f.label} value={f.url}>{f.label}</option>
        ))}
      </select>

      <button onClick={() => sendEmail(selectedForm)}>Email</button>
      <button onClick={() => window.open(selectedForm)}>Open</button>
    </main>
  );
}
