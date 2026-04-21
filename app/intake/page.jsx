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
  const hasHadBirthday =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);

  if (!hasHadBirthday) age -= 1;
  if (age < 0 || age > 120) return "";
  return String(age);
}

const initialPerson = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  birthdate: "",
  address: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  sex: "",
  tobacco: "",
  height: "",
  weight: "",
  coverageType: "",
  partAEffective: "",
  partBEffective: "",
  currentCarrier: "",
  currentPremium: "",
};

const initialForm = {
  client: { ...initialPerson },
  spouse: { ...initialPerson },
  agent: "",
  notes: "",
};

export default function IntakePage() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");

  const clientAge = useMemo(
    () => calculateAge(form.client.birthdate),
    [form.client.birthdate]
  );
  const spouseAge = useMemo(
    () => calculateAge(form.spouse.birthdate),
    [form.spouse.birthdate]
  );

  function updatePerson(section, field, value) {
    let nextValue = value;

    if (field === "phone") nextValue = formatPhone(value);
    if (
      field === "birthdate" ||
      field === "partAEffective" ||
      field === "partBEffective"
    ) {
      nextValue = formatDate(value);
    }

    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: nextValue,
      },
    }));
  }

  function updateRoot(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("Intake saved locally for now. Next step is connecting this form to Supabase and Medicare Pro.");
    console.log("Intake form data", {
      ...form,
      client: { ...form.client, age: clientAge },
      spouse: { ...form.spouse, age: spouseAge },
    });
  }

  function PersonSection({ title, section, age }) {
    const data = form[section];

    return (
      <section
        style={{
          border: "1px solid #d0d7de",
          borderRadius: "10px",
          padding: "20px",
          display: "grid",
          gap: "12px",
        }}
      >
        <h2 style={{ margin: 0 }}>{title}</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <input
            placeholder="First Name"
            value={data.firstName}
            onChange={(e) => updatePerson(section, "firstName", e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Last Name"
            value={data.lastName}
            onChange={(e) => updatePerson(section, "lastName", e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <input
            placeholder="Phone"
            value={data.phone}
            onChange={(e) => updatePerson(section, "phone", e.target.value)}
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="Email"
            value={data.email}
            onChange={(e) => updatePerson(section, "email", e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: "12px" }}>
          <input
            placeholder="Birthdate (MM/DD/YYYY)"
            value={data.birthdate}
            onChange={(e) => updatePerson(section, "birthdate", e.target.value)}
            style={inputStyle}
          />
          <input value={age} placeholder="Age" readOnly style={inputStyle} />
        </div>

        <input
          placeholder="Address"
          value={data.address}
          onChange={(e) => updatePerson(section, "address", e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Street"
          value={data.street}
          onChange={(e) => updatePerson(section, "street", e.target.value)}
          style={inputStyle}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr 0.6fr", gap: "12px" }}>
          <input
            placeholder="City"
            value={data.city}
            onChange={(e) => updatePerson(section, "city", e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="State"
            value={data.state}
            onChange={(e) => updatePerson(section, "state", e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="ZIP Code"
            value={data.zip}
            onChange={(e) => updatePerson(section, "zip", e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          <select
            value={data.sex}
            onChange={(e) => updatePerson(section, "sex", e.target.value)}
            style={inputStyle}
          >
            <option value="">Sex</option>
            {sexOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={data.tobacco}
            onChange={(e) => updatePerson(section, "tobacco", e.target.value)}
            style={inputStyle}
          >
            <option value="">Tobacco</option>
            {tobaccoOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={data.coverageType}
            onChange={(e) => updatePerson(section, "coverageType", e.target.value)}
            style={inputStyle}
          >
            <option value="">Coverage Type</option>
            {coverageTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <input
            placeholder="Height"
            value={data.height}
            onChange={(e) => updatePerson(section, "height", e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Weight"
            value={data.weight}
            onChange={(e) => updatePerson(section, "weight", e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <input
            placeholder="Part A Effective Date"
            value={data.partAEffective}
            onChange={(e) => updatePerson(section, "partAEffective", e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Part B Effective Date"
            value={data.partBEffective}
            onChange={(e) => updatePerson(section, "partBEffective", e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <input
            placeholder="Current Carrier"
            value={data.currentCarrier}
            onChange={(e) => updatePerson(section, "currentCarrier", e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Current Med Supp Premium"
            value={data.currentPremium}
            onChange={(e) => updatePerson(section, "currentPremium", e.target.value)}
            style={inputStyle}
          />
        </div>
      </section>
    );
  }

  return (
    <main style={{ padding: "32px", fontFamily: "Arial, sans-serif", maxWidth: "1100px", margin: "0 auto" }}>
      <h1>New Intake</h1>
      <p>Client and spouse intake form matched to your sheet.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px", marginTop: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <PersonSection title="Client" section="client" age={clientAge} />
          <PersonSection title="Spouse" section="spouse" age={spouseAge} />
        </div>

        <section
          style={{
            border: "1px solid #d0d7de",
            borderRadius: "10px",
            padding: "20px",
            display: "grid",
            gap: "12px",
          }}
        >
          <h2 style={{ margin: 0 }}>Admin</h2>

          <select
            value={form.agent}
            onChange={(e) => updateRoot("agent", e.target.value)}
            style={{ ...inputStyle, maxWidth: "360px" }}
          >
            <option value="">Assign Agent</option>
            {agentOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Notes"
            value={form.notes}
            onChange={(e) => updateRoot("notes", e.target.value)}
            rows={5}
            style={inputStyle}
          />
        </section>

        <div style={{ display: "flex", gap: "12px" }}>
          <button type="submit" style={buttonStyle}>
            Save Intake
          </button>
          <a href="/dashboard" style={secondaryButtonStyle}>
            Return to Dashboard
          </a>
        </div>

        {message && <p style={{ margin: 0 }}>{message}</p>}
      </form>
    </main>
  );
}

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
  border: "none",
  cursor: "pointer",
};

const secondaryButtonStyle = {
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #c9d1d9",
  textDecoration: "none",
  color: "inherit",
  display: "inline-block",
};

