"use client";

import { useEffect, useMemo, useState } from "react";

const agents = [
  { name: "Admin", initials: "ADMIN", color: "Purple", slug: "admin" },
  { name: "Loyd Richardson", initials: "LR", color: "Green", slug: "loyd-richardson" },
  { name: "Blake Richardson", initials: "BR", color: "Orange", slug: "blake-richardson" },
  { name: "William Sykes", initials: "WS", color: "Blue", slug: "william-sykes" },
  { name: "Jimmie Bassett", initials: "JB", color: "Red", slug: "jimmie-bassett" },
  { name: "Christiana Grant", initials: "CG", color: "Purple", slug: "christiana-grant" },
];

const appointmentTypes = [
  "Phone appointment",
  "Office appointment",
  "Service",
  "Follow up",
  "Urgent call",
  "Claims issue",
  "Prescription drug plan",
  "Referral",
  "Business/HR director",
];

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

const healthOptions = [
  "C-PAP",
  "Receiving therapy",
  "Neuropathy",
  "COPD",
  "Cognitive impairment",
  "Heart",
  "Stroke or TIA",
  "Diabetes with insulin",
  "AFIB",
  "More than 2 hospital stays",
  "Surgeries pending",
];

const emailTemplates = {
  "Appointment Confirmation":
    "Hello {{clientName}},\n\nThis confirms your appointment with {{agent}} on {{date}} at {{time}}.\n\nPlease call us if anything changes.\n\nSenior Care Plus",
  "Missing Information":
    "Hello {{clientName}},\n\nWe are missing a few items needed to complete your file. Please contact our office so we can update your information.\n\nSenior Care Plus",
  "Claims Follow Up":
    "Hello {{clientName}},\n\nWe are following up regarding your claims issue. Please send any EOB, facility bill, or claim paperwork available.\n\nSenior Care Plus",
  "Premium Review":
    "Hello {{clientName}},\n\nWe noticed your premium may have increased. Please contact us so we can review your options and make sure your coverage is still the best fit.\n\nSenior Care Plus",
};

const blankPerson = {
  firstName: "",
  lastName: "",
  phone: "",
  phoneConfirm: "",
  email: "",
  birthdate: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  sex: "",
  tobacco: "",
  coverageType: "",
};

const inputStyle = {
  padding: "12px",
  border: "1px solid #c9d1d9",
  borderRadius: "8px",
  fontSize: "14px",
  width: "100%",
  boxSizing: "border-box",
  background: "#fff",
};

const buttonStyle = {
  padding: "11px 14px",
  borderRadius: "8px",
  border: "1px solid #c9d1d9",
  background: "#fff",
  cursor: "pointer",
  textDecoration: "none",
  color: "#000",
  display: "inline-block",
  fontSize: "14px",
};

const primaryButtonStyle = {
  ...buttonStyle,
  background: "#0f172a",
  border: "1px solid #0f172a",
  color: "#fff",
};

const cardStyle = {
  border: "1px solid #d0d7de",
  borderRadius: "12px",
  padding: "18px",
  background: "#fff",
  display: "grid",
  gap: "12px",
};

const pageStyle = {
  padding: "32px",
  fontFamily: "Arial, sans-serif",
  maxWidth: "1100px",
  margin: "0 auto",
  background: "#f6f8fa",
  minHeight: "100vh",
};

function formatPhone(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatBirthdate(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function calculateAge(dateString) {
  const digits = String(dateString || "").replace(/\D/g, "");
  if (digits.length !== 8) return "";

  const month = Number(digits.slice(0, 2));
  const day = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));

  if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900) return "";

  const birthDate = new Date(year, month - 1, day);
  if (birthDate.getFullYear() !== year || birthDate.getMonth() !== month - 1 || birthDate.getDate() !== day) return "";

  const today = new Date();
  let age = today.getFullYear() - year;
  const hadBirthday = today.getMonth() > month - 1 || (today.getMonth() === month - 1 && today.getDate() >= day);
  if (!hadBirthday) age -= 1;
  if (age < 0 || age > 120) return "";
  return String(age);
}

function applyTemplate(template, data) {
  return template
    .replaceAll("{{clientName}}", data.clientName || "Client")
    .replaceAll("{{agent}}", data.agent || "Admin")
    .replaceAll("{{date}}", data.date || "appointment date")
    .replaceAll("{{time}}", data.time || "appointment time");
}

function safeJsonParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function makeEventId() {
  return `event-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function buildAppointmentStartEnd(date, time, duration) {
  if (!date || !time) return null;
  const start = new Date(`${date}T${time}:00`);
  if (Number.isNaN(start.getTime())) return null;
  const durationMinutes = Number(duration || 60);
  const end = new Date(start.getTime() + durationMinutes * 60000);
  return { start, end, durationMinutes };
}

function PersonSection({ title, data, age, onUpdate }) {
  const phoneMatches = !data.phoneConfirm || data.phone === data.phoneConfirm;

  function updateField(field, value) {
    if (field === "phone" || field === "phoneConfirm") onUpdate(field, formatPhone(value));
    else if (field === "birthdate") onUpdate(field, formatBirthdate(value));
    else onUpdate(field, value);
  }

  return (
    <section style={cardStyle}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <input value={data.firstName} onChange={(e) => updateField("firstName", e.target.value)} placeholder={`${title} First Name`} style={inputStyle} />
        <input value={data.lastName} onChange={(e) => updateField("lastName", e.target.value)} placeholder={`${title} Last Name`} style={inputStyle} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <input value={data.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder={`${title} Phone`} style={inputStyle} />
        <input value={data.email} onChange={(e) => updateField("email", e.target.value)} placeholder={`${title} Email`} style={inputStyle} />
      </div>

      {data.phone ? (
        <div>
          <input value={data.phoneConfirm} onChange={(e) => updateField("phoneConfirm", e.target.value)} placeholder={`Re-enter ${title} Phone`} style={inputStyle} />
          <div style={{ marginTop: "6px", fontSize: "13px", color: phoneMatches ? "#166534" : "#b91c1c" }}>
            {phoneMatches ? "Phone verified" : "Phone numbers do not match"}
          </div>
        </div>
      ) : null}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <input
          value={data.birthdate}
          onChange={(e) => updateField("birthdate", e.target.value)}
          placeholder={`${title} Birthdate MM/DD/YYYY`}
          inputMode="numeric"
          style={inputStyle}
        />
        <input value={age} readOnly placeholder={`${title} Age`} style={{ ...inputStyle, background: "#f8fafc" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <input value={data.address} onChange={(e) => updateField("address", e.target.value)} placeholder={`${title} Address`} style={inputStyle} />
        <input value={data.city} onChange={(e) => updateField("city", e.target.value)} placeholder={`${title} City`} style={inputStyle} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <input value={data.state} onChange={(e) => updateField("state", e.target.value)} placeholder="State" style={inputStyle} />
        <input value={data.zip} onChange={(e) => updateField("zip", e.target.value)} placeholder="ZIP" style={inputStyle} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
        <select value={data.sex} onChange={(e) => updateField("sex", e.target.value)} style={inputStyle}>
          <option value="">Sex</option>
          <option>Male</option>
          <option>Female</option>
        </select>
        <select value={data.tobacco} onChange={(e) => updateField("tobacco", e.target.value)} style={inputStyle}>
          <option value="">Tobacco</option>
          <option>Yes</option>
          <option>No</option>
        </select>
        <select value={data.coverageType} onChange={(e) => updateField("coverageType", e.target.value)} style={inputStyle}>
          <option value="">Coverage Type</option>
          <option>Group coverage</option>
          <option>Medicare</option>
          <option>Individual coverage</option>
          <option>Other</option>
        </select>
      </div>
    </section>
  );
}

export default function SipsConnectLiveSingleFile() {
  const [page, setPage] = useState("dashboard");
  const [selectedAgent, setSelectedAgent] = useState(agents[1]);
  const [client, setClient] = useState({ ...blankPerson });
  const [spouse, setSpouse] = useState({ ...blankPerson });
  const [status, setStatus] = useState("New Intake");
  const [referredBy, setReferredBy] = useState("");
  const [currentCoverage, setCurrentCoverage] = useState("");
  const [currentPremium, setCurrentPremium] = useState("");
  const [notes, setNotes] = useState("");
  const [assignedAgent, setAssignedAgent] = useState("Admin");
  const [appointmentType, setAppointmentType] = useState("Service");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentDuration, setAppointmentDuration] = useState("60");
  const [appointmentLocation, setAppointmentLocation] = useState("Phone Call");
  const [health, setHealth] = useState([]);
  const [templateName, setTemplateName] = useState("Appointment Confirmation");
  const [savedMessage, setSavedMessage] = useState("");
  const [calendarMessage, setCalendarMessage] = useState("");
  const [savedEvents, setSavedEvents] = useState([]);
  const [savedHouseholds, setSavedHouseholds] = useState([]);

  const clientAge = useMemo(() => calculateAge(client.birthdate), [client.birthdate]);
  const spouseAge = useMemo(() => calculateAge(spouse.birthdate), [spouse.birthdate]);
  const clientName = `${client.firstName} ${client.lastName}`.trim() || "Client";
  const selectedTemplate = applyTemplate(emailTemplates[templateName], {
    clientName,
    agent: assignedAgent,
    date: appointmentDate,
    time: appointmentTime,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    setSavedEvents(safeJsonParse(window.localStorage.getItem("sipsCalendarEvents"), []));
    setSavedHouseholds(safeJsonParse(window.localStorage.getItem("sipsHouseholds"), []));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("sipsCalendarEvents", JSON.stringify(savedEvents));
  }, [savedEvents]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("sipsHouseholds", JSON.stringify(savedHouseholds));
  }, [savedHouseholds]);

  function updateClient(field, value) {
    setClient((prev) => ({ ...prev, [field]: value }));
  }

  function updateSpouse(field, value) {
    setSpouse((prev) => ({ ...prev, [field]: value }));
  }

  function toggleHealth(option) {
    setHealth((prev) => (prev.includes(option) ? prev.filter((x) => x !== option) : [...prev, option]));
  }

  function getAgentStatus(agentName) {
    const now = new Date();
    const currentEvent = savedEvents.find((event) => {
      if (event.agent !== agentName) return false;
      const start = new Date(event.startIso);
      const end = new Date(event.endIso);
      return start <= now && now <= end;
    });

    if (currentEvent) return { label: "Busy", detail: currentEvent.title, color: "#b91c1c" };
    return { label: "Available", detail: "No local event is blocking this time", color: "#166534" };
  }

  function hasAppointmentConflict(agentName, startIso, endIso) {
    const start = new Date(startIso);
    const end = new Date(endIso);
    return savedEvents.some((event) => {
      if (event.agent !== agentName) return false;
      const eventStart = new Date(event.startIso);
      const eventEnd = new Date(event.endIso);
      return start < eventEnd && end > eventStart;
    });
  }

  function buildEventPayload() {
    const times = buildAppointmentStartEnd(appointmentDate, appointmentTime, appointmentDuration);
    if (!times) return { error: "Enter appointment date and time first." };

    const typeCode = appointmentCodeMap[appointmentType] || appointmentType;
    const agentObj = agents.find((a) => a.name === assignedAgent) || agents[0];
    const healthSummary = health.length ? health.join(", ") : "None";
    const title = `[${typeCode}] ${clientName} | ${agentObj.initials}`;

    const description =
      `OPEN ADMIN: /dashboard\n` +
      `OPEN HOUSEHOLD: /dashboard\n\n` +
      `Status: ${status || "-"}\n` +
      `Reason for Call: ${appointmentType || "-"}\n` +
      `Assigned Agent: ${assignedAgent}\n` +
      `Client: ${clientName}\n` +
      `Phone: ${client.phone || "-"}\n` +
      `Email: ${client.email || "-"}\n` +
      `Age: ${clientAge || "-"}\n` +
      `ZIP: ${client.zip || "-"}\n` +
      `Referred By: ${referredBy || "-"}\n` +
      `Current Coverage: ${currentCoverage || "-"}\n` +
      `Current Premium: ${currentPremium || "-"}\n\n` +
      `Health Conditions:\n${healthSummary}\n\n` +
      `Notes:\n${notes || "-"}`;

    return {
      id: makeEventId(),
      agent: assignedAgent,
      title,
      description,
      location: appointmentLocation || "Office",
      startIso: times.start.toISOString(),
      endIso: times.end.toISOString(),
      date: appointmentDate,
      time: appointmentTime,
      duration: times.durationMinutes,
      clientName,
      status,
      type: appointmentType,
    };
  }

  function checkAvailability() {
    const payload = buildEventPayload();
    if (payload.error) {
      setCalendarMessage(payload.error);
      return;
    }

    const conflict = hasAppointmentConflict(payload.agent, payload.startIso, payload.endIso);
    setCalendarMessage(conflict ? `${payload.agent} is already booked at this time.` : `${payload.agent} appears available at this time.`);
  }

  async function createCalendarEvent() {
    const payload = buildEventPayload();
    if (payload.error) {
      setCalendarMessage(payload.error);
      return;
    }

    if (hasAppointmentConflict(payload.agent, payload.startIso, payload.endIso)) {
      setCalendarMessage(`${payload.agent} already has an event at this time. Change the time or agent.`);
      return;
    }

    setCalendarMessage("Saving calendar event...");

    try {
      const res = await fetch("/api/calendar/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agents: [payload.agent],
          title: payload.title,
          description: payload.description,
          location: payload.location,
          start: payload.startIso,
          end: payload.endIso,
        }),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.success !== false) {
          setSavedEvents((prev) => [{ ...payload, googleCalendarSaved: true }, ...prev]);
          setCalendarMessage("Calendar event saved and added to the local calendar list.");
          return;
        }
        setCalendarMessage(`Calendar API returned an error, so I saved it locally instead: ${data.error || "Unknown error"}`);
      } else {
        setCalendarMessage("Calendar API is not connected yet, so I saved it locally inside this page.");
      }
    } catch {
      setCalendarMessage("Calendar API is not connected yet, so I saved it locally inside this page.");
    }

    setSavedEvents((prev) => [{ ...payload, googleCalendarSaved: false }, ...prev]);
  }

  function saveAdminIntake() {
    const clientPhoneBad = client.phone && client.phoneConfirm && client.phone !== client.phoneConfirm;
    const spousePhoneBad = spouse.phone && spouse.phoneConfirm && spouse.phone !== spouse.phoneConfirm;

    if (clientPhoneBad) {
      setSavedMessage("Client phone numbers do not match.");
      return;
    }
    if (spousePhoneBad) {
      setSavedMessage("Spouse phone numbers do not match.");
      return;
    }

    const household = {
      id: `household-${Date.now()}`,
      createdAt: new Date().toISOString(),
      client,
      spouse,
      clientAge,
      spouseAge,
      status,
      assignedAgent,
      referredBy,
      currentCoverage,
      currentPremium,
      notes,
      health,
      appointmentType,
      appointmentDate,
      appointmentTime,
      appointmentDuration,
      appointmentLocation,
    };

    setSavedHouseholds((prev) => [household, ...prev]);
    setSavedMessage("Admin intake saved. It will show on Household, Clients, and Today inside this single-page system.");
  }

  function clearForm() {
    setClient({ ...blankPerson });
    setSpouse({ ...blankPerson });
    setStatus("New Intake");
    setReferredBy("");
    setCurrentCoverage("");
    setCurrentPremium("");
    setNotes("");
    setHealth([]);
    setAppointmentDate("");
    setAppointmentTime("");
    setAppointmentDuration("60");
    setAppointmentLocation("Phone Call");
    setSavedMessage("Form cleared.");
  }

  function NavButtons({ household = true }) {
    return (
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "18px" }}>
        <button type="button" onClick={() => setPage("dashboard")} style={primaryButtonStyle}>Dashboard</button>
        <button type="button" onClick={() => setPage("admin")} style={buttonStyle}>Back to Admin</button>
        <button type="button" onClick={() => setPage("calendar")} style={buttonStyle}>Go to Calendar</button>
        {household ? <button type="button" onClick={() => setPage("household")} style={buttonStyle}>Back to Household</button> : null}
        <button type="button" onClick={() => setPage("clients")} style={buttonStyle}>Clients</button>
        <button type="button" onClick={() => setPage("today")} style={buttonStyle}>Today</button>
      </div>
    );
  }

  function DashboardPage() {
    return (
      <main style={pageStyle}>
        <h1>SIPS Connect Dashboard</h1>
        <NavButtons household={false} />

        <section style={cardStyle}>
          <h2 style={{ margin: 0 }}>Agent Status</h2>
          <div style={{ display: "grid", gap: "12px" }}>
            {agents.filter((a) => a.name !== "Admin").map((agent) => {
              const agentStatus = getAgentStatus(agent.name);
              return (
                <div key={agent.slug} style={{ border: "1px solid #d0d7de", borderRadius: "10px", padding: "14px", display: "grid", gap: "10px" }}>
                  <strong>{agent.name} — {agent.initials} — {agent.color}</strong>
                  <div><span style={{ color: agentStatus.color, fontWeight: "bold" }}>{agentStatus.label}</span> — {agentStatus.detail}</div>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button type="button" style={buttonStyle} onClick={() => alert(`${agent.name}: ${agentStatus.label} — ${agentStatus.detail}`)}>Check Status</button>
                    <button type="button" style={buttonStyle} onClick={() => { setSelectedAgent(agent); setPage("agent"); }}>Go to Agent Page</button>
                    <button type="button" style={buttonStyle} onClick={() => { setSelectedAgent(agent); setAssignedAgent(agent.name); setPage("calendar"); }}>Go to Calendar</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section style={cardStyle}>
          <h2 style={{ margin: 0 }}>Fast Actions</h2>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button type="button" style={primaryButtonStyle} onClick={() => setPage("admin")}>Open Admin Intake</button>
            <button type="button" style={buttonStyle} onClick={() => setPage("calendar")}>Open Calendar</button>
            <button type="button" style={buttonStyle} onClick={() => setPage("clients")}>Open Clients</button>
            <button type="button" style={buttonStyle} onClick={() => setPage("today")}>Open Today</button>
          </div>
        </section>
      </main>
    );
  }

  function AdminPage() {
    return (
      <main style={pageStyle}>
        <h1>Admin Intake</h1>
        <NavButtons />
        <form onSubmit={(e) => { e.preventDefault(); saveAdminIntake(); }} style={{ display: "grid", gap: "18px" }}>
          <section style={cardStyle}>
            <h2 style={{ margin: 0 }}>Status</h2>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
              <option>New Intake</option>
              <option>Needs Review</option>
              <option>Scheduled</option>
              <option>Waiting on Client</option>
              <option>Application Started</option>
              <option>Completed</option>
              <option>Urgent</option>
            </select>
          </section>

          <PersonSection title="Client" data={client} age={clientAge} onUpdate={updateClient} />
          <PersonSection title="Spouse" data={spouse} age={spouseAge} onUpdate={updateSpouse} />

          <section style={cardStyle}>
            <h2 style={{ margin: 0 }}>Health / Referral / Coverage</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "8px" }}>
              {healthOptions.map((option) => (
                <label key={option}>
                  <input type="checkbox" checked={health.includes(option)} onChange={() => toggleHealth(option)} /> {option}
                </label>
              ))}
            </div>
            <input value={referredBy} onChange={(e) => setReferredBy(e.target.value)} placeholder="Referred By" style={inputStyle} />
            <input value={currentCoverage} onChange={(e) => setCurrentCoverage(e.target.value)} placeholder="Current Coverage" style={inputStyle} />
            <input value={currentPremium} onChange={(e) => setCurrentPremium(e.target.value)} placeholder="Current Premium" style={inputStyle} />
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" rows={4} style={inputStyle} />
          </section>

          <section style={cardStyle}>
            <h2 style={{ margin: 0 }}>Appointment Scheduler</h2>
            <select value={assignedAgent} onChange={(e) => setAssignedAgent(e.target.value)} style={inputStyle}>
              {agents.map((a) => <option key={a.name}>{a.name}</option>)}
            </select>
            <select value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)} style={inputStyle}>
              {appointmentTypes.map((x) => <option key={x}>{x}</option>)}
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
                <option>Phone Call</option>
                <option>Office</option>
                <option>Client Home</option>
                <option>Zoom / Virtual</option>
                <option>Other</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button type="button" style={buttonStyle} onClick={checkAvailability}>Check Availability</button>
              <button type="button" style={primaryButtonStyle} onClick={createCalendarEvent}>Create Calendar Event</button>
              <button type="button" style={buttonStyle} onClick={() => setPage("calendar")}>Go to Calendar</button>
              <button type="button" style={buttonStyle} onClick={() => setPage("household")}>Back to Household</button>
            </div>
            {calendarMessage ? <p>{calendarMessage}</p> : null}
          </section>

          <section style={cardStyle}>
            <h2 style={{ margin: 0 }}>Email Template Option</h2>
            <select value={templateName} onChange={(e) => setTemplateName(e.target.value)} style={inputStyle}>
              {Object.keys(emailTemplates).map((x) => <option key={x}>{x}</option>)}
            </select>
            <textarea value={selectedTemplate} readOnly rows={7} style={inputStyle} />
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button type="button" style={buttonStyle} onClick={() => navigator.clipboard?.writeText(selectedTemplate)}>Copy Email Template</button>
              <a style={buttonStyle} href={`mailto:${client.email || ""}?subject=${encodeURIComponent(templateName)}&body=${encodeURIComponent(selectedTemplate)}`}>Open Email</a>
            </div>
          </section>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button type="submit" style={primaryButtonStyle}>Save Admin Intake</button>
            <button type="button" style={buttonStyle} onClick={createCalendarEvent}>Save Intake + Calendar Event</button>
            <button type="button" style={buttonStyle} onClick={clearForm}>Clear Form</button>
            <button type="button" style={buttonStyle} onClick={() => setPage("dashboard")}>Return to Dashboard</button>
          </div>
          {savedMessage ? <p>{savedMessage}</p> : null}
        </form>
      </main>
    );
  }

  function CalendarPage() {
    return (
      <main style={pageStyle}>
        <h1>Calendar</h1>
        <NavButtons />
        <section style={cardStyle}>
          <h2 style={{ margin: 0 }}>Create / Check Appointment</h2>
          <p>Selected Agent: <strong>{assignedAgent}</strong></p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button type="button" style={buttonStyle} onClick={() => setPage("admin")}>Back to Admin</button>
            <button type="button" style={buttonStyle} onClick={() => setPage("household")}>Back to Household</button>
            <button type="button" style={primaryButtonStyle} onClick={createCalendarEvent}>Save Current Intake to Calendar</button>
          </div>
          {calendarMessage ? <p>{calendarMessage}</p> : null}
        </section>

        <section style={cardStyle}>
          <h2 style={{ margin: 0 }}>Saved Calendar Events</h2>
          {savedEvents.length === 0 ? <p>No saved events yet.</p> : null}
          {savedEvents.map((event) => (
            <div key={event.id} style={{ border: "1px solid #d0d7de", borderRadius: "10px", padding: "12px" }}>
              <strong>{event.title}</strong>
              <p style={{ margin: "6px 0" }}>{event.date} at {event.time} — {event.duration} minutes — {event.location}</p>
              <p style={{ margin: "6px 0" }}>Agent: {event.agent} | Client: {event.clientName}</p>
              <p style={{ margin: "6px 0" }}>Saved to Google Calendar: {event.googleCalendarSaved ? "Yes" : "No / Local only"}</p>
            </div>
          ))}
        </section>
      </main>
    );
  }

  function HouseholdPage() {
    return (
      <main style={pageStyle}>
        <h1>Household</h1>
        <NavButtons />
        <section style={cardStyle}>
          <h2 style={{ margin: 0 }}>{clientName}</h2>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Assigned Agent:</strong> {assignedAgent}</p>
          <p><strong>Phone:</strong> {client.phone || "-"}</p>
          <p><strong>Email:</strong> {client.email || "-"}</p>
          <p><strong>Birthdate / Age:</strong> {client.birthdate || "-"} / {clientAge || "-"}</p>
          <p><strong>Spouse:</strong> {`${spouse.firstName} ${spouse.lastName}`.trim() || "-"}</p>
          <p><strong>Spouse Birthdate / Age:</strong> {spouse.birthdate || "-"} / {spouseAge || "-"}</p>
          <p><strong>Current Coverage:</strong> {currentCoverage || "-"}</p>
          <p><strong>Current Premium:</strong> {currentPremium || "-"}</p>
          <p><strong>Health:</strong> {health.length ? health.join(", ") : "None"}</p>
          <p><strong>Notes:</strong> {notes || "-"}</p>
        </section>
      </main>
    );
  }

  function AgentPage() {
    const agentStatus = getAgentStatus(selectedAgent.name);
    return (
      <main style={pageStyle}>
        <h1>{selectedAgent.name}</h1>
        <NavButtons />
        <section style={cardStyle}>
          <h2 style={{ margin: 0 }}>Agent Page</h2>
          <p><strong>Initials:</strong> {selectedAgent.initials}</p>
          <p><strong>Calendar Color:</strong> {selectedAgent.color}</p>
          <p><strong>Status:</strong> <span style={{ color: agentStatus.color, fontWeight: "bold" }}>{agentStatus.label}</span> — {agentStatus.detail}</p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button type="button" style={buttonStyle} onClick={() => alert(`${selectedAgent.name}: ${agentStatus.label} — ${agentStatus.detail}`)}>Check Agent Status</button>
            <button type="button" style={buttonStyle} onClick={() => { setAssignedAgent(selectedAgent.name); setPage("calendar"); }}>Go to Calendar</button>
            <button type="button" style={buttonStyle} onClick={() => setPage("admin")}>Back to Admin</button>
          </div>
        </section>
      </main>
    );
  }

  function ClientsPage() {
    return (
      <main style={pageStyle}>
        <h1>Clients</h1>
        <NavButtons />
        <section style={cardStyle}>
          <h2 style={{ margin: 0 }}>Saved Households</h2>
          {savedHouseholds.length === 0 ? <p>No saved households yet.</p> : null}
          {savedHouseholds.map((household) => {
            const name = `${household.client.firstName} ${household.client.lastName}`.trim() || "Client";
            return (
              <div key={household.id} style={{ border: "1px solid #d0d7de", borderRadius: "10px", padding: "12px" }}>
                <strong>{name}</strong>
                <p style={{ margin: "6px 0" }}>Status: {household.status} | Agent: {household.assignedAgent}</p>
                <p style={{ margin: "6px 0" }}>Phone: {household.client.phone || "-"} | Email: {household.client.email || "-"}</p>
              </div>
            );
          })}
        </section>
      </main>
    );
  }

  function TodayPage() {
    const today = new Date().toISOString().slice(0, 10);
    const todaysEvents = savedEvents.filter((event) => event.date === today);
    return (
      <main style={pageStyle}>
        <h1>Today’s Appointments</h1>
        <NavButtons />
        <section style={cardStyle}>
          <h2 style={{ margin: 0 }}>Today</h2>
          {todaysEvents.length === 0 ? <p>No local events saved for today.</p> : null}
          {todaysEvents.map((event) => (
            <div key={event.id} style={{ border: "1px solid #d0d7de", borderRadius: "10px", padding: "12px" }}>
              <strong>{event.time} — {event.title}</strong>
              <p style={{ margin: "6px 0" }}>{event.agent} | {event.location}</p>
            </div>
          ))}
        </section>
      </main>
    );
  }

  if (page === "admin") return <AdminPage />;
  if (page === "calendar") return <CalendarPage />;
  if (page === "household") return <HouseholdPage />;
  if (page === "agent") return <AgentPage />;
  if (page === "clients") return <ClientsPage />;
  if (page === "today") return <TodayPage />;
  return <DashboardPage />;
}
