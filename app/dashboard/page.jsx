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
  "L564 Employer Form":
    "Please forward the attached CMS-L564 employer form to HR. Once HR completes and signs it, send it back so we can attach it to your Medicare file.",
  "Policy Review Documents":
    "Please send a copy of your current policy, premium notice, prescription list, and doctor list so we can complete your review.",
};

const COVERAGE_OPTIONS = ["Medicare", "Group", "Individual Health", "Cobra"];
const GROUP_SIZE_OPTIONS = ["20 or more employees", "Less than 20 employees"];
const PROPOSED_PREMIUM_SOURCES = ["Manual input", "Get premium from CSG rater"];
const SIPS_GOOGLE_CALENDAR_URL = "https://calendar.google.com/calendar/u/0/r/day";

const ATTACHABLE_FORMS = [
  "CMS-L564 Employer Coverage Form",
  "Medicare Part B Application",
  "Scope of Appointment",
  "Prescription Drug List",
  "Provider List",
  "Current Policy / Premium Notice",
  "Claims / EOB Documents",
];

const blankPerson = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  forms: "",
  birthdate: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  sex: "",
  tobacco: "",
  coverageType: "",
  health: "",
  status: "",
  weight: "",
  height: "",
  currentCarrier: "",
  currentMedSuppPremium: "",
  proposedCarrier: "",
  proposedPlan: "",
  proposedPremiumSource: "Manual input",
  proposedMedSuppPremium: "",
  csgProposedPremium: "",
  manualOverrideProposedRate: "",
  currentTotalPremium: "",
};

const blankAncillaryRow = {
  clientCurrent: "",
  clientAction: "",
  clientProposed: "",
  spouseCurrent: "",
  spouseAction: "",
  spouseProposed: "",
};

const blankAncillary = {
  Dental: { ...blankAncillaryRow },
  Cancer: { ...blankAncillaryRow },
  "Short Term Care": { ...blankAncillaryRow },
  "Final Expense": { ...blankAncillaryRow },
};

const blankHousehold = {
  id: "",
  assignedAgent: "Admin",
  status: "New",
  referredBy: "",
  currentCoverage: "",
  groupSize: "",
  currentPremium: "",
  reasonForCall: "Service",
  notes: "",
  healthFlags: [],
  ancillary: {
    Dental: { ...blankAncillaryRow },
    Cancer: { ...blankAncillaryRow },
    "Short Term Care": { ...blankAncillaryRow },
    "Final Expense": { ...blankAncillaryRow },
  },
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

function moneyValue(value) {
  const number = Number(String(value || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(number) ? number : 0;
}

function moneyDisplay(value) {
  const number = Number(value || 0);
  return number.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function getEffectiveProposed(person) {
  const override = moneyValue(person.manualOverrideProposedRate);
  if (override > 0) return override;

  if (person.proposedPremiumSource === "Get premium from CSG rater") {
    const csgRate = moneyValue(person.csgProposedPremium);
    if (csgRate > 0) return csgRate;
  }

  return moneyValue(person.proposedMedSuppPremium);
}

function calculatePremiumSnapshot(person, side, ancillary) {
  const currentMedSupp = moneyValue(person.currentMedSuppPremium);
  const proposedMedSupp = getEffectiveProposed(person);
  const ancillaryCurrent = Object.values(ancillary || {}).reduce(
    (sum, row) => sum + moneyValue(side === "client" ? row.clientCurrent : row.spouseCurrent),
    0
  );
  const ancillaryProposed = Object.values(ancillary || {}).reduce(
    (sum, row) => sum + moneyValue(side === "client" ? row.clientProposed : row.spouseProposed),
    0
  );
  const currentMonthly = currentMedSupp + ancillaryCurrent;
  const proposedMonthly = proposedMedSupp + ancillaryProposed;
  return {
    currentMonthly,
    proposedMonthly,
    monthlySavings: currentMonthly - proposedMonthly,
    annualSavings: (currentMonthly - proposedMonthly) * 12,
  };
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

function FactFinderQuoter({ household, updatePerson, updateHousehold, updateAncillary, saveIntake, createCalendarEvent, setView }) {
  const ancillary = household.ancillary || blankAncillary;
  const clientSnapshot = calculatePremiumSnapshot(household.client, "client", ancillary);
  const spouseSnapshot = calculatePremiumSnapshot(household.spouse, "spouse", ancillary);
  const totalCurrent = clientSnapshot.currentMonthly + spouseSnapshot.currentMonthly;
  const totalProposed = clientSnapshot.proposedMonthly + spouseSnapshot.proposedMonthly;
  const totalMonthlySavings = totalCurrent - totalProposed;
  const totalAnnualSavings = totalMonthlySavings * 12;

  const renderPersonFactFinder = (label, type, person) => (
    <section style={styles.card}>
      <h3 style={{ marginTop: 0 }}>{label} Fact Finder</h3>
      <div style={styles.grid2}>
        <input style={styles.input} value={person.firstName} onChange={(e) => updatePerson(type, "firstName", e.target.value)} placeholder="First Name" />
        <input style={styles.input} value={person.lastName} onChange={(e) => updatePerson(type, "lastName", e.target.value)} placeholder="Last Name" />
      </div>
      <div style={{ ...styles.grid2, marginTop: 12 }}>
        <input style={styles.input} value={person.phone} onChange={(e) => updatePerson(type, "phone", formatPhone(e.target.value))} placeholder="Phone" />
        <input style={styles.input} value={person.email} onChange={(e) => updatePerson(type, "email", e.target.value)} placeholder="Email" />
      </div>
      <div style={{ marginTop: 12 }}>
        <input style={styles.input} value={person.forms} onChange={(e) => updatePerson(type, "forms", e.target.value)} placeholder="Forms" />
      </div>
      <div style={{ ...styles.grid3, marginTop: 12 }}>
        <input style={styles.input} value={person.birthdate} onChange={(e) => updatePerson(type, "birthdate", formatDate(e.target.value))} placeholder="Birthdate MM/DD/YYYY" />
        <input style={styles.input} value={calculateAge(person.birthdate)} readOnly placeholder="Age" />
        <input style={styles.input} value={household.referredBy} onChange={(e) => updateHousehold("referredBy", e.target.value)} placeholder="Referred By" />
      </div>
      <div style={{ ...styles.grid3, marginTop: 12 }}>
        <input style={styles.input} value={person.health} onChange={(e) => updatePerson(type, "health", e.target.value)} placeholder="Health" />
        <select style={styles.input} value={person.status} onChange={(e) => updatePerson(type, "status", e.target.value)}>
          <option value="">Status</option>
          <option value="Good Health">Good Health</option>
          <option value="Needs Review">Needs Review</option>
          <option value="Underwriting Concern">Underwriting Concern</option>
          <option value="Decline Risk">Decline Risk</option>
        </select>
        <select style={styles.input} value={person.tobacco} onChange={(e) => updatePerson(type, "tobacco", e.target.value)}>
          <option value="">Tobacco</option>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>
      <div style={{ ...styles.grid2, marginTop: 12 }}>
        <input style={styles.input} value={person.weight} onChange={(e) => updatePerson(type, "weight", e.target.value)} placeholder="Weight" />
        <input style={styles.input} value={person.height} onChange={(e) => updatePerson(type, "height", e.target.value)} placeholder="Height" />
      </div>
      <div style={{ ...styles.grid2, marginTop: 12 }}>
        <input style={styles.input} value={person.currentCarrier} onChange={(e) => updatePerson(type, "currentCarrier", e.target.value)} placeholder="Current Carrier" />
        <input style={styles.input} value={person.currentMedSuppPremium} onChange={(e) => updatePerson(type, "currentMedSuppPremium", e.target.value)} placeholder="Current Med Supp Premium" />
      </div>
      <div style={{ ...styles.grid2, marginTop: 12 }}>
        <input style={styles.input} value={person.proposedCarrier} onChange={(e) => updatePerson(type, "proposedCarrier", e.target.value)} placeholder="Proposed Carrier" />
        <input style={styles.input} value={person.proposedPlan} onChange={(e) => updatePerson(type, "proposedPlan", e.target.value)} placeholder="Proposed Plan" />
      </div>
      <div style={{ ...styles.grid2, marginTop: 12 }}>
        <select style={styles.input} value={person.proposedPremiumSource || "Manual input"} onChange={(e) => updatePerson(type, "proposedPremiumSource", e.target.value)}>
          {PROPOSED_PREMIUM_SOURCES.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <input style={styles.input} value={person.proposedPremiumSource === "Get premium from CSG rater" ? person.csgProposedPremium : person.proposedMedSuppPremium} onChange={(e) => updatePerson(type, person.proposedPremiumSource === "Get premium from CSG rater" ? "csgProposedPremium" : "proposedMedSuppPremium", e.target.value)} placeholder={person.proposedPremiumSource === "Get premium from CSG rater" ? "CSG Rater Premium" : "Manual Proposed Premium"} />
        <input style={styles.input} value={person.manualOverrideProposedRate} onChange={(e) => updatePerson(type, "manualOverrideProposedRate", e.target.value)} placeholder="Manual Override Proposed Rate" />
      </div>
    </section>
  );

  return (
    <>
      <section style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Agent Fact Finder / Quoter</h2>
        <p style={{ marginTop: 0 }}>Built from your uploaded Quick FactFinder Quoter layout. Use this while the client is on the phone.</p>
      </section>

      <div style={styles.grid2}>
        {renderPersonFactFinder("Client", "client", household.client)}
        {renderPersonFactFinder("Spouse", "spouse", household.spouse)}
      </div>

      <section style={styles.card}>
        <h3 style={{ marginTop: 0 }}>Ancillary Products — Keep / Replace / Remove</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr>
                {["Product", "Applicant Current", "Applicant Action", "Applicant Proposed", "Spouse Current", "Spouse Action", "Spouse Proposed"].map((head) => (
                  <th key={head} style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #d6dde8" }}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(blankAncillary).map((product) => {
                const row = ancillary[product] || blankAncillaryRow;
                return (
                  <tr key={product}>
                    <td style={{ padding: 8, borderBottom: "1px solid #eef2f6", fontWeight: 700 }}>{product}</td>
                    <td style={{ padding: 8, borderBottom: "1px solid #eef2f6" }}><input style={styles.input} value={row.clientCurrent} onChange={(e) => updateAncillary(product, "clientCurrent", e.target.value)} placeholder="$" /></td>
                    <td style={{ padding: 8, borderBottom: "1px solid #eef2f6" }}>
                      <select style={styles.input} value={row.clientAction} onChange={(e) => updateAncillary(product, "clientAction", e.target.value)}>
                        <option value="">Action</option><option value="Keep">Keep</option><option value="Replace">Replace</option><option value="Remove">Remove</option><option value="Add">Add</option>
                      </select>
                    </td>
                    <td style={{ padding: 8, borderBottom: "1px solid #eef2f6" }}><input style={styles.input} value={row.clientProposed} onChange={(e) => updateAncillary(product, "clientProposed", e.target.value)} placeholder="$" /></td>
                    <td style={{ padding: 8, borderBottom: "1px solid #eef2f6" }}><input style={styles.input} value={row.spouseCurrent} onChange={(e) => updateAncillary(product, "spouseCurrent", e.target.value)} placeholder="$" /></td>
                    <td style={{ padding: 8, borderBottom: "1px solid #eef2f6" }}>
                      <select style={styles.input} value={row.spouseAction} onChange={(e) => updateAncillary(product, "spouseAction", e.target.value)}>
                        <option value="">Action</option><option value="Keep">Keep</option><option value="Replace">Replace</option><option value="Remove">Remove</option><option value="Add">Add</option>
                      </select>
                    </td>
                    <td style={{ padding: 8, borderBottom: "1px solid #eef2f6" }}><input style={styles.input} value={row.spouseProposed} onChange={(e) => updateAncillary(product, "spouseProposed", e.target.value)} placeholder="$" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section style={styles.card}>
        <h3 style={{ marginTop: 0 }}>Premium Snapshot</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead>
              <tr>
                {["Metric", "Applicant", "Spouse", "Total"].map((head) => <th key={head} style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #d6dde8" }}>{head}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr><td style={{ padding: 10 }}>Current Monthly Total</td><td>{moneyDisplay(clientSnapshot.currentMonthly)}</td><td>{moneyDisplay(spouseSnapshot.currentMonthly)}</td><td>{moneyDisplay(totalCurrent)}</td></tr>
              <tr><td style={{ padding: 10 }}>Proposed Monthly Total</td><td>{moneyDisplay(clientSnapshot.proposedMonthly)}</td><td>{moneyDisplay(spouseSnapshot.proposedMonthly)}</td><td>{moneyDisplay(totalProposed)}</td></tr>
              <tr><td style={{ padding: 10 }}>Monthly Savings</td><td>{moneyDisplay(clientSnapshot.monthlySavings)}</td><td>{moneyDisplay(spouseSnapshot.monthlySavings)}</td><td>{moneyDisplay(totalMonthlySavings)}</td></tr>
              <tr><td style={{ padding: 10 }}>Annual Savings</td><td>{moneyDisplay(clientSnapshot.annualSavings)}</td><td>{moneyDisplay(spouseSnapshot.annualSavings)}</td><td>{moneyDisplay(totalAnnualSavings)}</td></tr>
            </tbody>
          </table>
        </div>
        <div style={{ ...styles.nav, marginTop: 14 }}>
          <button type="button" style={styles.primaryButton} onClick={saveIntake}>Save Fact Finder Updates</button>
          <button type="button" style={styles.button} onClick={() => setView("quickRater")}>Open Quick Rater</button>
          <button type="button" style={styles.button} onClick={() => setView("calculator")}>Open Calculator</button>
          <button type="button" style={styles.button} onClick={createCalendarEvent}>Create Appointment</button>
          <button type="button" style={styles.button} onClick={() => setView("calendar")}>Open Appointments</button>
        </div>
      </section>
    </>
  );
}


function QuickRaterPage({ household, updatePerson, updateAncillary, setView, saveIntake }) {
  const ancillary = household.ancillary || blankAncillary;
  const clientSnapshot = calculatePremiumSnapshot(household.client, "client", ancillary);
  const spouseSnapshot = calculatePremiumSnapshot(household.spouse, "spouse", ancillary);
  const householdCurrent = clientSnapshot.currentMonthly + spouseSnapshot.currentMonthly;
  const householdProposed = clientSnapshot.proposedMonthly + spouseSnapshot.proposedMonthly;
  const householdSavings = householdCurrent - householdProposed;
  const householdAnnualSavings = householdSavings * 12;

  const quickPersonBlock = (label, type, person, side) => {
    const snapshot = calculatePremiumSnapshot(person, side, ancillary);
    return (
      <section style={styles.card}>
        <h3 style={{ marginTop: 0 }}>{label}</h3>
        <div style={styles.grid2}>
          <input style={styles.input} value={person.firstName} onChange={(e) => updatePerson(type, "firstName", e.target.value)} placeholder="Name" />
          <input style={styles.input} value={calculateAge(person.birthdate)} readOnly placeholder="Age" />
        </div>
        <div style={{ ...styles.grid2, marginTop: 12 }}>
          <input style={styles.input} value={person.zip} onChange={(e) => updatePerson(type, "zip", e.target.value)} placeholder="ZIP Code" />
          <select style={styles.input} value={person.tobacco} onChange={(e) => updatePerson(type, "tobacco", e.target.value)}>
            <option value="">Tobacco Use</option>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>
        <div style={{ marginTop: 12 }}>
          <input style={styles.input} value={person.health} onChange={(e) => updatePerson(type, "health", e.target.value)} placeholder="Current Health" />
        </div>
        <div style={{ overflowX: "auto", marginTop: 14 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
            <thead>
              <tr>
                {["Field", "Current", "Proposed"].map((head) => (
                  <th key={head} style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #d6dde8" }}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: 8, fontWeight: 700 }}>Med Supp Premium</td>
                <td style={{ padding: 8 }}><input style={styles.input} value={person.currentMedSuppPremium} onChange={(e) => updatePerson(type, "currentMedSuppPremium", e.target.value)} placeholder="$" /></td>
                <td style={{ padding: 8 }}>
                  <select
                    style={styles.input}
                    value={person.proposedPremiumSource || "Manual input"}
                    onChange={(e) => updatePerson(type, "proposedPremiumSource", e.target.value)}
                  >
                    {PROPOSED_PREMIUM_SOURCES.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                  {person.proposedPremiumSource === "Get premium from CSG rater" ? (
                    <div style={{ marginTop: 8 }}>
                      <input
                        style={styles.input}
                        value={person.csgProposedPremium}
                        onChange={(e) => updatePerson(type, "csgProposedPremium", e.target.value)}
                        placeholder="Premium from CSG Rater"
                      />
                      <button
                        type="button"
                        style={{ ...styles.button, marginTop: 8 }}
                        onClick={() => window.open("https://csgactuarial.com", "_blank", "noopener,noreferrer")}
                      >
                        Open CSG Rater
                      </button>
                    </div>
                  ) : (
                    <input
                      style={{ ...styles.input, marginTop: 8 }}
                      value={person.proposedMedSuppPremium}
                      onChange={(e) => updatePerson(type, "proposedMedSuppPremium", e.target.value)}
                      placeholder="Manual Proposed Premium"
                    />
                  )}
                </td>
              </tr>
              {Object.keys(blankAncillary).map((product) => {
                const row = ancillary[product] || blankAncillaryRow;
                const currentKey = side === "client" ? "clientCurrent" : "spouseCurrent";
                const proposedKey = side === "client" ? "clientProposed" : "spouseProposed";
                return (
                  <tr key={product}>
                    <td style={{ padding: 8, fontWeight: 700 }}>{product}</td>
                    <td style={{ padding: 8 }}><input style={styles.input} value={row[currentKey]} onChange={(e) => updateAncillary(product, currentKey, e.target.value)} placeholder="$" /></td>
                    <td style={{ padding: 8 }}><input style={styles.input} value={row[proposedKey]} onChange={(e) => updateAncillary(product, proposedKey, e.target.value)} placeholder="$" /></td>
                  </tr>
                );
              })}
              <tr>
                <td style={{ padding: 8, fontWeight: 700 }}>Current Monthly Total</td>
                <td style={{ padding: 8 }}>{moneyDisplay(snapshot.currentMonthly)}</td>
                <td style={{ padding: 8 }}></td>
              </tr>
              <tr>
                <td style={{ padding: 8, fontWeight: 700 }}>Proposed Monthly Total</td>
                <td style={{ padding: 8 }}></td>
                <td style={{ padding: 8 }}>{moneyDisplay(snapshot.proposedMonthly)}</td>
              </tr>
              <tr>
                <td style={{ padding: 8, fontWeight: 700 }}>Monthly Savings</td>
                <td style={{ padding: 8 }} colSpan={2}>{moneyDisplay(snapshot.monthlySavings)}</td>
              </tr>
              <tr>
                <td style={{ padding: 8, fontWeight: 700 }}>Annual Savings</td>
                <td style={{ padding: 8 }} colSpan={2}>{moneyDisplay(snapshot.annualSavings)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    );
  };

  return (
    <>
      <section style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Quick Rater</h2>
        <p style={{ marginTop: 0 }}>Linked to the Agent Fact Finder. Changes made here update the Agent page and Calculator automatically.</p>
        <div style={styles.nav}>
          <button type="button" style={styles.button} onClick={() => setView("agent")}>Return to Agent</button>
          <button type="button" style={styles.button} onClick={() => setView("calculator")}>View Calculator</button>
          <button type="button" style={styles.button} onClick={() => setView("dashboard")}>Back to Dashboard</button>
        </div>
      </section>

      <div style={styles.grid2}>
        {quickPersonBlock("Applicant", "client", household.client, "client")}
        {quickPersonBlock("Spouse", "spouse", household.spouse, "spouse")}
      </div>

      <section style={styles.card}>
        <h3 style={{ marginTop: 0 }}>Household Totals</h3>
        <div style={styles.grid2}>
          <div><strong>Current Monthly Total:</strong> {moneyDisplay(householdCurrent)}</div>
          <div><strong>Proposed Monthly Total:</strong> {moneyDisplay(householdProposed)}</div>
          <div><strong>Monthly Savings:</strong> {moneyDisplay(householdSavings)}</div>
          <div><strong>Annual Savings:</strong> {moneyDisplay(householdAnnualSavings)}</div>
        </div>
        <div style={{ ...styles.nav, marginTop: 14 }}>
          <button type="button" style={styles.primaryButton} onClick={() => { saveIntake(); }}>Save / Enter Quick Rater Updates</button>
          <button type="button" style={styles.button} onClick={() => setView("agent")}>Return to Agent</button>
          <button type="button" style={styles.button} onClick={() => setView("calculator")}>View Calculator</button>
        </div>
      </section>
    </>
  );
}

function CalculatorPage({ household, updatePerson, updateAncillary, setView, saveIntake }) {
  const ancillary = household.ancillary || blankAncillary;
  const clientSnapshot = calculatePremiumSnapshot(household.client, "client", ancillary);
  const spouseSnapshot = calculatePremiumSnapshot(household.spouse, "spouse", ancillary);
  const totalCurrent = clientSnapshot.currentMonthly + spouseSnapshot.currentMonthly;
  const totalProposed = clientSnapshot.proposedMonthly + spouseSnapshot.proposedMonthly;
  const monthlySavings = totalCurrent - totalProposed;
  const annualSavings = monthlySavings * 12;

  const calculatorRows = [
    ["Proposed supplement Plan G", "proposedMedSuppPremium", "proposedMedSuppPremium", "currentMedSuppPremium", "currentMedSuppPremium"],
    ["$10,000 Lump Sum Cancer", "Cancer", "Cancer", "Cancer", "Cancer"],
    ["$5,000 Dental", "Dental", "Dental", "Dental", "Dental"],
    ["$10,000 Final Expense", "Final Expense", "Final Expense", "Final Expense", "Final Expense"],
    ["Short Term Care", "Short Term Care", "Short Term Care", "Short Term Care", "Short Term Care"],
  ];

  function getRowValue(person, side, key, currentOrProposed) {
    if (key === "proposedMedSuppPremium") return person.proposedMedSuppPremium;
    if (key === "currentMedSuppPremium") return person.currentMedSuppPremium;
    const row = ancillary[key] || blankAncillaryRow;
    if (side === "client" && currentOrProposed === "proposed") return row.clientProposed;
    if (side === "spouse" && currentOrProposed === "proposed") return row.spouseProposed;
    if (side === "client" && currentOrProposed === "current") return row.clientCurrent;
    return row.spouseCurrent;
  }

  function setRowValue(side, key, currentOrProposed, value) {
    if (key === "proposedMedSuppPremium") {
      updatePerson(side, "proposedMedSuppPremium", value);
      return;
    }
    if (key === "currentMedSuppPremium") {
      updatePerson(side, "currentMedSuppPremium", value);
      return;
    }
    const field =
      side === "client"
        ? currentOrProposed === "proposed" ? "clientProposed" : "clientCurrent"
        : currentOrProposed === "proposed" ? "spouseProposed" : "spouseCurrent";
    updateAncillary(key, field, value);
  }

  return (
    <>
      <section style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Calculator</h2>
        <p style={{ marginTop: 0 }}>Original Medicare / Premium Comparison linked directly from Quick Rater and Agent Fact Finder.</p>
        <div style={styles.nav}>
          <button type="button" style={styles.button} onClick={() => setView("agent")}>Return to Agent</button>
          <button type="button" style={styles.button} onClick={() => setView("quickRater")}>Back to Quick Rater</button>
          <button type="button" style={styles.button} onClick={() => setView("dashboard")}>Back to Dashboard</button>
        </div>
      </section>

      <section style={styles.card}>
        <h3 style={{ marginTop: 0 }}>Original Medicare / Plan G Exposure</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 840 }}>
            <thead>
              <tr>
                {["Medicare A and B", "Medicare Pays All But", "Plan G Pays", "You Pay"].map((head) => (
                  <th key={head} style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #d6dde8" }}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Hospitalization First 60 Days", "All but $1,736", "$1,736", "$0"],
                ["61st Through 90th Day", "All but $434 a day", "$434 a day", "$0"],
                ["91st Day and After", "All but $868 a day", "$868 a day", "$0"],
                ["Skilled Nursing Facility 21st Through 100th Day", "All but $217 a day", "$217 a day", "$0"],
                ["Part B Deductible", "First $283", "$0", "$283"],
                ["Remainder of Part B Approved Amounts", "Generally 80%", "Generally 20%", "$0"],
                ["Part B Excess Charge", "$0", "100% approved", "$0"],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => <td key={cell} style={{ padding: 8, borderBottom: "1px solid #eef2f6" }}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>By law, every Medicare Supplement Plan G offers the same coverage regardless of insurance company.</p>
      </section>

      <section style={styles.card}>
        <h3 style={{ marginTop: 0 }}>Premium Comparison</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 980 }}>
            <thead>
              <tr>
                {["Product", "Proposed Monthly Premium", "Proposed Spouse Premium", "Current Monthly Premium", "Spouse Current Premium"].map((head) => (
                  <th key={head} style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #d6dde8" }}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {calculatorRows.map(([label, clientPropKey, spousePropKey, clientCurrentKey, spouseCurrentKey]) => (
                <tr key={label}>
                  <td style={{ padding: 8, fontWeight: 700 }}>{label}</td>
                  <td style={{ padding: 8 }}><input style={styles.input} value={getRowValue(household.client, "client", clientPropKey, "proposed")} onChange={(e) => setRowValue("client", clientPropKey, "proposed", e.target.value)} placeholder="$" /></td>
                  <td style={{ padding: 8 }}><input style={styles.input} value={getRowValue(household.spouse, "spouse", spousePropKey, "proposed")} onChange={(e) => setRowValue("spouse", spousePropKey, "proposed", e.target.value)} placeholder="$" /></td>
                  <td style={{ padding: 8 }}><input style={styles.input} value={getRowValue(household.client, "client", clientCurrentKey, "current")} onChange={(e) => setRowValue("client", clientCurrentKey, "current", e.target.value)} placeholder="$" /></td>
                  <td style={{ padding: 8 }}><input style={styles.input} value={getRowValue(household.spouse, "spouse", spouseCurrentKey, "current")} onChange={(e) => setRowValue("spouse", spouseCurrentKey, "current", e.target.value)} placeholder="$" /></td>
                </tr>
              ))}
              <tr><td style={{ padding: 8, fontWeight: 700 }}>Total Monthly Premium</td><td>{moneyDisplay(clientSnapshot.proposedMonthly)}</td><td>{moneyDisplay(spouseSnapshot.proposedMonthly)}</td><td>{moneyDisplay(clientSnapshot.currentMonthly)}</td><td>{moneyDisplay(spouseSnapshot.currentMonthly)}</td></tr>
              <tr><td style={{ padding: 8, fontWeight: 700 }}>Monthly Savings</td><td>{moneyDisplay(clientSnapshot.monthlySavings)}</td><td>{moneyDisplay(spouseSnapshot.monthlySavings)}</td><td colSpan={2}>{moneyDisplay(monthlySavings)}</td></tr>
              <tr><td style={{ padding: 8, fontWeight: 700 }}>Proposed Annual Savings</td><td>{moneyDisplay(clientSnapshot.annualSavings)}</td><td>{moneyDisplay(spouseSnapshot.annualSavings)}</td><td colSpan={2}>{moneyDisplay(annualSavings)}</td></tr>
              <tr><td style={{ padding: 8, fontWeight: 700 }}>Combined Savings</td><td colSpan={4}>{moneyDisplay(annualSavings)}</td></tr>
            </tbody>
          </table>
        </div>
        <div style={{ ...styles.nav, marginTop: 14 }}>
          <button type="button" style={styles.primaryButton} onClick={saveIntake}>Save Calculator Updates</button>
          <button type="button" style={styles.button} onClick={() => setView("agent")}>Return to Agent</button>
          <button type="button" style={styles.button} onClick={() => setView("quickRater")}>Back to Quick Rater</button>
        </div>
      </section>
    </>
  );
}



function buildIntegrationAutofillData(household) {
  const client = household.client || {};
  const spouse = household.spouse || {};

  const baseAddress = [client.address, client.city, client.state, client.zip]
    .filter(Boolean)
    .join(", ");

  return {
    medicarePro: {
      first_name: client.firstName || "",
      last_name: client.lastName || "",
      birthdate: client.birthdate || "",
      email: client.email || "",
      phone: client.phone || "",
      zip_code: client.zip || "",
      address: client.address || "",
      city: client.city || "",
      state: client.state || "",
      full_address: baseAddress,
      current_coverage: household.currentCoverage || "",
      group_size: household.groupSize || "",
      current_premium: household.currentPremium || client.currentMedSuppPremium || "",
      assigned_agent: household.assignedAgent || "",
      notes: household.notes || "",
    },
    monday: {
      item_name: fullName(client) || "New Client",
      first_name: client.firstName || "",
      last_name: client.lastName || "",
      birthdate: client.birthdate || "",
      email: client.email || "",
      phone: client.phone || "",
      zip_code: client.zip || "",
      address: client.address || "",
      status: household.status || "New",
      assigned_agent: household.assignedAgent || "",
      appointment_type: household.reasonForCall || "",
      current_coverage: household.currentCoverage || "",
      group_size: household.groupSize || "",
      current_premium: household.currentPremium || client.currentMedSuppPremium || "",
    },
    csgActuarial: {
      applicant_first_name: client.firstName || "",
      applicant_last_name: client.lastName || "",
      applicant_birthdate: client.birthdate || "",
      applicant_email: client.email || "",
      applicant_phone: client.phone || "",
      applicant_zip: client.zip || "",
      applicant_address: client.address || "",
      spouse_first_name: spouse.firstName || "",
      spouse_last_name: spouse.lastName || "",
      spouse_birthdate: spouse.birthdate || "",
      spouse_email: spouse.email || "",
      spouse_phone: spouse.phone || "",
      spouse_zip: spouse.zip || "",
      spouse_address: spouse.address || "",
      client_tobacco: client.tobacco || "",
      spouse_tobacco: spouse.tobacco || "",
      current_premium: household.currentPremium || client.currentMedSuppPremium || "",
    },
  };
}

function downloadIntegrationCsv(household) {
  const data = buildIntegrationAutofillData(household);
  const rows = [
    ["Platform", "Field", "Value"],
    ...Object.entries(data).flatMap(([platform, fields]) =>
      Object.entries(fields).map(([field, value]) => [platform, field, value || ""])
    ),
  ];

  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sips-autofill-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function IntegrationAutofillPanel({ household }) {
  const data = buildIntegrationAutofillData(household);
  const client = household.client || {};

  function copyPlatform(platformKey) {
    navigator.clipboard?.writeText(JSON.stringify(data[platformKey], null, 2));
    alert("Autofill fields copied. Paste into the platform or your import/API tool.");
  }

  function copyAll() {
    navigator.clipboard?.writeText(JSON.stringify(data, null, 2));
    alert("All Medicare Pro, Monday, and CSG fields copied.");
  }

  function openExternal(url) {
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  const requiredReady = Boolean(
    client.firstName &&
    client.lastName &&
    client.birthdate &&
    client.email &&
    client.phone &&
    client.zip
  );

  return (
    <section style={styles.card}>
      <h2 style={{ marginTop: 0 }}>Medicare Pro / Monday / CSG Autofill</h2>
      <p style={{ marginTop: 0 }}>
        Required fields pull from the live Agent/Admin record: first name, last name, birthdate, email, phone, ZIP, and address when available.
      </p>

      <div style={{ ...styles.grid3, marginBottom: 12 }}>
        <input style={styles.input} value={client.firstName || ""} readOnly placeholder="First Name" />
        <input style={styles.input} value={client.lastName || ""} readOnly placeholder="Last Name" />
        <input style={styles.input} value={client.birthdate || ""} readOnly placeholder="Birthdate" />
      </div>
      <div style={{ ...styles.grid3, marginBottom: 12 }}>
        <input style={styles.input} value={client.email || ""} readOnly placeholder="Email" />
        <input style={styles.input} value={client.phone || ""} readOnly placeholder="Phone" />
        <input style={styles.input} value={client.zip || ""} readOnly placeholder="ZIP Code" />
      </div>
      <input
        style={styles.input}
        value={[client.address, client.city, client.state, client.zip].filter(Boolean).join(", ")}
        readOnly
        placeholder="Address if available"
      />

      <div style={{ marginTop: 12, padding: 12, border: "1px solid #d6dde8", borderRadius: 12, background: requiredReady ? "#ecfdf5" : "#fff7ed" }}>
        {requiredReady
          ? "Ready: all required autofill fields are present."
          : "Missing required fields: add first name, last name, birthdate, email, phone, and ZIP before final platform entry."}
      </div>

      <div style={{ ...styles.nav, marginTop: 14 }}>
        <button type="button" style={styles.button} onClick={() => copyPlatform("medicarePro")}>Copy Medicare Pro Fields</button>
        <button type="button" style={styles.button} onClick={() => copyPlatform("monday")}>Copy Monday Fields</button>
        <button type="button" style={styles.button} onClick={() => copyPlatform("csgActuarial")}>Copy CSG Actuarial Fields</button>
        <button type="button" style={styles.primaryButton} onClick={copyAll}>Copy All Autofill Data</button>
        <button type="button" style={styles.button} onClick={() => downloadIntegrationCsv(household)}>Download CSV Import</button>
      </div>

      <div style={{ ...styles.nav, marginTop: 8 }}>
        <button type="button" style={styles.button} onClick={() => openExternal("https://www.monday.com/")}>Open Monday</button>
        <button type="button" style={styles.button} onClick={() => openExternal("https://www.csgactuarial.com/")}>Open CSG Actuarial</button>
      </div>

      <textarea
        style={{ ...styles.textarea, marginTop: 12 }}
        readOnly
        value={JSON.stringify(data, null, 2)}
      />
    </section>
  );
}


function extractLeadFromMessage(text) {
  const source = text || "";
  const normalized = source.replace(/\r/g, "\n");
  const emailMatch = normalized.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = normalized.match(/(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
  const dobMatch = normalized.match(/(?:dob|birthdate|date of birth|born)\s*[:\-]?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i) || normalized.match(/\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})\b/);
  const ageMatch = normalized.match(/(?:age)\s*[:\-]?\s*(\d{1,3})/i) || normalized.match(/\b(\d{2})\s*(?:years old|yo|yrs old)\b/i);
  const zipMatch = normalized.match(/\b\d{5}(?:-\d{4})?\b/);

  let firstName = "";
  let lastName = "";
  const nameLine = normalized.match(/(?:name|client|prospect)\s*[:\-]?\s*([A-Za-z][A-Za-z'\-]+(?:\s+[A-Za-z][A-Za-z'\-]+){0,3})/i);
  if (nameLine) {
    const parts = nameLine[1].trim().split(/\s+/);
    firstName = parts[0] || "";
    lastName = parts.slice(1).join(" ");
  } else {
    const candidate = normalized.split("\n").map((line) => line.trim()).find((line) => /^[A-Za-z][A-Za-z'\-]+\s+[A-Za-z][A-Za-z'\-]+/.test(line) && !/@/.test(line));
    if (candidate) {
      const cleaned = candidate.replace(/[^A-Za-z'\-\s]/g, " ").trim().split(/\s+/);
      firstName = cleaned[0] || "";
      lastName = cleaned.slice(1, 3).join(" ");
    }
  }

  let address = "";
  let city = "";
  let state = "";
  let zip = zipMatch ? zipMatch[0] : "";
  const addressLine = normalized.split("\n").map((line) => line.trim()).find((line) => /^\d{2,6}\s+/.test(line) && /(street|st\b|road|rd\b|drive|dr\b|lane|ln\b|ave\b|avenue|blvd|circle|cir\b|court|ct\b|highway|hwy|way)/i.test(line));

  if (addressLine) {
    address = addressLine;
    const cityStateZip = normalized.match(/([A-Za-z .'-]+),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)/);
    if (cityStateZip) {
      city = cityStateZip[1].trim();
      state = cityStateZip[2];
      zip = cityStateZip[3];
    }
  }

  return { firstName, lastName, phone: phoneMatch ? formatPhone(phoneMatch[0]) : "", email: emailMatch ? emailMatch[0] : "", birthdate: dobMatch ? formatDate(dobMatch[1]) : "", age: ageMatch ? ageMatch[1] : "", address, city, state, zip };
}

function LeadCapturePage({ household, updatePerson, updateHousehold, saveIntake, setView }) {
  const [incomingText, setIncomingText] = useState("");
  const [leadSource, setLeadSource] = useState("Email");
  const [captured, setCaptured] = useState(null);

  function captureLead() {
    setCaptured(extractLeadFromMessage(incomingText));
  }

  function applyCapturedToClient() {
    const data = captured || extractLeadFromMessage(incomingText);
    setCaptured(data);
    Object.entries(data).forEach(([field, value]) => {
      if (value && field !== "age") updatePerson("client", field, value);
    });
    updateHousehold("referredBy", leadSource);
    updateHousehold("notes", (household.notes || "") + (household.notes ? "\n\n" : "") + "Incoming " + leadSource + " lead:\n" + incomingText);
    saveIntake();
  }

  function applyCapturedToSpouse() {
    const data = captured || extractLeadFromMessage(incomingText);
    setCaptured(data);
    Object.entries(data).forEach(([field, value]) => {
      if (value && field !== "age") updatePerson("spouse", field, value);
    });
    updateHousehold("notes", (household.notes || "") + (household.notes ? "\n\n" : "") + "Incoming " + leadSource + " spouse/household info:\n" + incomingText);
    saveIntake();
  }

  const preview = captured || extractLeadFromMessage(incomingText);

  return (
    <section style={styles.card}>
      <h2 style={{ marginTop: 0 }}>Lead Capture</h2>
      <p style={{ marginTop: 0 }}>Paste an incoming email, text, or WhatsApp message. SIPS will capture first name, last name, phone, email, birthdate or age, address, and ZIP when available.</p>
      <div style={styles.nav}>
        <button type="button" style={styles.button} onClick={() => setView("dashboard")}>Back to Dashboard</button>
        <button type="button" style={styles.button} onClick={() => setView("admin")}>Go to Admin</button>
        <button type="button" style={styles.button} onClick={() => setView("agent")}>Go to Agent</button>
        <button type="button" style={styles.button} onClick={() => setView("household")}>Go to Household</button>
      </div>
      <div style={styles.grid2}>
        <select style={styles.input} value={leadSource} onChange={(e) => setLeadSource(e.target.value)}>
          <option value="Email">Email</option>
          <option value="Text Message">Text Message</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Website Lead">Website Lead</option>
          <option value="Referral Message">Referral Message</option>
        </select>
        <select style={styles.input} value={household.assignedAgent} onChange={(e) => updateHousehold("assignedAgent", e.target.value)}>
          {AGENTS.map((agent) => <option key={agent.name} value={agent.name}>{agent.name}</option>)}
        </select>
      </div>
      <textarea style={{ ...styles.textarea, marginTop: 12, minHeight: 180 }} value={incomingText} onChange={(e) => setIncomingText(e.target.value)} placeholder="Paste incoming email, text, or WhatsApp message here..." />
      <div style={{ ...styles.nav, marginTop: 12 }}>
        <button type="button" style={styles.primaryButton} onClick={captureLead}>Capture Fields</button>
        <button type="button" style={styles.button} onClick={applyCapturedToClient}>Apply to Client + Save</button>
        <button type="button" style={styles.button} onClick={applyCapturedToSpouse}>Apply to Spouse + Save</button>
      </div>
      <div style={{ ...styles.card, marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Captured Preview</h3>
        <div style={styles.grid3}>
          <input style={styles.input} value={preview.firstName || ""} readOnly placeholder="First Name" />
          <input style={styles.input} value={preview.lastName || ""} readOnly placeholder="Last Name" />
          <input style={styles.input} value={preview.phone || ""} readOnly placeholder="Phone" />
          <input style={styles.input} value={preview.email || ""} readOnly placeholder="Email" />
          <input style={styles.input} value={preview.birthdate || ""} readOnly placeholder="Birthdate" />
          <input style={styles.input} value={preview.birthdate ? calculateAge(preview.birthdate) : preview.age || ""} readOnly placeholder="Age" />
          <input style={styles.input} value={preview.address || ""} readOnly placeholder="Address" />
          <input style={styles.input} value={preview.city || ""} readOnly placeholder="City" />
          <input style={styles.input} value={preview.state || ""} readOnly placeholder="State" />
          <input style={styles.input} value={preview.zip || ""} readOnly placeholder="ZIP" />
        </div>
      </div>
    </section>
  );
}

function TopNav({ view, setView }) {
  const navItems = [
    ["dashboard", "Dashboard"],
    ["admin", "Admin Intake"],
    ["leadCapture", "Lead Capture"],
    ["calendar", "Appointments"],
    ["clients", "Clients"],
    ["today", "Today"],
    ["household", "Household"],
    ["quickRater", "Quick Rater"],
    ["calculator", "Calculator"],
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

  const [household, setHousehold] = useState({ ...blankHousehold, ancillary: { ...blankAncillary }, client: { ...blankPerson }, spouse: { ...blankPerson } });

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentDuration, setAppointmentDuration] = useState("60");
  const [appointmentLocation, setAppointmentLocation] = useState("Phone Call");

  const [emailTemplate, setEmailTemplate] = useState("Plan Review");
  const [selectedAgent, setSelectedAgent] = useState("Admin");
  const [appointmentsAgentFilter, setAppointmentsAgentFilter] = useState("All");
  const [appointmentsTypeFilter, setAppointmentsTypeFilter] = useState("All");
  const [clientsAgentFilter, setClientsAgentFilter] = useState("All");

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
    setHousehold((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "currentCoverage" && value !== "Group") {
        next.groupSize = "";
      }

      if (field === "currentPremium") {
        next.client = {
          ...prev.client,
          currentMedSuppPremium: value,
          currentTotalPremium: value,
        };
      }

      return next;
    });
  }

  function openSipsGoogleCalendar() {
    if (typeof window !== "undefined") {
      window.open(SIPS_GOOGLE_CALENDAR_URL, "_blank", "noopener,noreferrer");
    }
  }

  function openAppointmentsForType(type) {
    updateHousehold("reasonForCall", type);
    setAppointmentsTypeFilter(type || "All");
    setAppointmentsAgentFilter(household.assignedAgent || selectedAgent || "All");
    setView("calendar");
    setMessage(`Appointment view set to ${type || "All"} for ${household.assignedAgent || selectedAgent || "All agents"}.`);
  }

  function getReturnLinks() {
    return "Use the return buttons inside SIPS: Admin, Household, Quick Rater, Agent.";
  }

  function updateAncillary(product, field, value) {
    setHousehold((prev) => ({
      ...prev,
      ancillary: {
        ...(prev.ancillary || blankAncillary),
        [product]: {
          ...blankAncillaryRow,
          ...((prev.ancillary || {})[product] || {}),
          [field]: value,
        },
      },
    }));
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
    setHousehold({ ...blankHousehold, ancillary: { ...blankAncillary }, client: { ...blankPerson }, spouse: { ...blankPerson } });
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
      ancillary: { ...blankAncillary, ...(household.ancillary || {}) },
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
    setMessage("Admin intake saved. Household, Clients, Today, and Appointments can now show this record.");
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
      appointmentType: household.reasonForCall,
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
        `Group Size: ${household.groupSize || "-"}\n` +
        `Notes: ${household.notes || "-"}\n\n` +
        `RETURN LINKS:\n${getReturnLinks()}`,
      returnLinks: getReturnLinks(),
    };

    setEvents((prev) => [event, ...prev]);
    setMessage("Appointment created locally. If your Google Calendar API route is connected, this can also be sent there.");

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
        if (data.success) setMessage("Appointment created and sent to Google Calendar.");
      }
    } catch (error) {
      // Local save remains active when API is not connected.
    }
  }

  function checkAgentStatus(agentName) {
    setSelectedAgent(agentName);
    const dateToCheck = appointmentDate || new Date().toISOString().slice(0, 10);
    const busy = events.some((event) => event.agent === agentName && event.date === dateToCheck);
    alert(`${agentName} status for ${dateToCheck}: ${busy ? "Has saved event(s)" : "No saved events"}`);
  }

  function loadHousehold(item) {
    setHousehold({
      ...blankHousehold,
      ...item,
      ancillary: { ...blankAncillary, ...(item.ancillary || {}) },
      client: { ...blankPerson, ...(item.client || {}) },
      spouse: { ...blankPerson, ...(item.spouse || {}) },
    });
    setSelectedHouseholdId(item.id);
  }

  function renderLeadCapture() {
    return (
      <LeadCapturePage household={household} updatePerson={updatePerson} updateHousehold={updateHousehold} saveIntake={saveIntake} setView={setView} />
    );
  }

  function renderDashboard() {
    return (
      <>
        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Dashboard</h2>
          <p>Use this page to move between Admin Intake, Agent Status, Appointments, Clients, Today, and Household.</p>
          <div style={styles.nav}>
            <button type="button" style={styles.primaryButton} onClick={() => setView("admin")}>Open Admin Intake</button>
            <button type="button" style={styles.button} onClick={() => setView("leadCapture")}>Open Lead Capture</button>
            <select
              style={styles.input}
              value={household.reasonForCall}
              onChange={(e) => updateHousehold("reasonForCall", e.target.value)}
              title="Select appointment type"
            >
              {APPOINTMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            <button type="button" style={styles.button} onClick={() => openAppointmentsForType(household.reasonForCall)}>Open Appointments</button>
            <button type="button" style={styles.button} onClick={openSipsGoogleCalendar}>Open Google Appointments</button>
            <button type="button" style={styles.button} onClick={() => setView("clients")}>Go to Clients</button>
            <button type="button" style={styles.button} onClick={() => setView("household")}>Go to Household</button>
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
                  <button type="button" style={styles.button} onClick={() => checkAgentStatus(agent.name)}>Check Status</button>
                  <button type="button" style={styles.button} onClick={() => { setSelectedAgent(agent.name); setView("agent"); }}>Go to Agent Page</button>
                  <select
              style={styles.input}
              value={household.reasonForCall}
              onChange={(e) => updateHousehold("reasonForCall", e.target.value)}
              title="Select appointment type"
            >
              {APPOINTMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            <button type="button" style={styles.button} onClick={() => openAppointmentsForType(household.reasonForCall)}>Open Appointments</button>
            <button type="button" style={styles.button} onClick={openSipsGoogleCalendar}>Open Google Appointments</button>
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
            <button type="button" style={styles.button} onClick={() => setView("dashboard")}>Back to Dashboard</button>
            <select
              style={styles.input}
              value={household.reasonForCall}
              onChange={(e) => updateHousehold("reasonForCall", e.target.value)}
              title="Select appointment type"
            >
              {APPOINTMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            <button type="button" style={styles.button} onClick={() => openAppointmentsForType(household.reasonForCall)}>Open Appointments</button>
            <button type="button" style={styles.button} onClick={openSipsGoogleCalendar}>Open Google Appointments</button>
            <button type="button" style={styles.button} onClick={() => setView("household")}>Go to Household</button>
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
            <select style={styles.input} value={household.currentCoverage} onChange={(e) => updateHousehold("currentCoverage", e.target.value)}>
              <option value="">Current Coverage</option>
              {COVERAGE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            {household.currentCoverage === "Group" ? (
              <select style={styles.input} value={household.groupSize} onChange={(e) => updateHousehold("groupSize", e.target.value)}>
                <option value="">Group Size</option>
                {GROUP_SIZE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            ) : null}
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
          <div style={{ marginBottom: 12 }}>
            <select style={styles.input} value={household.reasonForCall} onChange={(e) => updateHousehold("reasonForCall", e.target.value)}>
              {APPOINTMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
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
            <button type="button" style={styles.button} onClick={() => checkAgentStatus(household.assignedAgent)}>Check Agent Status</button>
            <button type="button" style={styles.button} onClick={createCalendarEvent}>Create Appointment</button>
            <button type="button" style={styles.button} onClick={() => setView("calendar")}>Open Appointments</button>
          </div>
        </section>

        <IntegrationAutofillPanel household={household} />

        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Email Template Option</h2>
          <select style={styles.input} value={emailTemplate} onChange={(e) => setEmailTemplate(e.target.value)}>
            {Object.keys(EMAIL_TEMPLATES).map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
          <textarea style={{ ...styles.textarea, marginTop: 12 }} value={EMAIL_TEMPLATES[emailTemplate]} readOnly />
          <div style={{ ...styles.nav, marginTop: 12 }}>
            <button type="button" style={styles.button} onClick={() => navigator.clipboard?.writeText(EMAIL_TEMPLATES[emailTemplate])}>Copy Email Template</button>
            <button
              type="button"
              style={styles.button}
              onClick={() => {
                const to = household.client.email || "";
                const subject = encodeURIComponent(`Senior Care Plus - ${emailTemplate}`);
                const body = encodeURIComponent(EMAIL_TEMPLATES[emailTemplate]);
                window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
              }}
            >
              Open Email Draft
            </button>
          </div>

          <div style={{ marginTop: 16 }}>
            <strong>Attachable Forms / Documents Needed</strong>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 8, marginTop: 10 }}>
              {ATTACHABLE_FORMS.map((formName) => (
                <label key={formName} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={(household.client.forms || "").split(", ").filter(Boolean).includes(formName)}
                    onChange={(e) => {
                      const current = (household.client.forms || "").split(", ").filter(Boolean);
                      const next = e.target.checked ? [...current, formName] : current.filter((item) => item !== formName);
                      updatePerson("client", "forms", next.join(", "));
                    }}
                  />
                  {formName}
                </label>
              ))}
            </div>
            <p style={{ marginBottom: 0 }}>Selected: {household.client.forms || "None"}</p>
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.nav}>
            <button type="button" style={styles.primaryButton} onClick={saveIntake}>Save Admin Intake</button>
            <button type="button" style={styles.button} onClick={resetIntake}>Clear Intake</button>
            <button type="button" style={styles.button} onClick={() => setView("dashboard")}>Back to Dashboard</button>
          </div>
          {message ? <p><strong>{message}</strong></p> : null}
        </section>
      </>
    );
  }

  function renderCalendar() {
    const filteredEvents = events.filter((event) => {
      const agentMatch = appointmentsAgentFilter === "All" || event.agent === appointmentsAgentFilter;
      const typeMatch = appointmentsTypeFilter === "All" || event.appointmentType === appointmentsTypeFilter;
      return agentMatch && typeMatch;
    });

    return (
      <section style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Appointments</h2>

        <div style={styles.grid3}>
          <div>
            <label style={{ fontWeight: 700 }}>View Agent</label>
            <select
              style={{ ...styles.input, marginTop: 6 }}
              value={appointmentsAgentFilter}
              onChange={(e) => setAppointmentsAgentFilter(e.target.value)}
            >
              <option value="All">All Agents</option>
              {AGENTS.map((agent) => <option key={agent.name} value={agent.name}>{agent.name}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 700 }}>Appointment Type / Service</label>
            <select
              style={{ ...styles.input, marginTop: 6 }}
              value={appointmentsTypeFilter}
              onChange={(e) => {
                setAppointmentsTypeFilter(e.target.value);
                if (e.target.value !== "All") updateHousehold("reasonForCall", e.target.value);
              }}
            >
              <option value="All">All Appointment Types</option>
              {APPOINTMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 700 }}>Set New Appointment Type</label>
            <select
              style={{ ...styles.input, marginTop: 6 }}
              value={household.reasonForCall}
              onChange={(e) => updateHousehold("reasonForCall", e.target.value)}
            >
              {APPOINTMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>

        <div style={{ ...styles.nav, marginTop: 12 }}>
          <button type="button" style={styles.button} onClick={() => setView("admin")}>Return to Admin</button>
          <button type="button" style={styles.button} onClick={() => setView("household")}>Return to Household</button>
          <button type="button" style={styles.button} onClick={() => setView("quickRater")}>Return to Quick Rater</button>
          <button type="button" style={styles.button} onClick={() => setView("agent")}>Return to Agent</button>
          <button type="button" style={styles.button} onClick={openSipsGoogleCalendar}>Open sips4agents@gmail.com Appointments</button>
        </div>

        {filteredEvents.length === 0 ? <p>No saved appointments match this view.</p> : null}
        {filteredEvents.map((event) => (
          <div key={event.id} style={{ border: "1px solid #d6dde8", borderRadius: 12, padding: 14, marginTop: 10 }}>
            <strong>{event.title}</strong>
            <p>{event.date} at {event.time} · {event.location}</p>
            <p>Agent: {event.agent}</p>
            <p>Type: {event.appointmentType || "-"}</p>
            <div style={styles.nav}>
              <button type="button" style={styles.button} onClick={() => setView("admin")}>Return to Admin</button>
              <button type="button" style={styles.button} onClick={() => { const match = households.find((h) => h.id === event.householdId); if (match) loadHousehold(match); setView("household"); }}>Return to Household</button>
              <button type="button" style={styles.button} onClick={() => setView("quickRater")}>Return to Quick Rater</button>
              <button type="button" style={styles.button} onClick={() => { setSelectedAgent(event.agent || selectedAgent); setView("agent"); }}>Return to Agent</button>
            </div>
          </div>
        ))}
      </section>
    );
  }

  function renderClients() {
    const filteredHouseholds = households.filter((item) => {
      return clientsAgentFilter === "All" || item.assignedAgent === clientsAgentFilter;
    });

    return (
      <section style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Clients</h2>

        <div style={{ ...styles.grid2, marginBottom: 12 }}>
          <div>
            <label style={{ fontWeight: 700 }}>View Clients</label>
            <select
              style={{ ...styles.input, marginTop: 6 }}
              value={clientsAgentFilter}
              onChange={(e) => setClientsAgentFilter(e.target.value)}
            >
              <option value="All">All Agents</option>
              {AGENTS.map((agent) => <option key={agent.name} value={agent.name}>{agent.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 700 }}>Appointment Type Parameter</label>
            <select
              style={{ ...styles.input, marginTop: 6 }}
              value={household.reasonForCall}
              onChange={(e) => updateHousehold("reasonForCall", e.target.value)}
            >
              {APPOINTMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>

        {filteredHouseholds.length === 0 ? <p>No clients saved for this view.</p> : null}
        {filteredHouseholds.map((item) => (
          <div key={item.id} style={{ border: "1px solid #d6dde8", borderRadius: 12, padding: 14, marginTop: 10 }}>
            <strong>{fullName(item.client)}</strong>
            <p>{item.client.phone || "No phone"} · {item.client.email || "No email"}</p>
            <p>{item.client.address || "No address"} {item.client.city || ""} {item.client.state || ""} {item.client.zip || ""}</p>
            <p>Assigned Agent: {item.assignedAgent || "-"}</p>
            <div style={styles.nav}>
              <button type="button" style={styles.button} onClick={() => { loadHousehold(item); setView("household"); }}>Open Household</button>
              <button type="button" style={styles.button} onClick={() => { loadHousehold(item); setSelectedAgent(item.assignedAgent || selectedAgent); setView("agent"); }}>Open Agent Page</button>
              <button type="button" style={styles.button} onClick={() => { loadHousehold(item); setAppointmentsAgentFilter(item.assignedAgent || "All"); setAppointmentsTypeFilter(item.reasonForCall || "All"); setView("calendar"); }}>View Appointments</button>
            </div>
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
    const item = household;
    return (
      <section style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Household Snapshot</h2>
        <div style={styles.nav}>
          <button type="button" style={styles.button} onClick={() => setView("dashboard")}>Back to Dashboard</button>
          <button type="button" style={styles.button} onClick={() => setView("admin")}>Back to Admin</button>
          <select
              style={styles.input}
              value={household.reasonForCall}
              onChange={(e) => updateHousehold("reasonForCall", e.target.value)}
              title="Select appointment type"
            >
              {APPOINTMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            <button type="button" style={styles.button} onClick={() => openAppointmentsForType(household.reasonForCall)}>Open Appointments</button>
            <button type="button" style={styles.button} onClick={openSipsGoogleCalendar}>Open Google Appointments</button>
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


        <div style={{ ...styles.card, marginTop: 16 }}>
          <h3 style={{ marginTop: 0 }}>Live Phone Call Update Fields</h3>
          <p style={{ marginTop: 0 }}>Use this section while the client is on the phone. Changes stay live and can be saved back to the household list.</p>
          <PersonForm title="Client Update" type="client" person={household.client} updatePerson={updatePerson} />
          <PersonForm title="Spouse Update" type="spouse" person={household.spouse} updatePerson={updatePerson} />

          <div style={styles.grid2}>
            <select style={styles.input} value={household.status} onChange={(e) => updateHousehold("status", e.target.value)}>
              <option value="New">New</option>
              <option value="Needs Review">Needs Review</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
            </select>
            <select style={styles.input} value={household.assignedAgent} onChange={(e) => updateHousehold("assignedAgent", e.target.value)}>
              {AGENTS.map((agent) => <option key={agent.name} value={agent.name}>{agent.name}</option>)}
            </select>
          </div>
          <div style={{ ...styles.grid2, marginTop: 12 }}>
            <select style={styles.input} value={household.currentCoverage} onChange={(e) => updateHousehold("currentCoverage", e.target.value)}>
              <option value="">Current Coverage</option>
              {COVERAGE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            {household.currentCoverage === "Group" ? (
              <select style={styles.input} value={household.groupSize} onChange={(e) => updateHousehold("groupSize", e.target.value)}>
                <option value="">Group Size</option>
                {GROUP_SIZE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            ) : null}
            <input style={styles.input} value={household.currentPremium} onChange={(e) => updateHousehold("currentPremium", e.target.value)} placeholder="Current Premium" />
          </div>
          <textarea style={{ ...styles.textarea, marginTop: 12 }} value={household.notes} onChange={(e) => updateHousehold("notes", e.target.value)} placeholder="Phone call notes / additional information" />
          <div style={{ ...styles.nav, marginTop: 12 }}>
            <button type="button" style={styles.primaryButton} onClick={saveIntake}>Save Household Updates</button>
            <select
              style={styles.input}
              value={household.reasonForCall}
              onChange={(e) => updateHousehold("reasonForCall", e.target.value)}
              title="Select appointment type"
            >
              {APPOINTMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            <button type="button" style={styles.button} onClick={() => openAppointmentsForType(household.reasonForCall)}>Open Appointments</button>
            <button type="button" style={styles.button} onClick={openSipsGoogleCalendar}>Open Google Appointments</button>
            <button type="button" style={styles.button} onClick={() => setView("agent")}>Go to Agent</button>
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


  function renderQuickRater() {
    return (
      <QuickRaterPage
        household={household}
        updatePerson={updatePerson}
        updateAncillary={updateAncillary}
        setView={setView}
        saveIntake={saveIntake}
      />
    );
  }

  function renderCalculator() {
    return (
      <CalculatorPage
        household={household}
        updatePerson={updatePerson}
        updateAncillary={updateAncillary}
        setView={setView}
        saveIntake={saveIntake}
      />
    );
  }

  function renderAgentPage() {
    const agentEvents = events.filter((event) => event.agent === selectedAgent);
    const agentHouseholds = households.filter((item) => item.assignedAgent === selectedAgent);

    return (
      <>
        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Agent Page</h2>
          <div style={styles.nav}>
            <button type="button" style={styles.button} onClick={() => setView("dashboard")}>Back to Dashboard</button>
            <button type="button" style={styles.button} onClick={() => setView("admin")}>Back to Admin</button>
            <button type="button" style={styles.button} onClick={() => setView("quickRater")}>Go to Quick Rater</button>
            <button type="button" style={styles.button} onClick={() => setView("calculator")}>Go to Calculator</button>
            <select
              style={styles.input}
              value={household.reasonForCall}
              onChange={(e) => updateHousehold("reasonForCall", e.target.value)}
              title="Select appointment type"
            >
              {APPOINTMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            <button type="button" style={styles.button} onClick={() => openAppointmentsForType(household.reasonForCall)}>Open Appointments</button>
            <button type="button" style={styles.button} onClick={openSipsGoogleCalendar}>Open Google Appointments</button>
          </div>

          <div style={styles.grid2}>
            <select style={styles.input} value={selectedAgent} onChange={(e) => { setSelectedAgent(e.target.value); updateHousehold("assignedAgent", e.target.value); }}>
              {AGENTS.map((agent) => <option key={agent.name} value={agent.name}>{agent.name}</option>)}
            </select>
            <button type="button" style={styles.button} onClick={() => checkAgentStatus(selectedAgent)}>Check This Agent Status</button>
          </div>
        </section>

        <IntegrationAutofillPanel household={household} />

        <FactFinderQuoter
          household={household}
          updatePerson={updatePerson}
          updateHousehold={updateHousehold}
          updateAncillary={updateAncillary}
          saveIntake={saveIntake}
          createCalendarEvent={createCalendarEvent}
          setView={setView}
        />

        <section style={styles.card}>
          <h3 style={{ marginTop: 0 }}>{selectedAgent} Appointments</h3>
          {agentEvents.length === 0 ? <p>No saved events for this agent yet.</p> : null}
          {agentEvents.map((event) => (
            <div key={event.id} style={{ border: "1px solid #d6dde8", borderRadius: 12, padding: 14, marginTop: 10 }}>
              <strong>{event.title}</strong>
              <p>{event.date} at {event.time} · {event.location}</p>
            </div>
          ))}
        </section>

        <section style={styles.card}>
          <h3 style={{ marginTop: 0 }}>{selectedAgent} Households</h3>
          {agentHouseholds.length === 0 ? <p>No households assigned to this agent yet.</p> : null}
          {agentHouseholds.map((item) => (
            <div key={item.id} style={{ border: "1px solid #d6dde8", borderRadius: 12, padding: 14, marginTop: 10 }}>
              <strong>{fullName(item.client)}</strong>
              <p>{item.client.phone || "No phone"} · {item.status || "No status"}</p>
              <button type="button" style={styles.button} onClick={() => { loadHousehold(item); setView("household"); }}>Open Household</button>
            </div>
          ))}
        </section>
      </>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <h1 style={{ margin: 0 }}>SIPS Connect</h1>
          <p style={{ marginBottom: 0 }}>Dashboard, Admin Intake, Agent Status, Appointments, Clients, Today, and Household in one file.</p>
        </header>

        <TopNav view={view} setView={setView} />

        {view === "dashboard" && renderDashboard()}
        {view === "admin" && renderAdmin()}
        {view === "leadCapture" && renderLeadCapture()}
        {view === "calendar" && renderCalendar()}
        {view === "clients" && renderClients()}
        {view === "today" && renderToday()}
        {view === "household" && renderHousehold()}
        {view === "agent" && renderAgentPage()}
        {view === "quickRater" && renderQuickRater()}
        {view === "calculator" && renderCalculator()}
      </div>
    </main>
  );
}
