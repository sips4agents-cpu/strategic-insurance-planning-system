"use client";

import { useMemo, useState } from "react";

const agentOptions = [
  "Loyd Richardson",
  "Jimmie Bassett",
  "William Sykes",
  "Blake Richardson",
];

const sexOptions = ["Male", "Female"];
const tobaccoOptions = ["Yes", "No"];
const coverageTypeOptions = [
  "Group coverage",
  "Medicare",
  "Individual coverage",
  "Other",
];

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

const inputStyle = {
  padding: "12px",
  border: "1px solid #c9d1d9",
  borderRadius: "8px",
  fontSize: "14px",
  width: "100%",
  boxSizing: "border-box",
};

const boxStyle = {
  border: "1px solid #d0d7de",
  borderRadius: "10px",
  padding: "20px",
  display: "grid",
  gap: "12px",
};

const grid2 = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
};

const grid3 = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "12px",
};

const buttonStyle = {
  padding: "12px 16px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};

const linkStyle = {
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #c9d1d9",
  textDecoration: "none",
  color: "inherit",
  display: "inline-block",
};

function PersonSection({ title, data, age, onUpdate }) {
  return (
    <section style={boxStyle}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>

      <div style={grid2}>
        <input
          value={data.firstName}
          onChange={(e) => onUpdate("firstName", e.target.value)}
          placeholder={`${title} First Name`}
          style={inputStyle}
        />
        <input
          value={data.lastName}
          onChange={(e) => onUpdate("lastName", e.target.value)}
          placeholder={`${title} Last Name`}
          style={inputStyle}
        />
      </div>

      <div style={grid2}>
        <input
          value={data.phone}
          onChange={(e) => onUpdate("phone", e.target.value)}
          placeholder={`${title} Phone`}
          style={inputStyle}
        />
        <input
          value={data.email}
          onChange={(e) => onUpdate("email", e.target.value)}
          placeholder={`${title} Email`}
          style={inputStyle}
        />
      </div>

      <div style={grid2}>
        <input
          value={data.birthdate}
          onChange={(e) => onUpdate("birthdate", e.target.value)}
          placeholder={`${title} Birthdate`}
          style={inputStyle}
        />
        <input value={age} readOnly placeholder={`${title} Age`} style={inputStyle} />
      </div>

      <div style={grid2}>
        <input
          value={data.address}
          onChange={(e) => onUpdate("address", e.target.value)}
          placeholder={`${title} Address`}
          style={inputStyle}
        />
        <input
          value={data.city}
          onChange={(e) => onUpdate("city", e.target.value)}
          placeholder={`${title} City`}
          style={inputStyle}
        />
      </div>

      <div style={grid2}>
        <input
          value={data.state}
          onChange={(e) => onUpdate("state", e.target.value)}
          placeholder={`${title} State`}
          style={inputStyle}
        />
        <input
          value={data.zip}
          onChange={(e) => onUpdate("zip", e.target.value)}
          placeholder={`${title} ZIP`}
          style={inputStyle}
        />
      </div>

      <div style={grid3}>
        <select
          value={data.sex}
          onChange={(e) => onUpdate("sex", e.target.value)}
          style={inputStyle}
        >
          <option value="">Sex</option>
          {sexOptions.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>

        <select
          value={data.tobacco}
          onChange={(e) => onUpdate("tobacco", e.target.value)}
          style={inputStyle}
        >
          <option value="">Tobacco</option>
          {tobaccoOptions.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>

        <select
          value={data.coverageType}
          onChange={(e) => onUpdate("coverageType", e.target.value)}
          style={inputStyle}
        >
          <option value="">Coverage Type</option>
          {coverageTypeOptions.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

export default function IntakePage() {
  const [client, setClient] = useState({ ...blankPerson });
  const [spouse, setSpouse] = useState({ ...blankPerson });
  const [agent, setAgent] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const clientAge = useMemo(() => calculateAge(client.birthdate), [client.birthdate]);
  const spouseAge = useMemo(() => calculateAge(spouse.birthdate), [spouse.birthdate]);

  function updateClient(field, value) {
    let next = value;
    if (field === "phone") next = formatPhone(value);
    if (field === "birthdate") next = formatDate(value);
    setClient((prev) => ({ ...prev, [field]: next }));
  }

  function updateSpouse(field, value) {
    let next = value;
    if (field === "phone") next = formatPhone(value);
    if (field === "birthdate") next = formatDate(value);
    setSpouse((prev) => ({ ...prev, [field]: next }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("Intake saved locally for now.");
    console.log({
      client: { ...client, age: clientAge },
      spouse: { ...spouse, age: spouseAge },
      agent,
      notes,
    });
  }

  return (
    <main
      style={{
        padding: "32px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      <h1>New Intake</h1>
      <p>Client and spouse intake form.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "24px", marginTop: "24px" }}>
        <PersonSection
          title="Client"
          data={client}
          age={clientAge}
          onUpdate={updateClient}
        />

        <PersonSection
          title="Spouse"
          data={spouse}
          age={spouseAge}
          onUpdate={updateSpouse}
        />

        <section style={boxStyle}>
          <h2 style={{ marginTop: 0 }}>Admin</h2>

          <div style={grid2}>
            <select value={agent} onChange={(e) => setAgent(e.target.value)} style={inputStyle}>
              <option value="">Assign Agent</option>
              {agentOptions.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>

            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes"
              style={inputStyle}
            />
          </div>
        </section>

        <div style={{ display: "flex", gap: "12px" }}>
          <button type="submit" style={buttonStyle}>
            Save Intake
          </button>
          <a href="/dashboard" style={linkStyle}>
            Return to Dashboard
          </a>
        </div>

        {message ? <p>{message}</p> : null}
      </form>
    </main>
  );
} 
