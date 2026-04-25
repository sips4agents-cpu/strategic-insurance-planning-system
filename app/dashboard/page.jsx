"use client";

import { useMemo, useState } from "react";

const AGENTS = [
  { name: "Admin", initials: "ADMIN", color: "Purple", page: "admin" },
  { name: "Loyd Richardson", initials: "LR", color: "Green", page: "agent-loyd" },
  { name: "Blake Richardson", initials: "BR", color: "Orange", page: "agent-blake" },
  { name: "William Sykes", initials: "WS", color: "Blue", page: "agent-william" },
  { name: "Jimmie Bassett", initials: "JB", color: "Red", page: "agent-jimmie" },
  { name: "Christiana Grant", initials: "CG", color: "Purple", page: "agent-christiana" },
];

const APPOINTMENT_TYPES = [
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

const APPOINTMENT_CODES = {
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

const HEALTH_OPTIONS = [
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

const EMAIL_TEMPLATES = {
  "Appointment Confirmation":
    "Thank you for speaking with us. This email confirms your scheduled appointment. Please contact our office if anything changes.",
  "Missing Information":
    "We are missing a few details needed to complete your file. Please contact our office so we can finish the review.",
  "Claims Follow Up":
    "We are following up regarding your claim issue. Please send any EOBs, claim documents, dates of service, and provider contact information available.",
  "Plan Review":
    "We noticed your premium or coverage may need review. Please contact our office so we can make sure your plan is still the best fit.",
};

const BLANK_PERSON = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  birthdate: "",
  age: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  sex: "",
  tobacco: "",
  coverageType: "",
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    color: "#1f2937",
    fontFamily: "Arial, sans-serif",
    padding: "28px",
  },
  shell: {
    maxWidth: "1180px",
    margin: "0 auto",
  },
  header: {
    background: "#ffffff",
    border: "1px solid #dbe3ee",
    borderRadius: "16px",
    padding: "22px",
    marginBottom: "18px",
    boxShadow: "0 4px 14px rgba(15, 23, 42, 0.06)",
  },
  nav: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "14px",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #dbe3ee",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "16px",
    boxShadow: "0 4px 14px rgba(15, 23, 42, 0.05)",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "12px",
  },
  button: {
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    cursor: "pointer",
    fontWeight: 700,
  },
  primaryButton: {
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1px solid #1d4ed8",
    background: "#1d4ed8",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 700,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
    background: "#ffffff",
  },
  label: {
    fontSize: "13px",
    fontWeight: 700,
    marginBottom: "5px",
    display: "block",
  },
};

function formatPhone(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatDate(value) {
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

  const today = new Date();
  let age = today.getFullYear() - year;
  const birthdayPassed =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);

  if (!birthdayPassed) age -= 1;
  return age >= 0 && age <= 120 ? String(age) : "";
}

function Field({ label, children }) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <Field label={label}>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder || label}
        style={styles.input}
      />
    </Field>
  );
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <Field label={label}>
      <select value={value} onChange={(event) => onChange(event.target.value)} style={styles.input}>
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}

function PersonSection({ title, person, setPerson }) {
  function update(field, value) {
    let nextValue = value;

    if (field === "phone") nextValue = formatPhone(value);
    if (field === "birthdate") nextValue = formatDate(value);

    setPerson((previous) => {
      const updated = { ...previous, [field]: nextValue };
      if (field === "birthdate") updated.age = calculateAge(nextValue);
      return updated;
    });
  }

  return (
    <section style={styles.card}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>

      <div style={styles.grid2}>
        <TextInput label="First Name" value={person.firstName} onChange={(value) => update("firstName", value)} />
        <TextInput label="Last Name" value={person.lastName} onChange={(value) => update("lastName", value)} />
      </div>

      <div style={styles.grid2}>
        <TextInput label="Phone" value={person.phone} onChange={(value) => update("phone", value)} />
        <TextInput label="Email" value={person.email} onChange={(value) => update("email", value)} />
      </div>

      <div style={styles.grid2}>
        <TextInput label="Birthdate" value={person.birthdate} onChange={(value) => update("birthdate", value)} placeholder="MM/DD/YYYY" />
        <TextInput label="Age" value={person.age} onChange={() => {}} placeholder="Auto calculated" />
      </div>

      <div style={styles.grid2}>
        <TextInput label="Address" value={person.address} onChange={(value) => update("address", value)} />
        <TextInput label="City" value={person.city} onChange={(value) => update("city", value)} />
      </div>

      <div style={styles.grid3}>
        <TextInput label="State" value={person.state} onChange={(value) => update("state", value)} />
        <TextInput label="ZIP" value={person.zip} onChange={(value) => update("zip", value)} />
        <SelectInput label="Sex" value={person.sex} onChange={(value) => update("sex", value)} options={["Male", "Female"]} />
      </div>

      <div style={styles.grid2}>
        <SelectInput label="Tobacco" value={person.tobacco} onChange={(value) => update("tobacco", value)} options={["Yes", "No"]} />
        <SelectInput label="Coverage Type" value={person.coverageType} onChange={(value) => update("coverageType", value)} options={["Group coverage", "Medicare", "Individual coverage", "Other"]} />
      </div>
    </section>
  );
}

export default function SipsDashboardPage() {
  const [view, setView] = useState("dashboard");
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0]);
  const [selectedHousehold, setSelectedHousehold] = useState(null);

  const [client, setClient] = useState({ ...BLANK_PERSON });
  const [spouse, setSpouse] = useState({ ...BLANK_PERSON });
  const [assignedAgent, setAssignedAgent] = useState("Admin");
  const [appointmentType, setAppointmentType] = useState("Service");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentLocation, setAppointmentLocation] = useState("Phone Call");
  const [referredBy, setReferredBy] = useState("");
  const [currentCoverage, setCurrentCoverage] = useState("");
  const [currentPremium, setCurrentPremium] = useState("");
  const [notes, setNotes] = useState("");
  const [healthFlags, setHealthFlags] = useState([]);
  const [emailTemplate, setEmailTemplate] = useState("Appointment Confirmation");
  const [households, setHouseholds] = useState([]);
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");

  const agentStatus = useMemo(() => {
    const now = new Date();
    return AGENTS.reduce((result, agent) => {
      const agentBusy = events.some((event) => {
        if (event.agent !== agent.name || !event.date || !event.time) return false;
        const start = new Date(`${event.date}T${event.time}:00`);
        const end = new Date(start.getTime() + 60 * 60000);
        return now >= start && now <= end;
      });
      result[agent.name] = agentBusy ? "Busy" : "Available";
      return result;
    }, {});
  }, [events]);

  function resetForm() {
    setClient({ ...BLANK_PERSON });
    setSpouse({ ...BLANK_PERSON });
    setAssignedAgent("Admin");
    setAppointmentType("Service");
    setAppointmentDate("");
    setAppointmentTime("");
    setAppointmentLocation("Phone Call");
    setReferredBy("");
    setCurrentCoverage("");
    setCurrentPremium("");
    setNotes("");
    setHealthFlags([]);
  }

  function saveIntake() {
    const clientName = `${client.firstName} ${client.lastName}`.trim();

    if (!clientName) {
      setMessage("Please enter at least the client first and last name before saving.");
      return;
    }

    const household = {
      id: Date.now(),
      client: { ...client },
      spouse: { ...spouse },
      assignedAgent,
      appointmentType,
      appointmentDate,
      appointmentTime,
      appointmentLocation,
      referredBy,
      currentCoverage,
      currentPremium,
      notes,
      healthFlags: [...healthFlags],
      createdAt: new Date().toLocaleString(),
    };

    setHouseholds((previous) => [household, ...previous]);
    setSelectedHousehold(household);
    setMessage("Intake saved. Household snapshot is ready.");

    if (appointmentDate && appointmentTime) {
      createCalendarEvent(household);
    }

    resetForm();
    setView("household");
  }

  async function createCalendarEvent(householdOverride) {
    const source = householdOverride || {
      id: Date.now(),
      client,
      spouse,
      assignedAgent,
      appointmentType,
      appointmentDate,
      appointmentTime,
      appointmentLocation,
      referredBy,
      currentCoverage,
      currentPremium,
      notes,
      healthFlags,
    };

    if (!source.appointmentDate || !source.appointmentTime) {
      setMessage("Please enter appointment date and time before creating a calendar event.");
      return;
    }

    const clientName = `${source.client.firstName} ${source.client.lastName}`.trim() || "Client";
    const agent = AGENTS.find((item) => item.name === source.assignedAgent) || AGENTS[0];
    const code = APPOINTMENT_CODES[source.appointmentType] || source.appointmentType;

    const event = {
      id: Date.now() + Math.random(),
      title: `[${code}] ${clientName} | ${agent.initials}`,
      clientName,
      agent: source.assignedAgent,
      type: source.appointmentType,
      date: source.appointmentDate,
      time: source.appointmentTime,
      location: source.appointmentLocation,
      householdId: source.id,
      notes: source.notes,
    };

    setEvents((previous) => [event, ...previous]);
    setMessage("Calendar event saved inside this dashboard. Google Calendar API can be connected after the layout is final.");
    setView("calendar");
  }

  function toggleHealth(option) {
    setHealthFlags((previous) =>
      previous.includes(option)
        ? previous.filter((item) => item !== option)
        : [...previous, option]
    );
  }

  function openAgent(agent) {
    setSelectedAgent(agent);
    setView("agent");
  }

  function openHousehold(household) {
    setSelectedHousehold(household);
    setView("household");
  }

  function Header() {
    return (
      <header style={styles.header}>
        <h1 style={{ margin: 0 }}>SIPS Connect</h1>
        <p style={{ marginBottom: 0 }}>Dashboard, Admin Intake, Agents, Calendar, Clients, and Household Snapshot</p>

        <nav style={styles.nav}>
          <button style={view === "dashboard" ? styles.primaryButton : styles.button} onClick={() => setView("dashboard")}>Dashboard</button>
          <button style={view === "admin" ? styles.primaryButton : styles.button} onClick={() => setView("admin")}>Admin Intake</button>
          <button style={view === "calendar" ? styles.primaryButton : styles.button} onClick={() => setView("calendar")}>Calendar</button>
          <button style={view === "clients" ? styles.primaryButton : styles.button} onClick={() => setView("clients")}>Clients</button>
          <button style={view === "today" ? styles.primaryButton : styles.button} onClick={() => setView("today")}>Today</button>
        </nav>
      </header>
    );
  }

  function DashboardView() {
    return (
      <>
        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Dashboard</h2>
          <p>This is the main dashboard. Admin Intake is separate so agents do not get confused.</p>
          <div style={styles.nav}>
            <button style={styles.primaryButton} onClick={() => setView("admin")}>Open Admin Intake</button>
            <button style={styles.button} onClick={() => setView("calendar")}>Go to Calendar</button>
            <button style={styles.button} onClick={() => setView("clients")}>View Clients</button>
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Agent Status</h2>
          <div style={{ display: "grid", gap: "12px" }}>
            {AGENTS.map((agent) => (
              <div key={agent.name} style={{ border: "1px solid #dbe3ee", borderRadius: "12px", padding: "14px", display: "grid", gap: "10px" }}>
                <div>
                  <strong>{agent.name}</strong> — {agent.initials} — {agent.color}
                  <div>Status: <strong>{agentStatus[agent.name]}</strong></div>
                </div>
                <div style={styles.nav}>
                  <button style={styles.button} onClick={() => setMessage(`${agent.name} is currently ${agentStatus[agent.name]}.`)}>Check Status</button>
                  <button style={styles.button} onClick={() => openAgent(agent)}>Go to Agent Page</button>
                  <button style={styles.button} onClick={() => setView("calendar")}>Go to Calendar</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }

  function AdminView() {
    return (
      <>
        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Admin Intake</h2>
          <div style={styles.nav}>
            <button style={styles.button} onClick={() => setView("dashboard")}>Back to Dashboard</button>
            <button style={styles.button} onClick={() => setView("calendar")}>Go to Calendar</button>
          </div>
        </section>

        <PersonSection title="Client" person={client} setPerson={setClient} />
        <PersonSection title="Spouse" person={spouse} setPerson={setSpouse} />

        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Status, Referral, Coverage, and Notes</h2>

          <div style={styles.grid2}>
            <SelectInput label="Assigned Agent" value={assignedAgent} onChange={setAssignedAgent} options={AGENTS.map((agent) => agent.name)} />
            <SelectInput label="Reason / Appointment Type" value={appointmentType} onChange={setAppointmentType} options={APPOINTMENT_TYPES} />
          </div>

          <div style={styles.grid3}>
            <TextInput label="Referred By" value={referredBy} onChange={setReferredBy} />
            <TextInput label="Current Coverage" value={currentCoverage} onChange={setCurrentCoverage} />
            <TextInput label="Current Premium" value={currentPremium} onChange={setCurrentPremium} />
          </div>

          <div style={{ marginTop: "12px" }}>
            <label style={styles.label}>Health Status</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "8px" }}>
              {HEALTH_OPTIONS.map((option) => (
                <label key={option} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input type="checkbox" checked={healthFlags.includes(option)} onChange={() => toggleHealth(option)} />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "12px" }}>
            <Field label="Notes">
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={5} style={styles.input} />
            </Field>
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Calendar</h2>
          <div style={styles.grid3}>
            <TextInput label="Appointment Date" type="date" value={appointmentDate} onChange={setAppointmentDate} />
            <TextInput label="Appointment Time" type="time" value={appointmentTime} onChange={setAppointmentTime} />
            <SelectInput label="Location" value={appointmentLocation} onChange={setAppointmentLocation} options={["Phone Call", "Office", "Client Home", "Zoom / Virtual", "Other"]} />
          </div>

          <div style={styles.nav}>
            <button style={styles.button} onClick={() => createCalendarEvent()}>Create Calendar Event</button>
            <button style={styles.button} onClick={() => setView("calendar")}>Open Calendar</button>
            {selectedHousehold ? <button style={styles.button} onClick={() => setView("household")}>Back to Household</button> : null}
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Email Template</h2>
          <SelectInput label="Template" value={emailTemplate} onChange={setEmailTemplate} options={Object.keys(EMAIL_TEMPLATES)} />
          <textarea readOnly value={EMAIL_TEMPLATES[emailTemplate]} rows={5} style={{ ...styles.input, marginTop: "12px" }} />
          <div style={styles.nav}>
            <button style={styles.button} onClick={() => navigator.clipboard?.writeText(EMAIL_TEMPLATES[emailTemplate])}>Copy Email Template</button>
            <a style={styles.button} href={`mailto:?subject=${encodeURIComponent(emailTemplate)}&body=${encodeURIComponent(EMAIL_TEMPLATES[emailTemplate])}`}>Open Email</a>
          </div>
        </section>

        <section style={styles.card}>
          <button style={styles.primaryButton} onClick={saveIntake}>Save Admin Intake</button>
        </section>
      </>
    );
  }

  function CalendarView() {
    return (
      <section style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Calendar</h2>
        <div style={styles.nav}>
          <button style={styles.button} onClick={() => setView("admin")}>Back to Admin</button>
          {selectedHousehold ? <button style={styles.button} onClick={() => setView("household")}>Back to Household</button> : null}
          <button style={styles.button} onClick={() => setView("dashboard")}>Back to Dashboard</button>
        </div>

        {events.length === 0 ? (
          <p>No calendar events saved yet.</p>
        ) : (
          <div style={{ display: "grid", gap: "10px", marginTop: "14px" }}>
            {events.map((event) => (
              <div key={event.id} style={{ border: "1px solid #dbe3ee", borderRadius: "12px", padding: "14px" }}>
                <strong>{event.title}</strong>
                <div>{event.date} at {event.time}</div>
                <div>{event.agent} — {event.location}</div>
                <button style={{ ...styles.button, marginTop: "10px" }} onClick={() => {
                  const found = households.find((household) => household.id === event.householdId);
                  if (found) openHousehold(found);
                }}>Open Household</button>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }

  function ClientsView() {
    return (
      <section style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Clients</h2>
        {households.length === 0 ? (
          <p>No saved clients yet.</p>
        ) : (
          <div style={{ display: "grid", gap: "10px" }}>
            {households.map((household) => (
              <div key={household.id} style={{ border: "1px solid #dbe3ee", borderRadius: "12px", padding: "14px" }}>
                <strong>{household.client.firstName} {household.client.lastName}</strong>
                <div>Agent: {household.assignedAgent}</div>
                <div>Phone: {household.client.phone || "-"}</div>
                <button style={{ ...styles.button, marginTop: "10px" }} onClick={() => openHousehold(household)}>Open Household</button>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }

  function HouseholdView() {
    if (!selectedHousehold) {
      return (
        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Household</h2>
          <p>No household selected.</p>
          <button style={styles.button} onClick={() => setView("clients")}>Go to Clients</button>
        </section>
      );
    }

    const household = selectedHousehold;

    return (
      <section style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Household Snapshot</h2>
        <div style={styles.nav}>
          <button style={styles.button} onClick={() => setView("dashboard")}>Back to Dashboard</button>
          <button style={styles.button} onClick={() => setView("admin")}>Back to Admin</button>
          <button style={styles.button} onClick={() => setView("calendar")}>Go to Calendar</button>
        </div>

        <div style={styles.grid2}>
          <div style={{ border: "1px solid #dbe3ee", borderRadius: "12px", padding: "14px" }}>
            <h3>Client</h3>
            <p><strong>Name:</strong> {household.client.firstName} {household.client.lastName}</p>
            <p><strong>Birthdate:</strong> {household.client.birthdate || "-"}</p>
            <p><strong>Age:</strong> {household.client.age || "-"}</p>
            <p><strong>Phone:</strong> {household.client.phone || "-"}</p>
            <p><strong>Email:</strong> {household.client.email || "-"}</p>
            <p><strong>Address:</strong> {household.client.address || "-"} {household.client.city || ""} {household.client.state || ""} {household.client.zip || ""}</p>
          </div>

          <div style={{ border: "1px solid #dbe3ee", borderRadius: "12px", padding: "14px" }}>
            <h3>Spouse</h3>
            <p><strong>Name:</strong> {household.spouse.firstName || "-"} {household.spouse.lastName || ""}</p>
            <p><strong>Birthdate:</strong> {household.spouse.birthdate || "-"}</p>
            <p><strong>Age:</strong> {household.spouse.age || "-"}</p>
            <p><strong>Phone:</strong> {household.spouse.phone || "-"}</p>
            <p><strong>Email:</strong> {household.spouse.email || "-"}</p>
          </div>
        </div>

        <div style={{ marginTop: "14px", border: "1px solid #dbe3ee", borderRadius: "12px", padding: "14px" }}>
          <h3>Admin Summary</h3>
          <p><strong>Assigned Agent:</strong> {household.assignedAgent}</p>
          <p><strong>Reason:</strong> {household.appointmentType}</p>
          <p><strong>Referred By:</strong> {household.referredBy || "-"}</p>
          <p><strong>Current Coverage:</strong> {household.currentCoverage || "-"}</p>
          <p><strong>Current Premium:</strong> {household.currentPremium || "-"}</p>
          <p><strong>Health:</strong> {household.healthFlags.length ? household.healthFlags.join(", ") : "None"}</p>
          <p><strong>Notes:</strong> {household.notes || "-"}</p>
        </div>
      </section>
    );
  }

  function AgentView() {
    return (
      <section style={styles.card}>
        <h2 style={{ marginTop: 0 }}>{selectedAgent.name}</h2>
        <p><strong>Initials:</strong> {selectedAgent.initials}</p>
        <p><strong>Calendar Color:</strong> {selectedAgent.color}</p>
        <p><strong>Status:</strong> {agentStatus[selectedAgent.name]}</p>
        <div style={styles.nav}>
          <button style={styles.button} onClick={() => setView("dashboard")}>Back to Dashboard</button>
          <button style={styles.button} onClick={() => setView("calendar")}>Go to Calendar</button>
          <button style={styles.button} onClick={() => setView("admin")}>Create Intake for Agent</button>
        </div>
      </section>
    );
  }

  function TodayView() {
    const today = new Date().toISOString().slice(0, 10);
    const todayEvents = events.filter((event) => event.date === today);

    return (
      <section style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Today</h2>
        {todayEvents.length === 0 ? <p>No appointments saved for today.</p> : todayEvents.map((event) => (
          <div key={event.id} style={{ border: "1px solid #dbe3ee", borderRadius: "12px", padding: "14px", marginBottom: "10px" }}>
            <strong>{event.title}</strong>
            <div>{event.time} — {event.agent}</div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <Header />

        {message ? (
          <div style={{ ...styles.card, borderColor: "#93c5fd", background: "#eff6ff" }}>
            {message}
          </div>
        ) : null}

        {view === "dashboard" ? <DashboardView /> : null}
        {view === "admin" ? <AdminView /> : null}
        {view === "calendar" ? <CalendarView /> : null}
        {view === "clients" ? <ClientsView /> : null}
        {view === "household" ? <HouseholdView /> : null}
        {view === "agent" ? <AgentView /> : null}
        {view === "today" ? <TodayView /> : null}
      </div>
    </main>
  );
}
