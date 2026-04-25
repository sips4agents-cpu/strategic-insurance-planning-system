"use client";

import { useMemo, useState } from "react";

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

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatDate(value) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function calculateAge(dateString) {
  const digits = dateString.replace(/\D/g, "");
  if (digits.length !== 8) return "";
  const month = parseInt(digits.slice(0, 2), 10);
  const day = parseInt(digits.slice(2, 4), 10);
  const year = parseInt(digits.slice(4, 8), 10);
  const today = new Date();
  let age = today.getFullYear() - year;
  const hadBirthday = today.getMonth() + 1 > month || (today.getMonth() + 1 === month && today.getDate() >= day);
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

function PersonSection({ title, data, age, onUpdate }) {
  const phoneMatches = !data.phoneConfirm || data.phone === data.phoneConfirm;
  return (
    <section style={cardStyle}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <input value={data.firstName} onChange={(e) => onUpdate("firstName", e.target.value)} placeholder={`${title} First Name`} style={inputStyle} />
        <input value={data.lastName} onChange={(e) => onUpdate("lastName", e.target.value)} placeholder={`${title} Last Name`} style={inputStyle} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <input value={data.phone} onChange={(e) => onUpdate("phone", formatPhone(e.target.value))} placeholder={`${title} Phone`} style={inputStyle} />
        <input value={data.email} onChange={(e) => onUpdate("email", e.target.value)} placeholder={`${title} Email`} style={inputStyle} />
      </div>
      {data.phone ? (
        <div>
          <input value={data.phoneConfirm} onChange={(e) => onUpdate("phoneConfirm", formatPhone(e.target.value))} placeholder={`Re-enter ${title} Phone`} style={inputStyle} />
          <div style={{ marginTop: "6px", fontSize: "13px" }}>{phoneMatches ? "Phone verified" : "Phone numbers do not match"}</div>
        </div>
      ) : null}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <input value={data.birthdate} onChange={(e) => onUpdate("birthdate", formatDate(e.target.value))} placeholder={`${title} Birthdate MM/DD/YYYY`} style={inputStyle} />
        <input value={age} readOnly placeholder={`${title} Age`} style={inputStyle} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <input value={data.address} onChange={(e) => onUpdate("address", e.target.value)} placeholder={`${title} Address`} style={inputStyle} />
        <input value={data.city} onChange={(e) => onUpdate("city", e.target.value)} placeholder={`${title} City`} style={inputStyle} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <input value={data.state} onChange={(e) => onUpdate("state", e.target.value)} placeholder="State" style={inputStyle} />
        <input value={data.zip} onChange={(e) => onUpdate("zip", e.target.value)} placeholder="ZIP" style={inputStyle} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
        <select value={data.sex} onChange={(e) => onUpdate("sex", e.target.value)} style={inputStyle}><option value="">Sex</option><option>Male</option><option>Female</option></select>
        <select value={data.tobacco} onChange={(e) => onUpdate("tobacco", e.target.value)} style={inputStyle}><option value="">Tobacco</option><option>Yes</option><option>No</option></select>
        <select value={data.coverageType} onChange={(e) => onUpdate("coverageType", e.target.value)} style={inputStyle}><option value="">Coverage Type</option><option>Group coverage</option><option>Medicare</option><option>Individual coverage</option><option>Other</option></select>
      </div>
    </section>
  );
}

export default function SipsConnectSingleFile() {
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

  const clientAge = useMemo(() => calculateAge(client.birthdate), [client.birthdate]);
  const spouseAge = useMemo(() => calculateAge(spouse.birthdate), [spouse.birthdate]);
  const clientName = `${client.firstName} ${client.lastName}`.trim() || "Client";
  const selectedTemplate = applyTemplate(emailTemplates[templateName], { clientName, agent: assignedAgent, date: appointmentDate, time: appointmentTime });

  function NavButtons({ household = true }) {
    return (
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "18px" }}>
        <button onClick={() => setPage("dashboard")} style={primaryButtonStyle}>Dashboard</button>
        <button onClick={() => setPage("admin")} style={buttonStyle}>Back to Admin</button>
        <button onClick={() => setPage("calendar")} style={buttonStyle}>Go to Calendar</button>
        {household ? <button onClick={() => setPage("household")} style={buttonStyle}>Back to Household</button> : null}
        <button onClick={() => setPage("clients")} style={buttonStyle}>Clients</button>
        <button onClick={() => setPage("today")} style={buttonStyle}>Today</button>
      </div>
    );
  }

  function updateClient(field, value) { setClient((prev) => ({ ...prev, [field]: value })); }
  function updateSpouse(field, value) { setSpouse((prev) => ({ ...prev, [field]: value })); }
  function toggleHealth(option) { setHealth((prev) => prev.includes(option) ? prev.filter((x) => x !== option) : [...prev, option]); }

  function DashboardPage() {
    return (
      <main style={pageStyle}>
        <h1>SIPS Connect Dashboard</h1>
        <NavButtons household={false} />
        <section style={cardStyle}>
          <h2 style={{ margin: 0 }}>Agent Status</h2>
          <div style={{ display: "grid", gap: "12px" }}>
            {agents.filter((a) => a.name !== "Admin").map((agent) => (
              <div key={agent.slug} style={{ border: "1px solid #d0d7de", borderRadius: "10px", padding: "14px", display: "grid", gap: "10px" }}>
                <strong>{agent.name} — {agent.initials} — {agent.color}</strong>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button style={buttonStyle} onClick={() => alert(`${agent.name} status check: use calendar connection for live availability.`)}>Check Status</button>
                  <button style={buttonStyle} onClick={() => { setSelectedAgent(agent); setPage("agent"); }}>Go to Agent Page</button>
                  <button style={buttonStyle} onClick={() => { setSelectedAgent(agent); setAssignedAgent(agent.name); setPage("calendar"); }}>Go to Calendar</button>
                </div>
              </div>
            ))}
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
        <form onSubmit={(e) => { e.preventDefault(); setSavedMessage("Admin intake saved in this single-file demo. Connect Supabase/API when deploying."); }} style={{ display: "grid", gap: "18px" }}>
          <section style={cardStyle}>
            <h2 style={{ margin: 0 }}>Status</h2>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
              <option>New Intake</option><option>Needs Review</option><option>Scheduled</option><option>Waiting on Client</option><option>Application Started</option><option>Completed</option><option>Urgent</option>
            </select>
          </section>
          <PersonSection title="Client" data={client} age={clientAge} onUpdate={updateClient} />
          <PersonSection title="Spouse" data={spouse} age={spouseAge} onUpdate={updateSpouse} />
          <section style={cardStyle}>
            <h2 style={{ margin: 0 }}>Health / Referral / Coverage</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "8px" }}>
              {healthOptions.map((option) => <label key={option}><input type="checkbox" checked={health.includes(option)} onChange={() => toggleHealth(option)} /> {option}</label>)}
            </div>
            <input value={referredBy} onChange={(e) => setReferredBy(e.target.value)} placeholder="Referred By" style={inputStyle} />
            <input value={currentCoverage} onChange={(e) => setCurrentCoverage(e.target.value)} placeholder="Current Coverage" style={inputStyle} />
            <input value={currentPremium} onChange={(e) => setCurrentPremium(e.target.value)} placeholder="Current Premium" style={inputStyle} />
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" rows={4} style={inputStyle} />
          </section>
          <section style={cardStyle}>
            <h2 style={{ margin: 0 }}>Appointment Scheduler</h2>
            <select value={assignedAgent} onChange={(e) => setAssignedAgent(e.target.value)} style={inputStyle}>{agents.map((a) => <option key={a.name}>{a.name}</option>)}</select>
            <select value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)} style={inputStyle}>{appointmentTypes.map((x) => <option key={x}>{x}</option>)}</select>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}><input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} style={inputStyle} /><input type="time" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} style={inputStyle} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}><select value={appointmentDuration} onChange={(e) => setAppointmentDuration(e.target.value)} style={inputStyle}><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="45">45 minutes</option><option value="60">1 hour</option><option value="90">1.5 hours</option></select><select value={appointmentLocation} onChange={(e) => setAppointmentLocation(e.target.value)} style={inputStyle}><option>Phone Call</option><option>Office</option><option>Client Home</option><option>Zoom / Virtual</option><option>Other</option></select></div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}><button type="button" style={buttonStyle} onClick={() => alert(`${assignedAgent} status check. Connect to Google Calendar API for live availability.`)}>Check Availability</button><button type="button" style={buttonStyle} onClick={() => setPage("calendar")}>Go to Calendar</button><button type="button" style={buttonStyle} onClick={() => setPage("household")}>Back to Household</button></div>
          </section>
          <section style={cardStyle}>
            <h2 style={{ margin: 0 }}>Email Template Option</h2>
            <select value={templateName} onChange={(e) => setTemplateName(e.target.value)} style={inputStyle}>{Object.keys(emailTemplates).map((x) => <option key={x}>{x}</option>)}</select>
            <textarea value={selectedTemplate} readOnly rows={7} style={inputStyle} />
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}><button type="button" style={buttonStyle} onClick={() => navigator.clipboard?.writeText(selectedTemplate)}>Copy Email Template</button><a style={buttonStyle} href={`mailto:${client.email || ""}?subject=${encodeURIComponent(templateName)}&body=${encodeURIComponent(selectedTemplate)}`}>Open Email</a></div>
          </section>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}><button type="submit" style={primaryButtonStyle}>Save Admin Intake</button><button type="button" style={buttonStyle} onClick={() => setPage("dashboard")}>Return to Dashboard</button></div>
          {savedMessage ? <p>{savedMessage}</p> : null}
        </form>
      </main>
    );
  }

  function CalendarPage() {
    return <main style={pageStyle}><h1>Calendar</h1><NavButtons /><section style={cardStyle}><h2 style={{ margin: 0 }}>Calendar Controls</h2><p>Selected Agent: <strong>{selectedAgent.name}</strong></p><p>Use Admin Intake to create/check appointments. This single-file version keeps calendar navigation and household return buttons in one place.</p><button style={buttonStyle} onClick={() => setPage("admin")}>Back to Admin</button><button style={buttonStyle} onClick={() => setPage("household")}>Back to Household</button></section></main>;
  }

  function HouseholdPage() {
    return <main style={pageStyle}><h1>Household</h1><NavButtons /><section style={cardStyle}><h2 style={{ margin: 0 }}>{clientName}</h2><p><strong>Status:</strong> {status}</p><p><strong>Assigned Agent:</strong> {assignedAgent}</p><p><strong>Phone:</strong> {client.phone || "-"}</p><p><strong>Email:</strong> {client.email || "-"}</p><p><strong>Current Coverage:</strong> {currentCoverage || "-"}</p><p><strong>Current Premium:</strong> {currentPremium || "-"}</p><p><strong>Health:</strong> {health.length ? health.join(", ") : "None"}</p><p><strong>Notes:</strong> {notes || "-"}</p></section></main>;
  }

  function AgentPage() {
    return <main style={pageStyle}><h1>{selectedAgent.name}</h1><NavButtons /><section style={cardStyle}><h2 style={{ margin: 0 }}>Agent Page</h2><p><strong>Initials:</strong> {selectedAgent.initials}</p><p><strong>Calendar Color:</strong> {selectedAgent.color}</p><div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}><button style={buttonStyle} onClick={() => alert(`${selectedAgent.name} status check. Connect calendar API for live status.`)}>Check Agent Status</button><button style={buttonStyle} onClick={() => setPage("calendar")}>Go to Calendar</button><button style={buttonStyle} onClick={() => setPage("admin")}>Back to Admin</button></div></section></main>;
  }

  function SimplePage({ title, text }) {
    return <main style={pageStyle}><h1>{title}</h1><NavButtons /><section style={cardStyle}><p>{text}</p></section></main>;
  }

  if (page === "admin") return <AdminPage />;
  if (page === "calendar") return <CalendarPage />;
  if (page === "household") return <HouseholdPage />;
  if (page === "agent") return <AgentPage />;
  if (page === "clients") return <SimplePage title="Clients" text="Client list page. Connect this to your saved households/people table when ready." />;
  if (page === "today") return <SimplePage title="Today’s Appointments" text="Today page. Connect this to calendar events and household status when ready." />;
  return <DashboardPage />;
}

const pageStyle = {
  padding: "32px",
  fontFamily: "Arial, sans-serif",
  maxWidth: "1100px",
  margin: "0 auto",
  background: "#f6f8fa",
  minHeight: "100vh",
};
