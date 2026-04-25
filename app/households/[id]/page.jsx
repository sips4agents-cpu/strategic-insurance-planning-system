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

const schedulerAgentOptions = [
  "Admin",
  "Loyd Richardson",
  "Blake Richardson",
  "William Sykes",
  "Jimmie Bassett",
  "Christiana Grant",
];

const agentColorLabels = {
  Admin: "Purple",
  "Loyd Richardson": "Green",
  "Blake Richardson": "Orange",
  "William Sykes": "Blue",
  "Jimmie Bassett": "Red",
  "Christiana Grant": "Purple",
};

const appointmentCodeMap = {
  "Phone appointment": "P/A",
  "Office appointment": "O/A",
  Service: "S",
  "Follow up": "F/U",
  "Urgent call": "ASAP",
  "Claims issue": "ASAP",
  "Prescription drug plan": "PDP",
  Referral: "REF",
  "Business/HR director": "HR",
};

const agentInitialsMap = {
  "Loyd Richardson": "LR",
  "Blake Richardson": "BR",
  "William Sykes": "WS",
  "Jimmie Bassett": "JB",
  "Christiana Grant": "CG",
  Admin: "ADMIN",
};

const pageStyle = {
  padding: "32px",
  fontFamily: "Arial, sans-serif",
  maxWidth: "1200px",
  margin: "0 auto",
};

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
  textDecoration: "none",
  color: "#000",
  display: "inline-block",
};

function PersonCard({ title, person }) {
  return (
    <section style={cardStyle}>
      <h2 style={{ margin: 0 }}>{title}</h2>
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
  const [message, setMessage] = useState("Loading...");
  const [workingNotes, setWorkingNotes] = useState("");
  const [status, setStatus] = useState("New Lead");
  const [health, setHealth] = useState([]);
  const [selectedForms, setSelectedForms] = useState([]);
  const [savingNotes, setSavingNotes] = useState(false);
  const [savingWorkflow, setSavingWorkflow] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [schedulerAgent, setSchedulerAgent] = useState("Admin");
  const [appointmentType, setAppointmentType] = useState("Phone appointment");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentDuration, setAppointmentDuration] = useState("30");
  const [appointmentLocation, setAppointmentLocation] = useState("Office");
  const [availabilityMessage, setAvailabilityMessage] = useState("");

  const [currentPremium, setCurrentPremium] = useState("");
  const [proposedPremium, setProposedPremium] = useState("");
  const [recommendedCarrier, setRecommendedCarrier] = useState("");
  const [recommendedPlan, setRecommendedPlan] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [quickRaterUrl, setQuickRaterUrl] = useState("");
  const [medicareProUrl, setMedicareProUrl] = useState("");
  const [mondayItemUrl, setMondayItemUrl] = useState("");
  const [savingQuote, setSavingQuote] = useState(false);

  async function loadHousehold() {
    const { data, error } = await supabase
      .from("households")
      .select(`
        id,
        created_at,
        assigned_agent,
        notes,
        reason_for_call,
        status,
        health_flags,
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
        quote_notes,
        quick_rater_url,
        medicare_pro_url,
        monday_item_url,
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
    setStatus(data?.status || "New Lead");
    setHealth(data?.health_flags || []);
    setAppointmentType(data?.appointment_type || data?.reason_for_call || "Phone appointment");
    setAppointmentDate(data?.appointment_date || "");
    setAppointmentTime(data?.appointment_time || "");
    setAppointmentDuration(String(data?.appointment_duration || 30));
    setAppointmentLocation(data?.appointment_location || "Office");

    setCurrentPremium(data?.current_premium || "");
    setProposedPremium(data?.proposed_premium || "");
    setRecommendedCarrier(data?.recommended_carrier || "");
    setRecommendedPlan(data?.recommended_plan || "");
    setEffectiveDate(data?.effective_date || "");
    setQuoteNotes(data?.quote_notes || "");
    setQuickRaterUrl(data?.quick_rater_url || "");
    setMedicareProUrl(data?.medicare_pro_url || "");
    setMondayItemUrl(data?.monday_item_url || "");

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
      prev.includes(option) ? prev.filter((x) => x !== option) : [...prev, option]
    );
  }

  function toggleForm(url) {
    setSelectedForms((prev) =>
      prev.includes(url) ? prev.filter((x) => x !== url) : [...prev, url]
    );
  }

  function buildAppointmentTimes() {
    if (!appointmentDate || !appointmentTime) {
      alert("Please choose an appointment date and time.");
      return null;
    }

    const start = new Date(`${appointmentDate}T${appointmentTime}:00`);
    const durationMinutes = Number(appointmentDuration || 30);
    const end = new Date(start.getTime() + durationMinutes * 60000);

    return { start, end, durationMinutes };
  }

  async function checkAvailability() {
    const times = buildAppointmentTimes();
    if (!times) return;

    setAvailabilityMessage("Checking availability...");

    const res = await fetch("/api/calendar/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        checkOnly: true,
        agents: [schedulerAgent],
        start: times.start.toISOString(),
        end: times.end.toISOString(),
      }),
    });

    const data = await res.json();

    if (!data.success) {
      setAvailabilityMessage("Error: " + data.error);
      return;
    }

    setAvailabilityMessage(
      data.available
        ? `${schedulerAgent} appears available.`
        : `${schedulerAgent} is already booked at this time.`
    );
  }

  async function createCalendarEvent() {
    const times = buildAppointmentTimes();
    if (!times) return;

    const clientName =
      `${client?.first_name || ""} ${client?.last_name || ""}`.trim() || "Client";

    const typeCode = appointmentCodeMap[appointmentType] || appointmentType;
    const agentCode = agentInitialsMap[schedulerAgent] || schedulerAgent;
    const aorCode =
      agentInitialsMap[household?.assigned_agent] || household?.assigned_agent || "-";

    const healthSummary = health && health.length ? health.join(", ") : "None";
    const title = `[${typeCode}] ${clientName} | ${agentCode}`;

    const description =
      `Reason for Call: ${household?.reason_for_call || appointmentType || "-"}\n` +
      `Assigned Agent: ${schedulerAgent}\n` +
      `Client: ${clientName}\n` +
      `Phone: ${client?.phone || "-"}\n` +
      `Email: ${client?.email || "-"}\n` +
      `Age: ${client?.age || "-"}\n` +
      `ZIP: ${client?.zip || "-"}\n` +
      `AOR: ${aorCode}\n\n` +
      `Premiums:\n` +
      `Current Premium: ${currentPremium || "-"}\n` +
      `Proposed Premium: ${proposedPremium || "-"}\n` +
      `Recommended Carrier: ${recommendedCarrier || "-"}\n` +
      `Recommended Plan: ${recommendedPlan || "-"}\n` +
      `Effective Date: ${effectiveDate || "-"}\n\n` +
      `Health Conditions:\n` +
      `${healthSummary}\n\n` +
      `Notes:\n` +
      `${workingNotes || "-"}`;

    const res = await fetch("/api/calendar/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agents: [schedulerAgent],
        title,
        description,
        location: appointmentLocation || "Office",
        start: times.start.toISOString(),
        end: times.end.toISOString(),
      }),
    });

    const data = await res.json();

    if (data.success) {
      await supabase
  .from("households")
  .update({
    appointment_type: appointmentType,
    appointment_date: appointmentDate,
    appointment_time: appointmentTime,
    appointment_duration: times.durationMinutes,
    appointment_location: appointmentLocation,
    current_premium: currentPremium,
    proposed_premium: proposedPremium,
    recommended_carrier: recommendedCarrier,
    recommended_plan: recommendedPlan,
    effective_date: effectiveDate,
    quote_notes: quoteNotes,
    health_flags: health,
  })
  .eq("id", id);

      setAvailabilityMessage("Calendar event created.");
      alert("Calendar event created!");
    } else {
      setAvailabilityMessage("Error: " + data.error);
      alert("Error: " + data.error);
    }
  }

  async function saveWorkingNotes() {
    setSavingNotes(true);

    const { error } = await supabase
      .from("households")
      .update({ notes: workingNotes })
      .eq("id", id);

    if (error) {
      alert("Save failed: " + error.message);
      setSavingNotes(false);
      return;
    }

    await loadHousehold();
    setSavingNotes(false);
    alert("Working notes saved.");
  }

  async function saveWorkflow() {
    setSavingWorkflow(true);

    const { error } = await supabase
      .from("households")
      .update({
        status,
        health_flags: health,
      })
      .eq("id", id);

    if (error) {
      alert("Save failed: " + error.message);
      setSavingWorkflow(false);
      return;
    }

    await loadHousehold();
    setSavingWorkflow(false);
    alert("Status and health flags saved.");
  }

  async function saveQuotePrep() {
    setSavingQuote(true);

    const { error } = await supabase
      .from("households")
      .update({
        current_premium: currentPremium,
        proposed_premium: proposedPremium,
        recommended_carrier: recommendedCarrier,
        recommended_plan: recommendedPlan,
        effective_date: effectiveDate,
        quote_notes: quoteNotes,
        quick_rater_url: quickRaterUrl,
        medicare_pro_url: medicareProUrl,
        monday_item_url: mondayItemUrl,
      })
      .eq("id", id);

    if (error) {
      alert("Save failed: " + error.message);
      setSavingQuote(false);
      return;
    }

    await loadHousehold();
    setSavingQuote(false);
    alert("Quote prep saved.");
  }

  function copyClientQuoteInfo() {
    const clientName =
      `${client?.first_name || ""} ${client?.last_name || ""}`.trim() || "Client";

    const text =
      `Client: ${clientName}\n` +
      `Phone: ${client?.phone || "-"}\n` +
      `Email: ${client?.email || "-"}\n` +
      `Age: ${client?.age || "-"}\n` +
      `Birthdate: ${client?.birthdate || "-"}\n` +
      `Sex: ${client?.sex || "-"}\n` +
      `Tobacco: ${client?.tobacco || "-"}\n` +
      `ZIP: ${client?.zip || "-"}\n` +
      `Coverage Type: ${client?.coverage_type || "-"}\n` +
      `Reason for Call: ${household?.reason_for_call || "-"}\n` +
      `AOR: ${household?.assigned_agent || "-"}\n\n` +
      `Current Premium: ${currentPremium || "-"}\n` +
      `Proposed Premium: ${proposedPremium || "-"}\n` +
      `Recommended Carrier: ${recommendedCarrier || "-"}\n` +
      `Recommended Plan: ${recommendedPlan || "-"}\n` +
      `Effective Date: ${effectiveDate || "-"}\n\n` +
      `Health Conditions: ${health.length ? health.join(", ") : "None"}\n\n` +
      `Quote Notes:\n${quoteNotes || "-"}\n\n` +
      `Working Notes:\n${workingNotes || "-"}`;

    navigator.clipboard.writeText(text);
    alert("Client quote info copied.");
  }

  function openLink(url, label) {
    if (!url) {
      alert(`Add ${label} link first.`);
      return;
    }

    window.open(url, "_blank");
  }

  async function deleteHousehold() {
    const confirmed = window.confirm(
      "Delete this contact/household? This will also remove linked people and intake history."
    );

    if (!confirmed) return;

    setDeleting(true);

    const { error } = await supabase.from("households").delete().eq("id", id);

    if (error) {
      alert("Delete failed: " + error.message);
      setDeleting(false);
      return;
    }

    window.location.replace("/clients");
  }

  function emailSelectedForms() {
    const email = client?.email;
    if (!email) {
      alert("No client email found.");
      return;
    }

    if (selectedForms.length === 0) {
      alert("Please select at least one form.");
      return;
    }

    const body = selectedForms.join("\n\n");

    window.location.href =
      `mailto:${email}?subject=${encodeURIComponent("Requested Forms / Links")}&body=${encodeURIComponent(body)}`;
  }

  function openSelectedForms() {
    if (selectedForms.length === 0) {
      alert("Please select at least one form.");
      return;
    }

    selectedForms.forEach((url) => window.open(url, "_blank"));
  }

  if (message) {
    return <p style={pageStyle}>{message}</p>;
  }

  return (
    <main style={pageStyle}>
      <h1>Household Detail</h1>
<div style={{ marginBottom: "20px" }}>
  <a href="/today" style={buttonStyle}>
    Go to Daily Dashboard
  </a>
</div>
      <section style={{ ...cardStyle, marginBottom: "20px" }}>
        <div><strong>Agent:</strong> {household?.assigned_agent || "-"}</div>
        <div><strong>Reason for Call:</strong> {household?.reason_for_call || "-"}</div>

        <div><strong>Status</strong></div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
          {statusOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <div><strong>Current Working Notes</strong></div>
        <textarea
          value={workingNotes}
          onChange={(e) => setWorkingNotes(e.target.value)}
          rows={5}
          style={inputStyle}
          placeholder="Add or update current working notes here"
        />

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button onClick={saveWorkingNotes} style={buttonStyle} disabled={savingNotes}>
            {savingNotes ? "Saving..." : "Save Notes"}
          </button>

          <button onClick={saveWorkflow} style={buttonStyle} disabled={savingWorkflow}>
            {savingWorkflow ? "Saving..." : "Save Status & Health Flags"}
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
        <h2 style={{ margin: 0 }}>Appointment Scheduler</h2>

        <select value={schedulerAgent} onChange={(e) => setSchedulerAgent(e.target.value)} style={inputStyle}>
          {schedulerAgentOptions.map((agent) => (
            <option key={agent} value={agent}>
              {agent} — {agentInitialsMap[agent]} — {agentColorLabels[agent]}
            </option>
          ))}
        </select>

        <select value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)} style={inputStyle}>
          <option value="Phone appointment">Phone appointment</option>
          <option value="Office appointment">Office appointment</option>
          <option value="Service">Service</option>
          <option value="Follow up">Follow up</option>
          <option value="Urgent call">Urgent call</option>
          <option value="Claims issue">Claims issue</option>
          <option value="Prescription drug plan">Prescription drug plan</option>
          <option value="Referral">Referral</option>
          <option value="Business/HR director">Business/HR director</option>
        </select>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} style={inputStyle} />
          <input type="time" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} style={inputStyle} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <select value={appointmentDuration} onChange={(e) => setAppointmentDuration(e.target.value)} style={inputStyle}>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
          </select>

          <select value={appointmentLocation} onChange={(e) => setAppointmentLocation(e.target.value)} style={inputStyle}>
            <option value="Office">Office</option>
            <option value="Phone Call">Phone Call</option>
            <option value="Client Home">Client Home</option>
            <option value="Zoom / Virtual">Zoom / Virtual</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button onClick={checkAvailability} style={buttonStyle}>Check Availability</button>
          <button onClick={createCalendarEvent} style={buttonStyle}>Create Calendar Event</button>
        </div>

        {availabilityMessage ? <p>{availabilityMessage}</p> : null}
      </section>

      <section style={{ ...cardStyle, marginTop: "20px" }}>
        <h2 style={{ margin: 0 }}>Health Status</h2>

        <div style={{ display: "grid", gap: "8px" }}>
          {healthOptions.map((option) => (
            <label key={option} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input type="checkbox" checked={health.includes(option)} onChange={() => toggleHealth(option)} />
              {option}
            </label>
          ))}
        </div>

        <div><strong>Selected:</strong> {health.length ? health.join(", ") : "None"}</div>
      </section>

      <section style={{ ...cardStyle, marginTop: "20px" }}>
        <h2 style={{ margin: 0 }}>Quote Prep Panel</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <input value={currentPremium} onChange={(e) => setCurrentPremium(e.target.value)} placeholder="Current Premium" style={inputStyle} />
          <input value={proposedPremium} onChange={(e) => setProposedPremium(e.target.value)} placeholder="Proposed Premium" style={inputStyle} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <input value={recommendedCarrier} onChange={(e) => setRecommendedCarrier(e.target.value)} placeholder="Recommended Carrier" style={inputStyle} />
          <input value={recommendedPlan} onChange={(e) => setRecommendedPlan(e.target.value)} placeholder="Recommended Plan" style={inputStyle} />
        </div>

        <input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} style={inputStyle} />

        <textarea value={quoteNotes} onChange={(e) => setQuoteNotes(e.target.value)} placeholder="Quote Notes" rows={4} style={inputStyle} />

        <input value={quickRaterUrl} onChange={(e) => setQuickRaterUrl(e.target.value)} placeholder="Quick Rater / CSG Link" style={inputStyle} />
        <input value={medicareProUrl} onChange={(e) => setMedicareProUrl(e.target.value)} placeholder="Medicare Pro Link" style={inputStyle} />
        <input value={mondayItemUrl} onChange={(e) => setMondayItemUrl(e.target.value)} placeholder="Monday Item Link" style={inputStyle} />

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button onClick={saveQuotePrep} style={buttonStyle} disabled={savingQuote}>
            {savingQuote ? "Saving..." : "Save Quote Prep"}
          </button>

          <button onClick={copyClientQuoteInfo} style={buttonStyle}>
            Copy Client Info
          </button>

          <button onClick={() => openLink(quickRaterUrl, "Quick Rater")} style={buttonStyle}>
            Open Quick Rater / CSG
          </button>

          <button onClick={() => openLink(medicareProUrl, "Medicare Pro")} style={buttonStyle}>
            Open Medicare Pro
          </button>

          <button onClick={() => openLink(mondayItemUrl, "Monday")} style={buttonStyle}>
            Open Monday
          </button>

          <a href="https://calendar.google.com/" target="_blank" style={buttonStyle}>
            Open Calendar
          </a>
        </div>
      </section>

      <section style={{ ...cardStyle, marginTop: "20px" }}>
        <h2 style={{ margin: 0 }}>Forms</h2>

        <div style={{ display: "grid", gap: "8px" }}>
          {formOptions.map((form, index) => (
            <label key={index} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input type="checkbox" checked={selectedForms.includes(form.url)} onChange={() => toggleForm(form.url)} />
              {form.label}
            </label>
          ))}
        </div>

        <div>
          <strong>Selected:</strong>{" "}
          {selectedForms.length
            ? formOptions.filter((form) => selectedForms.includes(form.url)).map((form) => form.label).join(", ")
            : "None"}
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button onClick={emailSelectedForms} style={buttonStyle}>Email Selected Forms</button>
          <button onClick={openSelectedForms} style={buttonStyle}>Open Selected Forms</button>
        </div>
      </section>

      <section style={{ ...cardStyle, marginTop: "20px" }}>
        <h2 style={{ margin: 0 }}>Intake History</h2>

        {intakeHistory.length === 0 ? (
          <div>No intake history found.</div>
        ) : (
          intakeHistory.map((entry) => (
            <div key={entry.id} style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "12px" }}>
              <div><strong>Date:</strong> {entry.created_at ? new Date(entry.created_at).toLocaleString() : "-"}</div>
              <div><strong>Notes:</strong> {entry.notes || "-"}</div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
