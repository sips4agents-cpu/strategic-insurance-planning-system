"use client";

import { useMemo, useState } from "react";

const AGENTS = [
  { name: "Admin", initials: "ADMIN", color: "Purple" },
  { name: "Loyd Richardson", initials: "LR", color: "Green" },
  { name: "Blake Richardson", initials: "BR", color: "Orange" },
  { name: "William Sykes", initials: "WS", color: "Blue" },
  { name: "Jimmie Bassett", initials: "JB", color: "Red" },
  { name: "Christiana Grant", initials: "CG", color: "Purple" },
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

const APPOINTMENT_CODE = {
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
  "Plan Review":
    "Hi, this is Senior Care Plus. We noticed your premium may have increased and would like to schedule a quick plan review to make sure your coverage is still the best fit.",
  "Claims Follow Up":
    "Hi, this is Senior Care Plus following up on your claims issue. Please send any EOBs, unpaid claim notices, or provider contact information so we can assist.",
  "Appointment Reminder":
    "Hi, this is Senior Care Plus reminding you of your upcoming appointment. Please have your Medicare card, current insurance information, medications, and provider list available.",
};

const blankPerson = {
  firstName: "",
  lastName: "",
  phone: "",
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

const blankHousehold = {
  id: "",
  assignedAgent: "Admin",
  status: "New",
  referredBy: "",
  currentCoverage: "",
  currentPremium: "",
  reasonForCall: "Service",
  notes: "",
  healthFlags: [],
  client: { ...blankPerson },
  spouse: { ...blankPerson },
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    fontFamily: "Arial, sans-serif",
    color: "#111827",
  },
  shell: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: 24,
  },
  header: {
    background: "#0f2a44",
    color: "white",
    padding: "22px 24px",
    borderRadius: 16,
    marginBottom: 18,
  },
  nav: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 18,
  },
  card: {
    background: "white",
    border: "1px solid #d6dde8",
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    boxShadow: "0 2px 8px rgba(15, 42, 68, 0.06)",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 12,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 13px",
    border: "1px solid #c8d1dc",
    borderRadius: 10,
    fontSize: 14,
    background: "white",
    color: "#111827",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 13px",
    border: "1px solid #c8d1dc",
    borderRadius: 10,
    fontSize: 14,
    minHeight: 100,
    background: "white",
    color: "#111827",
  },
  button: {
    border: "1px solid #b9c4d0",
    borderRadius: 10,
    padding: "11px 14px",
    background: "white",
    color: "#111827",
    cursor: "pointer",
    fontWeight: 700,
  },
  primaryButton: {
    border: "1px solid #0f2a44",
    borderRadius: 10,
    padding: "11px 14px",
    background: "#0f2a44",
    color: "white",
    cursor: "pointer",
    fontWeight: 700,
  },
  statusPill: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    background: "#eef6ff",
    border: "1px solid #b9d7ff",
    fontSize: 13,
    fontWeight: 700,
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

function calculateAge(dateValue) {
  const digits = String(dateValue || "").replace(/\D/g, "");
  if (digits.length !== 8) return "";

  const month = Number(digits.slice(0, 2));
  const day = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));

  if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900) return "";

  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  if (age < 0 || age > 120) return "";
  return String(age);
}

function fullName(person) {
  return `${person.firstName || ""} ${person.lastName || ""}`.trim() || "Client";
}

function personHasData(person) {
  return Object.values(person).some((value) => String(value || "").trim() !== "");
}

function PersonForm({ title, type, person, updatePerson }) {
  return (
    <section style={styles.card}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>

      <div style={styles.grid2}>
        <input
          style={styles.input}
          value={person.firstName}
          onChange={(e) => updatePerson(type, "firstName", e.target.value)}
          placeholder={`${title} First Name`}
        />
        <input
          style={styles.input}
          value={person.lastName}
          onChange={(e) => updatePerson(type, "lastName", e.target.value)}
          placeholder={`${title} Last Name`}
        />
      </div>

      <div style={{ ...styles.grid2, marginTop: 12 }}>
        <input
          style={styles.input}
          value={person.phone}
          onChange={(e) => updatePerson(type, "phone", formatPhone(e.target.value))}
          placeholder={`${title} Phone`}
        />
        <input
          style={styles.input}
          value={person.email}
          onChange={(e) => updatePerson(type, "email", e.target.value)}
          placeholder={`${title} Email`}
        />
      </div>

      <div style={{ ...styles.grid2, marginTop: 12 }}>
        <input
          style={styles.input}
          value={person.birthdate}
          onChange={(e) => updatePerson(type, "birthdate", formatDate(e.target.value))}
          placeholder="MM/DD/YYYY"
        />
        <input
          style={styles.input}
          value={calculateAge(person.birthdate)}
          readOnly
          placeholder="Age - Auto calculated"
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <input
          style={styles.input}
          value={person.address}
          onChange={(e) => updatePerson(type, "address", e.target.value)}
          placeholder="Address"
        />
      </div>

      <div style={{ ...styles.grid3, marginTop: 12 }}>
        <input
          style={styles.input}
          value={person.city}
          onChange={(e) => updatePerson(type, "city", e.target.value)}
          placeholder="City"
        />
        <input
          style={styles.input}
          value={person.state}
          onChange={(e) => updatePerson(type, "state", e.target.value)}
          placeholder="State"
        />
        <input
          style={styles.input}
          value={person.zip}
          onChange={(e) => updatePerson(type, "zip", e.target.value)}
          placeholder="ZIP"
        />
      </div>

      <div style={{ ...styles.grid3, marginTop: 12 }}>
        <select
          style={styles.input}
          value={person.sex}
          onChange={(e) => updatePerson(type, "sex", e.target.value)}
        >
          <option value="">Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select
          style={styles.input}
          value={person.tobacco}
          onChange={(e) => updatePerson(type, "tobacco", e.target.value)}
        >
          <option value="">Tobacco</option>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
        <select
          style={styles.input}
          value={person.coverageType}
          onChange={(e) => updatePerson(type, "coverageType", e.target.value)}
        >
          <option value="">Coverage Type</option>
          <option value="Medicare">Medicare</option>
          <option value="Group coverage">Group coverage</option>
          <option value="Individual coverage">Individual coverage</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </section>
  );
}

function TopNav({ view, setView }) {
  const navItems = [
    ["dashboard", "Dashboard"],
    ["admin", "Admin Intake"],
    ["calendar", "Calendar"],
    ["clients", "Clients"],
    ["today", "Today"],
    ["household", "Household"],
  ];

  return (
    <div style={styles.nav}>
      {navItems.map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => setView(key)}
          style={view === key ? styles.primaryButton : styles.button}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default function SipsDashboardPage() {
  const [view, setView] = useState("dashboard");
  const [households, setHouseholds] = useState([]);
  const [selectedHouseholdId, setSelectedHouseholdId] = useState("");
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState("");

  const [household, setHousehold] = useState({ ...blankHousehold, client: { ...blankPerson }, spouse: { ...blankPerson } });

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentDuration, setAppointmentDuration] = useState("60");
  const [appointmentLocation, setAppointmentLocation] = useState("Phone Call");

  const [emailTemplate, setEmailTemplate] = useState("Plan Review");

  const selectedHousehold = useMemo(
    () => households.find((item) => item.id === selectedHouseholdId) || households[0] || null,
    [households, selectedHouseholdId]
  );

  function updatePerson(type, field, value) {
    setHousehold((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  }

  function updateHousehold(field, value) {
    setHousehold((prev) => ({ ...prev, [field]: value }));
  }

  function toggleHealth(option) {
    setHousehold((prev) => {
      const current = prev.healthFlags || [];
      return {
        ...prev,
        healthFlags: current.includes(option)
          ? current.filter((item) => item !== option)
          : [...current, option],
      };
    });
  }

  function resetIntake() {
    setHousehold({ ...blankHousehold, client: { ...blankPerson }, spouse: { ...blankPerson } });
    setAppointmentDate("");
    setAppointmentTime("");
    setAppointmentDuration("60");
    setAppointmentLocation("Phone Call");
    setMessage("");
  }

  function saveIntake() {
    if (!household.client.firstName && !household.client.lastName) {
      setMessage("Enter at least the client first or last name before saving.");
      return;
    }

    const id = household.id || `HH-${Date.now()}`;
    const saved = {
      ...household,
      id,
      client: { ...household.client, age: calculateAge(household.client.birthdate) },
      spouse: { ...household.spouse, age: calculateAge(household.spouse.birthdate) },
      createdAt: new Date().toLocaleString(),
    };

    setHouseholds((prev) => {
      const exists = prev.some((item) => item.id === id);
      return exists ? prev.map((item) => (item.id === id ? saved : item)) : [saved, ...prev];
    });

    setSelectedHouseholdId(id);
    setHousehold(saved);
    setMessage("Admin intake saved. Household, Clients, Today, and Calendar can now show this record.");
  }

  async function createCalendarEvent() {
    if (!appointmentDate || !appointmentTime) {
      setMessage("Choose appointment date and time before creating calendar event.");
      return;
    }

    const start = new Date(`${appointmentDate}T${appointmentTime}:00`);
    const end = new Date(start.getTime() + Number(appointmentDuration || 60) * 60000);
    const agent = AGENTS.find((item) => item.name === household.assignedAgent) || AGENTS[0];
    const clientName = fullName(household.client);
    const typeCode = APPOINTMENT_CODE[household.reasonForCall] || household.reasonForCall;

    const event = {
      id: `EV-${Date.now()}`,
      title: `[${typeCode}] ${clientName} | ${agent.initials}`,
      clientName,
      agent: household.assignedAgent,
      date: appointmentDate,
      time: appointmentTime,
      start: start.toISOString(),
      end: end.toISOString(),
      location: appointmentLocation,
      householdId: household.id || selectedHouseholdId || "Not saved yet",
      description:
        `Client: ${clientName}\n` +
        `Phone: ${household.client.phone || "-"}\n` +
        `Email: ${household.client.email || "-"}\n` +
        `Reason: ${household.reasonForCall}\n` +
        `Agent: ${household.assignedAgent}\n` +
        `Current Coverage: ${household.currentCoverage || "-"}\n` +
        `Current Premium: ${household.currentPremium || "-"}\n` +
        `Notes: ${household.notes || "-"}`,
    };

    setEvents((prev) => [event, ...prev]);
    setMessage("Calendar event created locally. If your Google Calendar API route is connected, this can also be sent there.");

    try {
      const response = await fetch("/api/calendar/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agents: [household.assignedAgent],
          title: event.title,
          description: event.description,
          location: event.location,
          start: event.start,
          end: event.end,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) setMessage("Calendar event created and sent to Google Calendar.");
      }
    } catch (error) {
      // Local save remains active when API is not connected.
    }
  }

  function checkAgentStatus(agentName) {
    const busy = events.some((event) => event.agent === agentName && event.date === appointmentDate);
    alert(`${agentName} status: ${busy ? "Has event(s) on selected date" : "No saved events on selected date"}`);
  }

  function loadHousehold(item) {
    setHousehold({
      ...blankHousehold,
      ...item,
      client: { ...blankPerson, ...(item.client || {}) },
      spouse: { ...blankPerson, ...(item.spouse || {}) },
    });
    setSelectedHouseholdId(item.id);
  }

  function renderDashboard() {
    return (
      <>
        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Dashboard</h2>
          <p>Use this page to move between Admin Intake, Agent Status, Calendar, Clients, Today, and Household.</p>
          <div style={styles.nav}>
            <button style={styles.primaryButton} onClick={() => setView("admin")}>Open Admin Intake</button>
            <button style={styles.button} onClick={() => setView("calendar")}>Go to Calendar</button>
            <button style={styles.button} onClick={() => setView("clients")}>Go to Clients</button>
            <button style={styles.button} onClick={() => setView("household")}>Go to Household</button>
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Agent Status</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))", gap: 12 }}>
            {AGENTS.map((agent) => (
              <div key={agent.name} style={{ border: "1px solid #d6dde8", borderRadius: 12, padding: 14 }}>
                <strong>{agent.name}</strong>
                <div style={{ margin: "8px 0" }}>
                  <span style={styles.statusPill}>{agent.initials} · {agent.color}</span>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button style={styles.button} onClick={() => checkAgentStatus(agent.name)}>Check Status</button>
                  <button style={styles.button} onClick={() => setView("agent")}>Go to Agent Page</button>
                  <button style={styles.button} onClick={() => setView("calendar")}>Go to Calendar</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }

  function renderAdmin() {
    return (
      <>
        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Admin Intake</h2>
          <div style={styles.nav}>
            <button style={styles.button} onClick={() => setView("dashboard")}>Back to Dashboard</button>
            <button style={styles.button} onClick={() => setView("calendar")}>Go to Calendar</button>
            <button style={styles.button} onClick={() => setView("household")}>Go to Household</button>
          </div>
        </section>

        <PersonForm title="Client" type="client" person={household.client} updatePerson={updatePerson} />
        <PersonForm title="Spouse" type="spouse" person={household.spouse} updatePerson={updatePerson} />

        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Status, Coverage, Referral</h2>
          <div style={styles.grid3}>
            <select style={styles.input} value={household.status} onChange={(e) => updateHousehold("status", e.target.value)}>
              <option value="New">New</option>
              <option value="Working">Working</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
            <select style={styles.input} value={household.assignedAgent} onChange={(e) => updateHousehold("assignedAgent", e.target.value)}>
              {AGENTS.map((agent) => <option key={agent.name} value={agent.name}>{agent.name}</option>)}
            </select>
            <select style={styles.input} value={household.reasonForCall} onChange={(e) => updateHousehold("reasonForCall", e.target.value)}>
              {APPOINTMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          <div style={{ ...styles.grid3, marginTop: 12 }}>
            <input style={styles.input} value={household.referredBy} onChange={(e) => updateHousehold("referredBy", e.target.value)} placeholder="Referred By" />
            <input style={styles.input} value={household.currentCoverage} onChange={(e) => updateHousehold("currentCoverage", e.target.value)} placeholder="Current Coverage" />
            <input style={styles.input} value={household.currentPremium} onChange={(e) => updateHousehold("currentPremium", e.target.value)} placeholder="Current Premium" />
          </div>

          <div style={{ marginTop: 12 }}>
            <textarea style={styles.textarea} value={household.notes} onChange={(e) => updateHousehold("notes", e.target.value)} placeholder="Notes" />
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Health Flags</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
            {HEALTH_OPTIONS.map((option) => (
              <label key={option} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input type="checkbox" checked={household.healthFlags.includes(option)} onChange={() => toggleHealth(option)} />
                {option}
              </label>
            ))}
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Appointment Scheduler</h2>
          <div style={styles.grid2}>
            <input style={styles.input} type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} />
            <input style={styles.input} type="time" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} />
          </div>
          <div style={{ ...styles.grid2, marginTop: 12 }}>
            <select style={styles.input} value={appointmentDuration} onChange={(e) => setAppointmentDuration(e.target.value)}>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
            </select>
            <select style={styles.input} value={appointmentLocation} onChange={(e) => setAppointmentLocation(e.target.value)}>
              <option value="Phone Call">Phone Call</option>
              <option value="Office">Office</option>
              <option value="Client Home">Client Home</option>
              <option value="Zoom / Virtual">Zoom / Virtual</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={{ ...styles.nav, marginTop: 12 }}>
            <button style={styles.button} onClick={() => checkAgentStatus(household.assignedAgent)}>Check Agent Status</button>
            <button style={styles.button} onClick={createCalendarEvent}>Create Calendar Event</button>
            <button style={styles.button} onClick={() => setView("calendar")}>Open Calendar</button>
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Email Template Option</h2>
          <select style={styles.input} value={emailTemplate} onChange={(e) => setEmailTemplate(e.target.value)}>
            {Object.keys(EMAIL_TEMPLATES).map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
          <textarea style={{ ...styles.textarea, marginTop: 12 }} value={EMAIL_TEMPLATES[emailTemplate]} readOnly />
          <button
            style={styles.button}
            onClick={() => navigator.clipboard?.writeText(EMAIL_TEMPLATES[emailTemplate])}
          >
            Copy Email Template
          </button>
        </section>

        <section style={styles.card}>
          <div style={styles.nav}>
            <button style={styles.primaryButton} onClick={saveIntake}>Save Admin Intake</button>
            <button style={styles.button} onClick={resetIntake}>Clear Intake</button>
            <button style={styles.button} onClick={() => setView("dashboard")}>Back to Dashboard</button>
          </div>
          {message ? <p><strong>{message}</strong></p> : null}
        </section>
      </>
    );
  }

  function renderCalendar() {
    return (
      <section style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Calendar</h2>
        <div style={styles.nav}>
          <button style={styles.button} onClick={() => setView("dashboard")}>Back to Dashboard</button>
          <button style={styles.button} onClick={() => setView("admin")}>Back to Admin</button>
          <button style={styles.button} onClick={() => setView("household")}>Back to Household</button>
        </div>
        {events.length === 0 ? <p>No saved calendar events yet.</p> : null}
        {events.map((event) => (
          <div key={event.id} style={{ border: "1px solid #d6dde8", borderRadius: 12, padding: 14, marginTop: 10 }}>
            <strong>{event.title}</strong>
            <p>{event.date} at {event.time} · {event.location}</p>
            <p>Agent: {event.agent}</p>
            <button style={styles.button} onClick={() => setView("household")}>Open Household</button>
          </div>
        ))}
      </section>
    );
  }

  function renderClients() {
    return (
      <section style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Clients</h2>
        {households.length === 0 ? <p>No clients saved yet.</p> : null}
        {households.map((item) => (
          <div key={item.id} style={{ border: "1px solid #d6dde8", borderRadius: 12, padding: 14, marginTop: 10 }}>
            <strong>{fullName(item.client)}</strong>
            <p>{item.client.phone || "No phone"} · {item.client.email || "No email"}</p>
            <p>{item.client.address || "No address"} {item.client.city || ""} {item.client.state || ""} {item.client.zip || ""}</p>
            <button style={styles.button} onClick={() => { loadHousehold(item); setView("household"); }}>Open Household</button>
          </div>
        ))}
      </section>
    );
  }

  function renderToday() {
    const today = new Date().toISOString().slice(0, 10);
    const todaysEvents = events.filter((event) => event.date === today);
    return (
      <section style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Today’s Appointments</h2>
        {todaysEvents.length === 0 ? <p>No appointments saved for today.</p> : null}
        {todaysEvents.map((event) => (
          <div key={event.id} style={{ border: "1px solid #d6dde8", borderRadius: 12, padding: 14, marginTop: 10 }}>
            <strong>{event.title}</strong>
            <p>{event.time} · {event.location} · {event.agent}</p>
          </div>
        ))}
      </section>
    );
  }

  function renderHousehold() {
    const item = selectedHousehold || household;
    return (
      <section style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Household Snapshot</h2>
        <div style={styles.nav}>
          <button style={styles.button} onClick={() => setView("dashboard")}>Back to Dashboard</button>
          <button style={styles.button} onClick={() => setView("admin")}>Back to Admin</button>
          <button style={styles.button} onClick={() => setView("calendar")}>Go to Calendar</button>
        </div>

        <div style={styles.grid2}>
          <div style={{ border: "1px solid #d6dde8", borderRadius: 12, padding: 14 }}>
            <h3>Client</h3>
            <p><strong>{fullName(item.client)}</strong></p>
            <p>Birthdate: {item.client.birthdate || "-"} · Age: {calculateAge(item.client.birthdate) || item.client.age || "-"}</p>
            <p>Phone: {item.client.phone || "-"}</p>
            <p>Email: {item.client.email || "-"}</p>
            <p>Address: {item.client.address || "-"}</p>
            <p>{item.client.city || ""} {item.client.state || ""} {item.client.zip || ""}</p>
          </div>

          <div style={{ border: "1px solid #d6dde8", borderRadius: 12, padding: 14 }}>
            <h3>Spouse</h3>
            {personHasData(item.spouse) ? (
              <>
                <p><strong>{fullName(item.spouse)}</strong></p>
                <p>Birthdate: {item.spouse.birthdate || "-"} · Age: {calculateAge(item.spouse.birthdate) || item.spouse.age || "-"}</p>
                <p>Phone: {item.spouse.phone || "-"}</p>
                <p>Email: {item.spouse.email || "-"}</p>
                <p>Address: {item.spouse.address || "-"}</p>
                <p>{item.spouse.city || ""} {item.spouse.state || ""} {item.spouse.zip || ""}</p>
              </>
            ) : <p>No spouse information entered.</p>}
          </div>
        </div>

        <div style={{ border: "1px solid #d6dde8", borderRadius: 12, padding: 14, marginTop: 12 }}>
          <h3>Admin Summary</h3>
          <p>Status: {item.status || "-"}</p>
          <p>Assigned Agent: {item.assignedAgent || "-"}</p>
          <p>Reason: {item.reasonForCall || "-"}</p>
          <p>Referral: {item.referredBy || "-"}</p>
          <p>Current Coverage: {item.currentCoverage || "-"}</p>
          <p>Current Premium: {item.currentPremium || "-"}</p>
          <p>Health Flags: {item.healthFlags?.length ? item.healthFlags.join(", ") : "None"}</p>
          <p>Notes: {item.notes || "-"}</p>
        </div>
      </section>
    );
  }

  function renderAgentPage() {
    return (
      <section style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Agent Page</h2>
        <p>Select an agent from the dashboard status cards, then use Calendar or Admin Intake to schedule and manage work.</p>
        <div style={styles.nav}>
          <button style={styles.button} onClick={() => setView("dashboard")}>Back to Dashboard</button>
          <button style={styles.button} onClick={() => setView("calendar")}>Go to Calendar</button>
        </div>
      </section>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <h1 style={{ margin: 0 }}>SIPS Connect</h1>
          <p style={{ marginBottom: 0 }}>Dashboard, Admin Intake, Agent Status, Calendar, Clients, Today, and Household in one file.</p>
        </header>

        <TopNav view={view} setView={setView} />

        {view === "dashboard" && renderDashboard()}
        {view === "admin" && renderAdmin()}
        {view === "calendar" && renderCalendar()}
        {view === "clients" && renderClients()}
        {view === "today" && renderToday()}
        {view === "household" && renderHousehold()}
        {view === "agent" && renderAgentPage()}
      </div>
    </main>
  );
}
