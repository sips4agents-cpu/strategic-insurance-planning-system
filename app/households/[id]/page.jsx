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

export default function HouseholdDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [household, setHousehold] = useState(null);
  const [selectedForm, setSelectedForm] = useState("");
  const [health, setHealth] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("households")
        .select(`
          id,
          assigned_agent,
          notes,
          people (*)
        `)
        .eq("id", id)
        .single();

      setHousehold(data);
    }

    if (id) load();
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

  function sendEmail(link) {
    const email = client?.email;
    if (!email) return alert("No email");

    window.location.href =
      `mailto:${email}?subject=Info&body=${encodeURIComponent(link)}`;
  }

  if (!household) {
    return <p style={{ padding: "32px" }}>Loading...</p>;
  }

  return (
    <main style={{ padding: "32px", fontFamily: "Arial" }}>
      <h1>Household Detail</h1>
<div style={{ marginTop: "16px", marginBottom: "20px", display: "grid", gap: "8px" }}>
  <div>
    <strong>Assigned Agent:</strong> {household?.assigned_agent || "-"}
  </div>
  <div>
    <strong>Notes:</strong> {household?.notes || "-"}
  </div>
</div>
      <h2>Client</h2>
      <div>{client?.first_name} {client?.last_name}</div>
      <div>{client?.phone}</div>
      <div>{client?.email}</div>

      <h2 style={{ marginTop: "20px" }}>Spouse</h2>
      <div>{spouse?.first_name || "-"}</div>

      <h2 style={{ marginTop: "20px" }}>Forms</h2>
      <select onChange={(e) => setSelectedForm(e.target.value)}>
        <option>Select Form</option>
        {formOptions.map((f, i) => (
          <option key={i} value={f.url}>{f.label}</option>
        ))}
      </select>

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => sendEmail(selectedForm)}>
          Email Form
        </button>
        <button onClick={() => window.open(selectedForm)}>
          Open Form
        </button>
      </div>

      <h2 style={{ marginTop: "20px" }}>Health Status</h2>
      {healthOptions.map(option => (
        <label key={option} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={health.includes(option)}
            onChange={() => toggleHealth(option)}
          />
          {option}
        </label>
      ))}

      <div style={{ marginTop: "20px" }}>
        <strong>Selected:</strong> {health.join(", ") || "None"}
      </div>
    </main>
  );
}
