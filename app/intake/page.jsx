"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const agentOptions = [
  "Loyd Richardson",
  "Jimmie Bassett",
  "William Sykes",
  "Blake Richardson",
  "Christiana Grant",
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

const agentInitialsMap = {
  "Loyd Richardson": "LR",
  "Blake Richardson": "BR",
  "William Sykes": "WS",
  "Jimmie Bassett": "JB",
  "Christiana Grant": "CG",
  Admin: "ADMIN",
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

const reasonOptions = [
  "Phone appointment",
  "Office appointment",
  "Service",
  "Follow up",
  "Claims issue",
  "Prescription drug plan",
  "Referral",
  "Business/HR director",
];

const appointmentOptions = [
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

const healthOptions = [
  "Cognitive impairment",
  "Heart",
  "Stroke or TIA",
  "Diabetes with insulin",
  "AFIB",
  "More than 2 hospital stays",
  "Surgeries pending",
];

const sexOptions = ["Male", "Female"];
const tobaccoOptions = ["Yes", "No"];

const coverageTypeOptions = [
  "Group coverage",
  "Medicare",
  "Individual coverage",
  "Other",
];

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

const cardStyle = {
  border: "1px solid #d0d7de",
  borderRadius: "10px",
  padding: "20px",
  display: "grid",
  gap: "12px",
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

  if (!month || !day || !year) return "";

  const today = new Date();
  let age = today.getFullYear() - year;

  const hadBirthday =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);

  if (!hadBirthday) age -= 1;
  if (age < 0 || age > 120) return "";

  return String(age);
}

function buildAppointmentTimes(date, time, duration) {
  if (!date || !time) return null;

  const start = new Date(`${date}T${time}:00`);
  const durationMinutes = Number(duration || 30);
  const end = new Date(start.getTime() + durationMinutes * 60000);

  return { start, end, durationMinutes };
}

function PersonSection({ title, data, age, onUpdate, phoneMatches }) {
  return (
    <section style={cardStyle}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <input value={data.firstName} onChange={(e) => onUpdate("firstName", e.target.value)} placeholder={`${title} First Name`} style={inputStyle} />
        <input value={data.lastName} onChange={(e) => onUpdate("lastName", e.target.value)} placeholder={`${title} Last Name`} style={inputStyle} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <input value={data.phone} onChange={(e) => onUpdate("phone", e.target.value)} placeholder={`${title} Phone`} style={inputStyle} />
        <input value={data.email} onChange={(e) => onUpdate("email", e.target.value)} placeholder={`${title} Email`} style={inputStyle} />
      </div>

      {data.phone ? (
        <div>
          <input value={data.phoneConfirm} onChange={(e) => onUpdate("phoneConfirm", e.target.value)} placeholder={`Re-enter ${title} Phone to verify`} style={inputStyle} />
          <div style={{ marginTop: "6px", fontSize: "13px" }}>
            {data.phoneConfirm ? phoneMatches ? "Phone verified" : "Phone numbers do not match" : "Please re-enter phone number"}
          </div>
        </div>
      ) : null}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <input value={data.birthdate} onChange={(e) => onUpdate("birthdate", e.target.value)} placeholder={`${title} Birthdate MM/DD/YYYY`} style={inputStyle} />
        <input value={age} readOnly placeholder={`${title} Age`} style={inputStyle} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <input value={data.address} onChange={(e) => onUpdate("address", e.target.value)} placeholder={`${title} Address`} style={inputStyle} />
        <input value={data.city} onChange={(e) => onUpdate("city", e.target.value)} placeholder={`${title} City`} style={inputStyle} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <input value={data.state} onChange={(e) => onUpdate("state", e.target.value)} placeholder={`${title} State`} style={inputStyle} />
        <input value={data.zip} onChange={(e) => onUpdate("zip", e.target.value)} placeholder={`${title} ZIP`} style={inputStyle} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
        <select value={data.sex} onChange={(e) => onUpdate("sex", e.target.value)} style={inputStyle}>
          <option value="">Sex</option>
          {sexOptions.map((x) => <option key={x} value={x}>{x}</option>)}
        </select>

        <select value={data.tobacco} onChange={(e) => onUpdate("tobacco", e.target.value)} style={inputStyle}>
          <option value="">Tobacco</option>
          {tobaccoOptions.map((x) => <option key={x} value={x}>{x}</option>)}
        </select>

        <select value={data.coverageType} onChange={(e) => onUpdate("coverageType", e.target.value)} style={inputStyle}>
          <option value="">Coverage Type</option>
          {coverageTypeOptions.map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
      </div>
    </section>
  );
}

export default function IntakePage() {
  const [client, setClient] = useState({ ...blankPerson });
  const [spouse, setSpouse] = useState({ ...blankPerson });

  const [agent, setAgent] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const [schedulerAgent, setSchedulerAgent] = useState("Admin");
  const [appointmentType, setAppointmentType] = useState("Service");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentDuration, setAppointmentDuration] = useState("60");
  const [appointmentLocation, setAppointmentLocation] = useState("Phone Call");
  const [availabilityMessage, setAvailabilityMessage] = useState("");

  const [health, setHealth] = useState([]);

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(null);

  const clientAge = useMemo(() => calculateAge(client.birthdate), [client.birthdate]);
  const spouseAge = useMemo(() => calculateAge(spouse.birthdate), [spouse.birthdate]);

  const clientPhoneMatches =
    !client.phone && !client.phoneConfirm ? true : client.phone === client.phoneConfirm;

  const spousePhoneMatches =
    !spouse.phone && !spouse.phoneConfirm ? true : spouse.phone === spouse.phoneConfirm;

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUserId(data?.user?.id || null);
    }
    loadUser();
  }, []);

  function updateClient(field, value) {
    let next = value;
    if (field === "phone" || field === "phoneConfirm") next = formatPhone(value);
    if (field === "birthdate") next = formatDate(value);
    setClient((prev) => ({ ...prev, [field]: next }));
  }

  function updateSpouse(field, value) {
    let next = value;
    if (field === "phone" || field === "phoneConfirm") next = formatPhone(value);
    if (field === "birthdate") next = formatDate(value);
    setSpouse((prev) => ({ ...prev, [field]: next }));
  }

  function spouseHasData() {
    return Boolean(
      spouse.firstName ||
        spouse.lastName ||
        spouse.phone ||
        spouse.email ||
        spouse.birthdate ||
        spouse.address ||
        spouse.city ||
        spouse.state ||
        spouse.zip ||
        spouse.sex ||
        spouse.tobacco ||
        spouse.coverageType
    );
  }

  function toggleHealth(option) {
    setHealth((prev) =>
      prev.includes(option) ? prev.filter((x) => x !== option) : [...prev, option]
    );
  }

  async function checkAvailability() {
    const times = buildAppointmentTimes(appointmentDate, appointmentTime, appointmentDuration);

    if (!times) {
      alert("Please choose appointment date and time.");
      return;
    }

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

  async function handleSubmit(e) {
    e.preventDefault();

    if (!userId) {
      setMessage("You must be signed in before saving intake.");
      return;
    }

    if (!clientPhoneMatches) {
      setMessage("Client phone numbers do not match.");
      return;
    }

    if (spouseHasData() && !spousePhoneMatches) {
      setMessage("Spouse phone numbers do not match.");
      return;
    }

    setSaving(true);
    setMessage("");

    const times = buildAppointmentTimes(appointmentDate, appointmentTime, appointmentDuration);

    const { data: householdData, error: householdError } = await supabase
      .from("households")
      .insert([
        {
          owner_user_id: userId,
          assigned_agent: agent,
          notes,
          reason_for_call: reason,
          health_flags: health,
          appointment_type: appointmentType,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          appointment_duration: Number(appointmentDuration || 60),
          appointment_location: appointmentLocation,
        },
      ])
      .select()
      .single();

    if (householdError) {
      setMessage(householdError.message);
      setSaving(false);
      return;
    }

    const householdId = householdData.id;

    const peopleToInsert = [
      {
        household_id: householdId,
        person_type: "client",
        first_name: client.firstName,
        last_name: client.lastName,
        phone: client.phone,
        email: client.email,
        birthdate: client.birthdate,
        age: clientAge,
        address: client.address,
        city: client.city,
        state: client.state,
        zip: client.zip,
        sex: client.sex,
        tobacco: client.tobacco,
        coverage_type: client.coverageType,
      },
    ];

    if (spouseHasData()) {
      peopleToInsert.push({
        household_id: householdId,
        person_type: "spouse",
        first_name: spouse.firstName,
        last_name: spouse.lastName,
        phone: spouse.phone,
        email: spouse.email,
        birthdate: spouse.birthdate,
        age: spouseAge,
        address: spouse.address,
        city: spouse.city,
        state: spouse.state,
        zip: spouse.zip,
        sex: spouse.sex,
        tobacco: spouse.tobacco,
        coverage_type: spouse.coverageType,
      });
    }

    const { error: peopleError } = await supabase.from("people").insert(peopleToInsert);

    if (peopleError) {
      setMessage(peopleError.message);
      setSaving(false);
      return;
    }

    await supabase.from("intakes").insert([
      {
        household_id: householdId,
        created_by: userId,
        notes,
      },
    ]);

    if (times && appointmentDate && appointmentTime) {
      const clientName = `${client.firstName || ""} ${client.lastName || ""}`.trim() || "Client";
      const typeCode = appointmentCodeMap[appointmentType] || appointmentType;
      const agentCode = agentInitialsMap[schedulerAgent] || schedulerAgent;
      const aorCode = agentInitialsMap[agent] || agent || "-";
      const healthSummary = health.length ? health.join(", ") : "None";
      const householdLink = `${window.location.origin}/households/${householdId}`;

      const description =
        `OPEN CLIENT FILE:\n${householdLink}\n\n` +
        `Reason for Call: ${reason || appointmentType || "-"}\n` +
        `Assigned Agent: ${schedulerAgent}\n` +
        `Client: ${clientName}\n` +
        `Phone: ${client.phone || "-"}\n` +
        `Email: ${client.email || "-"}\n` +
        `Age: ${clientAge || "-"}\n` +
        `ZIP: ${client.zip || "-"}\n` +
        `AOR: ${aorCode}\n\n` +
        `Premiums:\n` +
        `Current Premium: -\n` +
        `Proposed Premium: -\n` +
        `Recommended Carrier: -\n` +
        `Recommended Plan: -\n` +
        `Effective Date: -\n\n` +
        `Health Conditions:\n` +
        `${healthSummary}\n\n` +
        `Notes:\n` +
        `${notes || "-"}`;

      const calendarRes = await fetch("/api/calendar/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agents: [schedulerAgent],
          title: `[${typeCode}] ${clientName} | ${agentCode}`,
          description,
          location: appointmentLocation || "Office",
          start: times.start.toISOString(),
          end: times.end.toISOString(),
        }),
      });

      const calendarData = await calendarRes.json();

      if (!calendarData.success) {
        setMessage(`Intake saved, but calendar failed: ${calendarData.error}`);
        setSaving(false);
        return;
      }
    }

    setMessage("Admin intake saved successfully.");
    setClient({ ...blankPerson });
    setSpouse({ ...blankPerson });
    setAgent("");
    setReason("");
    setNotes("");
    setHealth([]);
    setAvailabilityMessage("");
    setSaving(false);
  }

  return (
    <main style={{ padding: "32px", fontFamily: "Arial, sans-serif", maxWidth: "1100px", margin: "0 auto" }}>
      <h1>Admin Intake</h1>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
        <a href="/dashboard" style={buttonStyle}>Dashboard</a>
        <a href="/clients" style={buttonStyle}>Clients</a>
        <a href="/today" style={buttonStyle}>Today’s Appointments</a>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "24px", marginTop: "24px" }}>
        <PersonSection title="Client" data={client} age={clientAge} onUpdate={updateClient} phoneMatches={clientPhoneMatches} />

        <PersonSection title="Spouse" data={spouse} age={spouseAge} onUpdate={updateSpouse} phoneMatches={spousePhoneMatches} />

        <section style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>Admin</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <select value={agent} onChange={(e) => setAgent(e.target.value)} style={inputStyle}>
              <option value="">AOR / Assign Agent</option>
              {agentOptions.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>

            <select value={reason} onChange={(e) => setReason(e.target.value)} style={inputStyle}>
              <option value="">Reason for Call</option>
              {reasonOptions.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </div>

          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" rows={5} style={inputStyle} />
        </section>

        <section style={cardStyle}>
          <h2 style={{ margin: 0 }}>Appointment Scheduler</h2>

          <select value={schedulerAgent} onChange={(e) => setSchedulerAgent(e.target.value)} style={inputStyle}>
            {schedulerAgentOptions.map((agentName) => (
              <option key={agentName} value={agentName}>
                {agentName} — {agentInitialsMap[agentName]} — {agentColorLabels[agentName]}
              </option>
            ))}
          </select>

          <select value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)} style={inputStyle}>
            {appointmentOptions.map((x) => <option key={x} value={x}>{x}</option>)}
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
              <option value="Phone Call">Phone Call</option>
              <option value="Office">Office</option>
              <option value="Client Home">Client Home</option>
              <option value="Zoom / Virtual">Zoom / Virtual</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button type="button" onClick={checkAvailability} style={buttonStyle}>
              Check Availability
            </button>
          </div>

          {availabilityMessage ? <p>{availabilityMessage}</p> : null}
        </section>

        <section style={cardStyle}>
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

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button type="submit" style={buttonStyle} disabled={saving}>
            {saving ? "Saving..." : "Save Admin Intake"}
          </button>

          <a href="/dashboard" style={buttonStyle}>
            Return to Dashboard
          </a>
        </div>

        {message ? <p>{message}</p> : null}
      </form>
    </main>
  );
}
