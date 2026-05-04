"use client";

// COMPLETE SIPS DASHBOARD BUILD
// Paste this entire file into your Next.js app/page.jsx or app/page.js.
// Do not import it as a module into another component unless you import the default export.
// This file is already a Client Component and exports one default React page component.

import { useMemo, useState } from "react";

const AGENTS = [
  { name: "Admin", initials: "ADMIN", color: "Purple" },
  { name: "Loyd Richardson", initials: "LR", color: "Green" },
  { name: "Blake Richardson", initials: "BR", color: "Orange" },
  { name: "William Sykes", initials: "WS", color: "Blue" },
  { name: "Jimmie Bassett", initials: "JB", color: "Red" },
  { name: "Christiana Grant", initials: "CG", color: "Purple" },
];

const BUSINESS_STATUS_OPTIONS = [
  "New",
  "Written Business",
  "Pending Business",
  "Issued Business",
  "Declined Business",
  "Rate Increase Call",
  "Needs Review",
  "Scheduled",
  "In Progress",
  "Complete",
];

const PIPELINE_STATUS_OPTIONS = [
  "Written Business",
  "Pending Business",
  "Issued Business",
  "Declined Business",
];

const RATE_INCREASE_CALL_STATUSES = [
  "Not Called",
  "Left Message",
  "Spoke With Client",
  "Appointment Set",
  "No Answer",
  "Do Not Call",
  "Completed",
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


const CALENDAR_VIEW_OPTIONS = [
  "Day View",
  "Week View",
  "Month View",
  "Agent View",
  "All Agents View",
  "Open Slots View",
  "Appointment Type View",
];
const APPOINTMENT_TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
];

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
  "Plan Review": `Hi {{clientFirstName}},

This is Senior Care Plus. We noticed your current premium is {{currentPremium}} and would like to schedule a quick plan review to make sure your coverage is still the best fit.

Appointment: {{appointmentDate}} at {{appointmentTime}}
Assigned Agent: {{assignedAgent}}

Please have your Medicare card, current policy, premium notice, medication list, and doctor list available.

Regards,
{{agentSignature}}`,

  "Claims Follow Up": `Hi {{clientFirstName}},

This is Senior Care Plus following up on your claims issue.

Please send any EOBs, unpaid claim notices, provider contact information, date of service, and claim amount so we can assist.

Client: {{clientFullName}}
Phone: {{clientPhone}}
Assigned Agent: {{assignedAgent}}

Regards,
{{agentSignature}}`,

  "Appointment Reminder": `Hi {{clientFirstName}},

This is Senior Care Plus reminding you of your upcoming appointment.

Appointment: {{appointmentDate}} at {{appointmentTime}}
Location/Type: {{appointmentLocation}}
Assigned Agent: {{assignedAgent}}

Please have your Medicare card, current insurance information, medications, doctor list, and any requested forms available.

Regards,
{{agentSignature}}`,

  "L564 Employer Form": `To avoid Medicare Part B enrollment penalties, please have your current employer admin or HR complete the CMS L564 form.

✅ Step 1 — Download the Form
➡️ CMS L564 — Request for Employment Information

Click the link below and download the CMS L564 form (PDF). This is the official form:

Download CMS L564 Form

Please forward this email to your HR department. They will complete the form with the necessary information and return the signed document to you.

Once you receive the completed form:
1. If my team is helping you enroll in Part B, email the completed, signed L564 to sales@ainsurancepro.com
2. If you are enrolling yourself or have enrolled already, please follow the instructions on the L564 form.

Client: {{clientFullName}}
Phone: {{clientPhone}}
Email: {{clientEmail}}

If you require any further assistance, please don't hesitate to reach out. Our entire team is fully qualified to help, and Christiana will ensure that someone gets back to you promptly.

Thank you, and we look forward to assisting you with this process.

Regards,
Loyd Richardson
Senior Care Plus / Associated Insurance Professionals
Office Address: 3 Country Place, Pearl, MS 39208
Phone: 601-962-4428
Email: sales@ainsurancepro.com
Visit us: www.ainsurancepro.com

________________________________________
We are not affiliated with or endorsed by Medicare, the federal government, or the Social Security Administration. We do not offer every plan available in your area. For all available options, please visit Medicare.gov or call 1-800-MEDICARE (1-800-633-4227).`,

  "Policy Review Documents": `Hi {{clientFirstName}},

To complete your policy review, please send the following:

- Current policy
- Current premium notice
- Prescription list
- Doctor/provider list
- Medicare card

Current Premium on file: {{currentPremium}}
Spouse: {{spouseFullName}}
Spouse Health Notes: {{spouseHealth}}

You can reply directly to this email with the documents.

Regards,
{{agentSignature}}`,

  "Prescription Drug Plan Review": `Hi {{clientFirstName}},

We would like to review your prescription drug coverage.

Please send:
- Medication list
- Preferred pharmacy
- Medicare card

Appointment: {{appointmentDate}} at {{appointmentTime}}
Assigned Agent: {{assignedAgent}}

Regards,
{{agentSignature}}`,

  "New Client Intake Follow Up": `Hi {{clientFirstName}},

Thank you for speaking with Senior Care Plus.

Next steps:
- Confirm your appointment: {{appointmentDate}} at {{appointmentTime}}
- Send any requested documents/forms
- Have your Medicare card, current insurance information, medication list, and doctor list ready

Assigned Agent: {{assignedAgent}}
Reason for Call: {{reasonForCall}}

Regards,
{{agentSignature}}`,
};

const EMAIL_TEMPLATE_SUBJECTS = {
  "Plan Review": "Medicare Plan Review",
  "Claims Follow Up": "Claims Assistance Follow Up",
  "Appointment Reminder": "Appointment Reminder from Senior Care Plus",
  "L564 Employer Form": "Download the CMS L564 Form for Requesting Employment Information",
  "Policy Review Documents": "Documents Needed for Your Policy Review",
  "Prescription Drug Plan Review": "Prescription Drug Plan Review",
  "New Client Intake Follow Up": "Next Steps from Senior Care Plus",
};

const EMAIL_TEMPLATE_DEFAULT_FORMS = {
  "L564 Employer Form": ["CMS-L564 Employer Coverage Form"],
  "Policy Review Documents": ["Current Policy / Premium Notice", "Prescription Drug List", "Provider List"],
  "Appointment Reminder": ["Current Policy / Premium Notice", "Prescription Drug List", "Provider List"],
  "Prescription Drug Plan Review": ["Prescription Drug List"],
  "Claims Follow Up": ["Claims / EOB Documents"],
};

const COVERAGE_OPTIONS = ["Medicare", "Group", "Individual Health", "Cobra"];
const GROUP_SIZE_OPTIONS = ["20 or more employees", "Less than 20 employees"];
const PROPOSED_PREMIUM_SOURCES = ["Manual input", "Get premium from CSG rater"];
const SIPS_GOOGLE_CALENDAR_URL = "https://calendar.google.com/calendar/u/0/r/day";
const CSG_AGENCY_URL = "https://www.freemedicarereport.com/comparison_form/ainsurancepro.com";
const COMPANY_LOGIN_LINKS = [
  { name: "Aflac", url: "http://www.sellaflacseniorplans.com/" },
  { name: "Aetna", url: "https://www.aetnaseniorproducts.com/ssibrokerwebsecure/broker/login.fcc?TYPE=33554433&REALMOID=06-7d4c82fa-fe06-4e4e-8597-d8f8b68da960&GUID=&SMAUTHREASON=0&METHOD=GET&SMAGENTNAME=-SM-s7pFJAUCnH5Qp3pzu1lx8MibbZnWT%2b01G%2f6iCkHVxMsS0hd%2fsbmjhWe16MOGqvFRrS17O3IrRUBJqyBYHEvE5IyHDS9KZnck&TARGET=-SM-HTTPS%3a%2f%2fwww%2eaetnaseniorproducts%2ecom%2fssibrokerwebsecure%2fbroker%2fhome%2ehtml" },
  { name: "INA / ACE", url: "https://www.chubb.com/microsites/ina-medicare-supplement.html" },
  { name: "Allstate", url: "https://login.ngahagents.ngic.com/Account/Login" },
  { name: "AARP / UHC", url: "https://www.uhcjarvis.com/content/jarvis/en/sign_in.html#/sign_in" },
  { name: "Bankers Fidelity", url: "https://agent.bflic.com/Login/Login?ReturnUrl=%2fMasterMenu%2fLogout&logout=logout" },
  { name: "Cigna", url: "https://university.healthspringforbrokers.com/Portal/Login" },
  { name: "United American", url: "NO_LINK" },
  { name: "Humana", url: "https://account.humana.com/" },
  { name: "Mutual of Omaha", url: "https://accounts.mutualofomaha.com/" },
  { name: "Med Mutual", url: "https://service.iasadmin.com/agentportal?cc=c220" },
  { name: "WoodmenLife", url: "https://accounts.mutualofomaha.com/" },
];
const CSG_COMPANY_OPTIONS = [
  "AARP / UnitedHealthcare",
  "Aetna",
  "Aflac",
  "Allstate / National General",
  "American Continental",
  "Bankers Fidelity",
  "Blue Cross Blue Shield",
  "Cigna",
  "Continental Life",
  "Globe Life",
  "Humana",
  "Liberty Bankers",
  "ManhattanLife",
  "Medico",
  "Mutual of Omaha",
  "Prosperity Life",
  "Transamerica",
  "United American",
  "Wellabe",
  "WoodmenLife",
];

const HOUSEHOLD_DISCOUNT_OPTIONS = [
  { label: "No household discount", value: "0" },
  { label: "5% household discount", value: "5" },
  { label: "7% household discount", value: "7" },
  { label: "10% household discount", value: "10" },
  { label: "12% household discount", value: "12" },
];

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
  csgSelectedCompany: "",
  csgSelectedBaseRate: "",
  csgHouseholdDiscountPercent: "0",
  csgRate1Company: "",
  csgRate1: "",
  csgRate2Company: "",
  csgRate2: "",
  csgRate3Company: "",
  csgRate3: "",
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
  businessStatus: "New",
  applicationDate: "",
  carrier: "",
  policyNumber: "",
  rateIncreaseDate: "",
  rateIncreaseAmount: "",
  callStatus: "Not Called",
  lastCallDate: "",
  nextCallDate: "",
  sheetRowId: "",
  referredBy: "",
  currentCoverage: "",
  groupSize: "",
  currentPremium: "",
  medicareProStatus: "Not started",
  medicareProClientId: "",
  medicareProAgentAccess: "",
  clientAgentNotes: "",
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
    padding: "14px 16px",
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
    padding: 12,
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
    padding: "8px 9px",
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
  pipelineBadge: { display: "inline-block", padding: "6px 10px", borderRadius: 999, background: "#f8fafc", border: "1px solid #cbd5e1", fontSize: 12, fontWeight: 800, marginRight: 6, marginBottom: 6 },
  statusPill: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    background: "#eef6ff",
    border: "1px solid #b9d7ff",
    fontSize: 13,
    fontWeight: 700,
  },
  layout: { minHeight: "100vh", display: "flex", background: "#f4f7fb", fontFamily: "Arial, sans-serif", color: "#111827" },
  sidebar: { width: 190, flexShrink: 0, background: "#0f2a44", color: "white", padding: 10, display: "flex", flexDirection: "column", gap: 5, position: "sticky", top: 0, height: "100vh", overflowY: "auto", boxSizing: "border-box" },
  sidebarTitle: { fontSize: 16, fontWeight: 800, marginBottom: 2 },
  sidebarSub: { fontSize: 11, opacity: 0.8, marginBottom: 6, lineHeight: 1.25 },
  sideButton: { width: "100%", border: "1px solid rgba(255,255,255,.14)", borderRadius: 8, padding: "7px 8px", background: "rgba(255,255,255,.06)", color: "white", cursor: "pointer", fontWeight: 750, textAlign: "left", fontSize: 12 },
  sideButtonActive: { width: "100%", border: "1px solid #93c5fd", borderRadius: 8, padding: "7px 8px", background: "#1d4ed8", color: "white", cursor: "pointer", fontWeight: 800, textAlign: "left", boxShadow: "0 4px 10px rgba(0,0,0,.16)", fontSize: 12 },
  mainPanel: { flex: 1, minWidth: 0, padding: 14, overflowY: "auto" },
};


const NAV_ITEMS = [
  ["dashboard", "Dashboard"],
  ["admin", "Admin Hub"],
  ["initialIntake", "Initial Intake"],
  ["leadCapture", "Lead Capture"],
  ["calendar", "Calendar / Availability"],
  ["clients", "Clients"],
  ["currentClients", "Current Clients"],
  ["dailyTasks", "Daily Tasks"],
  ["performance", "Performance"],
  ["status", "Status Pipeline"],
  ["today", "Today"],
  ["household", "Household"],
  ["agent", "Agent"],
  ["quickRater", "Quick Rater"],
  ["calculator", "Calculator"],
  ["integrations", "Integrations / Export"],
  ["permissions", "Agent Permissions"],
];

const ADMIN_ONLY_VIEWS = new Set(["admin", "initialIntake", "leadCapture", "clients", "currentClients", "dailyTasks", "performance", "status", "integrations", "permissions"]);

const ROLE_ACCESS = {
  Agent: new Set(["calendar", "today", "household", "agent", "quickRater", "calculator"]),

  "Office Manager": new Set([
    "dashboard",
    "admin",
    "initialIntake",
    "leadCapture",
    "calendar",
    "clients",
    "currentClients",
    "dailyTasks",
    "status",
    "today",
    "household",
    "integrations",
    "agent",
    "quickRater",
    "calculator",
  ]),

  "Senior Agent": new Set(NAV_ITEMS.map(([key]) => key)),
  Admin: new Set(NAV_ITEMS.map(([key]) => key)),
};

function visibleNavItemsForRole(activeUserRole) {
  return NAV_ITEMS.filter(([key]) => ROLE_ACCESS[activeUserRole]?.has(key));
}

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


function csgGenderFromSex(sex) {
  const value = String(sex || "").toLowerCase();
  if (value.startsWith("m")) return "Male";
  if (value.startsWith("f")) return "Female";
  return "";
}

function csgTobaccoFromInput(tobacco) {
  const value = String(tobacco || "").toLowerCase();
  if (value === "yes" || value.includes("tobacco")) return "Tobacco user";
  if (value === "no" || value.includes("non") || value.includes("none")) return "No tobacco use";
  return "";
}

function buildCsgRaterUrl(person) {
  const age = calculateAge(person.birthdate) || person.age || "";
  const params = new URLSearchParams();

  if (person.zip) {
    params.set("zip", person.zip);
    params.set("zipcode", person.zip);
    params.set("zip_code", person.zip);
  }

  if (age) params.set("age", age);

  const gender = csgGenderFromSex(person.sex);
  if (gender) {
    params.set("gender", gender);
    params.set("sex", gender);
  }

  const tobacco = csgTobaccoFromInput(person.tobacco);
  if (tobacco) {
    params.set("tobacco", tobacco);
    params.set("tobacco_use", tobacco);
  }

  const query = params.toString();
  return query ? `${CSG_AGENCY_URL}?${query}` : CSG_AGENCY_URL;
}

function copyCsgRequiredFields(person, label) {
  const data = {
    applicant: label,
    first_name: person.firstName || "",
    last_name: person.lastName || "",
    zip_code: person.zip || "",
    age: calculateAge(person.birthdate) || person.age || "",
    tobacco_use: csgTobaccoFromInput(person.tobacco),
    gender: csgGenderFromSex(person.sex),
  };

  navigator.clipboard?.writeText(JSON.stringify(data, null, 2));
  return data;
}

function openCsgRaterForPerson(person, label) {
  copyCsgRequiredFields(person, label);
  if (typeof window !== "undefined") {
    window.open(buildCsgRaterUrl(person), "_blank", "noopener,noreferrer");
  }
}

function fullName(person) {
  return `${person.firstName || ""} ${person.lastName || ""}`.trim() || "Client";
}

function buildAgentSignature(agentName) {
  const name = agentName && agentName !== "Admin" ? agentName : "Loyd Richardson";
  return `${name}
Senior Care Plus / Associated Insurance Professionals
Office Address: 3 Country Place, Pearl, MS 39208
Phone: 601-962-4428
Email: sales@ainsurancepro.com
www.ainsurancepro.com`;
}

function buildTemplateVariables(household, appointmentDate, appointmentTime, appointmentLocation) {
  const client = household.client || {};
  const spouse = household.spouse || {};
  return {
    clientFirstName: client.firstName || "",
    clientFullName: fullName(client),
    clientPhone: client.phone || "",
    clientEmail: client.email || "",
    spouseFullName: personHasData(spouse) ? fullName(spouse) : "None listed",
    spouseHealth: spouse.health || "None listed",
    currentPremium: household.currentPremium || client.currentMedSuppPremium || "Not listed",
    assignedAgent: household.assignedAgent || "Admin",
    appointmentDate: appointmentDate || "To be scheduled",
    appointmentTime: appointmentTime || "To be scheduled",
    appointmentLocation: appointmentLocation || "Phone Call",
    reasonForCall: household.reasonForCall || "Service",
    agentSignature: buildAgentSignature(household.assignedAgent),
  };
}

function renderEmailTemplate(templateName, household, appointmentDate, appointmentTime, appointmentLocation) {
  const template = EMAIL_TEMPLATES[templateName] || "";
  const variables = buildTemplateVariables(household, appointmentDate, appointmentTime, appointmentLocation);
  return template.replace(/{{(.*?)}}/g, (_, key) => variables[key.trim()] ?? "");
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

function getCsgRateRows(person) {
  return [
    { rank: 1, company: person.csgRate1Company || "", rate: person.csgRate1 || "" },
    { rank: 2, company: person.csgRate2Company || "", rate: person.csgRate2 || "" },
    { rank: 3, company: person.csgRate3Company || "", rate: person.csgRate3 || "" },
  ];
}

function getTopCsgRates(person) {
  return getCsgRateRows(person)
    .filter((row) => row.company && moneyValue(row.rate) > 0)
    .sort((a, b) => moneyValue(a.rate) - moneyValue(b.rate))
    .slice(0, 3);
}

function applyHouseholdDiscount(rate, discountPercent) {
  const base = moneyValue(rate);
  const percent = moneyValue(discountPercent);
  if (base <= 0) return 0;
  if (percent <= 0) return base;
  return base * (1 - percent / 100);
}

function getEffectiveProposed(person) {
  const override = moneyValue(person.manualOverrideProposedRate);
  if (override > 0) return override;

  if (person.proposedPremiumSource === "Get premium from CSG rater") {
    const selectedRate = moneyValue(person.csgSelectedBaseRate);
    const typedRate = moneyValue(person.csgProposedPremium);
    const baseCsgRate = selectedRate > 0 ? selectedRate : typedRate;
    const discountedRate = applyHouseholdDiscount(baseCsgRate, person.csgHouseholdDiscountPercent);
    if (discountedRate > 0) return discountedRate;
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
        <h3 style={{ marginTop: 0 }}>Premium Snapshot</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
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
          <button type="button" style={styles.button} onClick={() => openCsgRaterForPerson(household.client, "Client")}>Open CSG - Client</button>
          <button type="button" style={styles.button} onClick={() => openCsgRaterForPerson(household.spouse, "Spouse")}>Open CSG - Spouse</button>
          <button type="button" style={styles.button} onClick={createCalendarEvent}>Create Appointment</button>
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
    const topCsgRates = getTopCsgRates(person);

    function selectCsgCompany(companyName) {
      const selectedRow = getCsgRateRows(person).find((row) => row.company === companyName);
      const baseRate = selectedRow?.rate || "";
      const discountedRate = applyHouseholdDiscount(baseRate, person.csgHouseholdDiscountPercent);

      updatePerson(type, "csgSelectedCompany", companyName);
      updatePerson(type, "proposedCarrier", companyName);
      updatePerson(type, "csgSelectedBaseRate", baseRate);
      updatePerson(type, "csgProposedPremium", discountedRate ? discountedRate.toFixed(2) : baseRate);
      updatePerson(type, "proposedPremiumSource", "Get premium from CSG rater");
    }

    function updateCsgDiscount(percent) {
      const baseRate = moneyValue(person.csgSelectedBaseRate || person.csgProposedPremium);
      const discountedRate = applyHouseholdDiscount(baseRate, percent);

      updatePerson(type, "csgHouseholdDiscountPercent", percent);
      if (baseRate > 0) {
        updatePerson(type, "csgProposedPremium", discountedRate.toFixed(2));
      }
    }

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
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
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
                    <div style={{ marginTop: 8, display: "grid", gap: 10 }}>
                      <div style={styles.grid2}>
                        <select
                          style={styles.input}
                          value={person.csgRate1Company}
                          onChange={(e) => updatePerson(type, "csgRate1Company", e.target.value)}
                        >
                          <option value="">CSG company #1</option>
                          {CSG_COMPANY_OPTIONS.map((company) => <option key={company} value={company}>{company}</option>)}
                        </select>
                        <input
                          style={styles.input}
                          value={person.csgRate1}
                          onChange={(e) => updatePerson(type, "csgRate1", e.target.value)}
                          placeholder="Rate #1"
                        />
                      </div>

                      <div style={styles.grid2}>
                        <select
                          style={styles.input}
                          value={person.csgRate2Company}
                          onChange={(e) => updatePerson(type, "csgRate2Company", e.target.value)}
                        >
                          <option value="">CSG company #2</option>
                          {CSG_COMPANY_OPTIONS.map((company) => <option key={company} value={company}>{company}</option>)}
                        </select>
                        <input
                          style={styles.input}
                          value={person.csgRate2}
                          onChange={(e) => updatePerson(type, "csgRate2", e.target.value)}
                          placeholder="Rate #2"
                        />
                      </div>

                      <div style={styles.grid2}>
                        <select
                          style={styles.input}
                          value={person.csgRate3Company}
                          onChange={(e) => updatePerson(type, "csgRate3Company", e.target.value)}
                        >
                          <option value="">CSG company #3</option>
                          {CSG_COMPANY_OPTIONS.map((company) => <option key={company} value={company}>{company}</option>)}
                        </select>
                        <input
                          style={styles.input}
                          value={person.csgRate3}
                          onChange={(e) => updatePerson(type, "csgRate3", e.target.value)}
                          placeholder="Rate #3"
                        />
                      </div>

                      <div style={{ padding: 12, border: "1px solid #d6dde8", borderRadius: 10, background: "#f8fafc" }}>
                        <strong>Top 3 by rate</strong>
                        <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                          {topCsgRates.length ? topCsgRates.map((row, index) => (
                            <button
                              key={row.company + row.rate}
                              type="button"
                              style={styles.button}
                              onClick={() => selectCsgCompany(row.company)}
                            >
                              #{index + 1} {row.company} — {moneyDisplay(moneyValue(row.rate))}
                            </button>
                          )) : <span>Enter CSG company/rate rows above to rank the top 3.</span>}
                        </div>
                      </div>

                      <div style={styles.grid2}>
                        <select
                          style={styles.input}
                          value={person.csgSelectedCompany}
                          onChange={(e) => selectCsgCompany(e.target.value)}
                        >
                          <option value="">Select company of choice</option>
                          {CSG_COMPANY_OPTIONS.map((company) => <option key={company} value={company}>{company}</option>)}
                        </select>
                        <select
                          style={styles.input}
                          value={person.csgHouseholdDiscountPercent || "0"}
                          onChange={(e) => updateCsgDiscount(e.target.value)}
                        >
                          {HOUSEHOLD_DISCOUNT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                        </select>
                      </div>

                      <input
                        style={styles.input}
                        value={person.csgProposedPremium}
                        onChange={(e) => updatePerson(type, "csgProposedPremium", e.target.value)}
                        placeholder="Selected / discounted premium to Quick Calculator"
                      />

                      <div style={styles.nav}>
                        <button type="button" style={styles.button} onClick={() => openCsgRaterForPerson(person, label)}>
                          Open CSG Rater for {label}
                        </button>
                        <button
                          type="button"
                          style={styles.primaryButton}
                          onClick={() => {
                            const baseRate = person.csgSelectedBaseRate || person.csgProposedPremium;
                            const discounted = applyHouseholdDiscount(baseRate, person.csgHouseholdDiscountPercent);
                            updatePerson(type, "csgProposedPremium", discounted ? discounted.toFixed(2) : person.csgProposedPremium);
                            updatePerson(type, "proposedMedSuppPremium", discounted ? discounted.toFixed(2) : person.csgProposedPremium);
                          }}
                        >
                          Apply Household Discount / Push to Calculator
                        </button>
                      </div>
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
      client_csg_link: buildCsgRaterUrl(client),
      spouse_csg_link: buildCsgRaterUrl(spouse),
      client_csg_gender: csgGenderFromSex(client.sex),
      spouse_csg_gender: csgGenderFromSex(spouse.sex),
      client_csg_tobacco_use: csgTobaccoFromInput(client.tobacco),
      spouse_csg_tobacco_use: csgTobaccoFromInput(spouse.tobacco),
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
      <p style={styles.muted}>Uses first name, last name, birthdate or age, phone, email, ZIP, address, sex/gender, tobacco, agent, notes, and coverage details for client search/link or file import.</p>
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
        <button type="button" style={styles.button} onClick={() => downloadIntegrationCsv(household)}>Export Medicare Pro CSV</button>
      </div>

      <div style={{ ...styles.nav, marginTop: 8 }}>
        <button type="button" style={styles.button} onClick={() => openExternal("https://www.monday.com/")}>Open Monday</button>
        <button type="button" style={styles.button} onClick={() => openCsgRaterForPerson(household.client, "Client")}>Open CSG - Client</button>
        <button type="button" style={styles.button} onClick={() => openCsgRaterForPerson(household.spouse, "Spouse")}>Open CSG - Spouse</button>
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

function SidebarNav({ view, setView, message, activeUserRole, activeUserName, setActiveUserRole, setActiveUserName }) {
  const navItems = visibleNavItemsForRole(activeUserRole);

  return (
    <aside style={styles.sidebar}>
      <div style={styles.sidebarTitle}>SIPS Command Hub</div>
      <div style={styles.sidebarSub}>Simple roles: Agent sees only his work tools/data. Senior Agent and Admin have full access.</div>
      <select style={{ ...styles.input, padding: "7px 8px", fontSize: 12 }} value={activeUserRole} onChange={(e) => { setActiveUserRole(e.target.value); setView(e.target.value === "Agent" ? "agent" : "admin"); }}>
        <option value="Agent">Agent</option>
        <option value="Office Manager">Office Manager</option>
        <option value="Senior Agent">Senior Agent</option>
        <option value="Admin">Admin</option>
      </select>
      {activeUserRole !== "Admin" ? (
        <select style={{ ...styles.input, padding: "7px 8px", fontSize: 12 }} value={activeUserName} onChange={(e) => { setActiveUserName(e.target.value); if (activeUserRole === "Agent") setView("agent"); }}>
          {AGENTS.filter((agent) => agent.name !== "Admin").map((agent) => <option key={agent.name} value={agent.name}>{agent.name}</option>)}
        </select>
      ) : null}
      {navItems.map(([key, label]) => (
        <button key={key} type="button" onClick={() => setView(key)} style={view === key ? styles.sideButtonActive : styles.sideButton}>{label}</button>
      ))}
      {message ? <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: "rgba(255,255,255,.10)", fontSize: 13, lineHeight: 1.35 }}><strong>System Note</strong><br />{message}</div> : null}
    </aside>
  );
}

export default function Page() {
  const [view, setView] = useState("dashboard");
  const [agentTab, setAgentTab] = useState("Client");
  const [selectedCompanyLogin, setSelectedCompanyLogin] = useState("");
  const [activeUserRole, setActiveUserRole] = useState("Admin");
  const [activeUserName, setActiveUserName] = useState("Loyd Richardson");
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
  const [calendarViewMode, setCalendarViewMode] = useState("Day View");
  const [clientsAgentFilter, setClientsAgentFilter] = useState("All");
  const [pipelineStatusFilter, setPipelineStatusFilter] = useState("All");
  const [currentClientSearch, setCurrentClientSearch] = useState("");
  const [rateCallFilter, setRateCallFilter] = useState("All");
  const [appointmentSearchFrom, setAppointmentSearchFrom] = useState("");
  const [appointmentSearchTo, setAppointmentSearchTo] = useState("");
  const [appointmentSearchText, setAppointmentSearchText] = useState("");
  const [customEmailBody, setCustomEmailBody] = useState(() => renderEmailTemplate("Plan Review", household, appointmentDate, appointmentTime, appointmentLocation));
  const [emailSubject, setEmailSubject] = useState(EMAIL_TEMPLATE_SUBJECTS["Plan Review"]);
  const [emailAttachmentFiles, setEmailAttachmentFiles] = useState([]);
  const [automationLog, setAutomationLog] = useState([]);
  const [autoCreateAppointment, setAutoCreateAppointment] = useState(true);
  const [autoPrepareEmail, setAutoPrepareEmail] = useState(true);
  const [autoSendEmail, setAutoSendEmail] = useState(false);

  const selectedHousehold = useMemo(
    () => households.find((item) => item.id === selectedHouseholdId) || households[0] || null,
    [households, selectedHouseholdId]
  );

function canSeeView(key) {
  return ROLE_ACCESS[activeUserRole]?.has(key);
}

function hasManagerAccess() {
  return ["Admin", "Senior Agent", "Office Manager"].includes(activeUserRole);
}

function getVisibleHouseholds() {
  if (hasManagerAccess()) return households;
  return households.filter((item) => (item.assignedAgent || "Admin") === activeUserName);
}

function getVisibleEvents() {
  if (hasManagerAccess()) return events;
  return events.filter((event) => event.agent === activeUserName);
}

function safeSetView(key) {
  if (canSeeView(key)) {
    setView(key);
    return;
  }

  setMessage("Access restricted for this role. Admin can change this under Agent Permissions.");
  setView(hasManagerAccess() ? "admin" : "agent");
}

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

  function selectedAttachableForms() {
    return (household.client.forms || "").split(", ").filter(Boolean);
  }

  function toggleAttachableForm(formName, checked) {
    const current = selectedAttachableForms();
    const next = checked ? [...new Set([...current, formName])] : current.filter((item) => item !== formName);
    updatePerson("client", "forms", next.join(", "));
  }

  function applyDefaultFormsForTemplate(templateName) {
    const defaults = EMAIL_TEMPLATE_DEFAULT_FORMS[templateName] || [];
    if (!defaults.length) return;
    const current = selectedAttachableForms();
    const next = [...new Set([...current, ...defaults])];
    updatePerson("client", "forms", next.join(", "));
  }

  function handleEmailTemplateChange(templateName) {
    setEmailTemplate(templateName);
    setEmailSubject(EMAIL_TEMPLATE_SUBJECTS[templateName] || `Senior Care Plus - ${templateName}`);
    setCustomEmailBody(renderEmailTemplate(templateName, household, appointmentDate, appointmentTime, appointmentLocation));
    applyDefaultFormsForTemplate(templateName);
  }

  function refreshEmailTemplateWithLatestData() {
    setEmailSubject(EMAIL_TEMPLATE_SUBJECTS[emailTemplate] || `Senior Care Plus - ${emailTemplate}`);
    setCustomEmailBody(renderEmailTemplate(emailTemplate, household, appointmentDate, appointmentTime, appointmentLocation));
    applyDefaultFormsForTemplate(emailTemplate);
    setMessage("Email template refreshed with latest client, spouse, appointment, premium, and agent data.");
  }

  function buildEmailPackageBody() {
    const forms = selectedAttachableForms();
    const uploaded = emailAttachmentFiles.map((file) => file.name);
    const clientLine = `${fullName(household.client)}${household.client.phone ? " | " + household.client.phone : ""}${household.client.email ? " | " + household.client.email : ""}`;
    const spouseLine = personHasData(household.spouse) ? `\nSpouse: ${fullName(household.spouse)}${household.spouse.health ? " | Health: " + household.spouse.health : ""}` : "";
    const formLine = forms.length ? `\n\nForms/documents to attach or request:\n- ${forms.join("\n- ")}` : "";
    const uploadLine = uploaded.length ? `\n\nUploaded file attachments selected in SIPS:\n- ${uploaded.join("\n- ")}` : "";
    const adminLine = `\n\nAdmin record:\nClient: ${clientLine}${spouseLine}\nAssigned Agent: ${household.assignedAgent || "-"}\nMedicare Pro Status: ${household.medicareProStatus || "-"}\nMedicare Pro Client ID/Search: ${household.medicareProClientId || "-"}\nCurrent Premium: ${household.currentPremium || household.client.currentMedSuppPremium || "-"}\nNotes: ${household.notes || "-"}`;
    return `${customEmailBody || ""}${formLine}${uploadLine}${adminLine}`;
  }

  function copyEmailPackage() {
    const packageText = `TO: ${household.client.email || ""}\nSUBJECT: ${emailSubject}\n\n${buildEmailPackageBody()}`;
    navigator.clipboard?.writeText(packageText);
    setMessage("Email package copied with selected forms and Admin/Medicare Pro details.");
  }

  function openEmailDraft() {
    const to = household.client.email || "";
    const subject = encodeURIComponent(emailSubject || `Senior Care Plus - ${emailTemplate}`);
    const body = encodeURIComponent(buildEmailPackageBody());
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    setMessage("Email draft opened. Mailto cannot auto-attach files, so attach the selected files shown in the SIPS form list or use Send Email if your /api/email/send route is connected.");
  }

  async function sendEmailWithForms() {
    const to = household.client.email || "";
    if (!to) {
      setMessage("Add the client email before sending.");
      return;
    }

    const formData = new FormData();
    formData.append("to", to);
    formData.append("subject", emailSubject || `Senior Care Plus - ${emailTemplate}`);
    formData.append("body", buildEmailPackageBody());
    formData.append("selectedForms", JSON.stringify(selectedAttachableForms()));
    formData.append("clientName", fullName(household.client));
    formData.append("assignedAgent", household.assignedAgent || "");
    emailAttachmentFiles.forEach((file) => formData.append("attachments", file));

    try {
      const response = await fetch("/api/email/send", { method: "POST", body: formData });
      if (response.ok) {
        setMessage("Email sent with selected form list and uploaded attachments.");
      } else {
        setMessage("Email send route responded with an error. Email package is still ready to copy or open as a draft.");
      }
    } catch (error) {
      setMessage("Email API is not connected yet. Use Copy Email Package or Open Email Draft, then attach the selected files manually.");
    }
  }


  function addAutomationLog(item) {
    setAutomationLog((prev) => [`${new Date().toLocaleTimeString()} - ${item}`, ...prev].slice(0, 10));
  }

  async function runAdminAutomation() {
    if (!household.client.firstName && !household.client.lastName) {
      setMessage("Enter at least the client first or last name before running automation.");
      return;
    }

    saveIntake();
    addAutomationLog("Admin record saved and synced to Household, Clients, Today, Agent, Quick Rater, and Calculator.");

    if (autoCreateAppointment) {
      if (appointmentDate && appointmentTime) {
        await createCalendarEvent();
        addAutomationLog("Appointment created locally and sent to Google Calendar route if connected.");
      } else {
        addAutomationLog("Appointment skipped: choose date and time first.");
      }
    }

    addAutomationLog("Medicare Pro and Monday auto-push intentionally skipped for stability. Use manual copy/export buttons when ready.");

    if (autoSendEmail) {
      await sendEmailWithForms();
      addAutomationLog("Email send attempted with selected form list and uploaded files.");
    } else if (autoPrepareEmail) {
      copyEmailPackage();
      addAutomationLog("Email package copied/prepared. Attach selected files manually if sending through regular email.");
    } else {
      addAutomationLog("Email step skipped by Admin setting.");
    }

    setMessage("Stable Admin automation complete: saved record, handled appointment, prepared email, and skipped Medicare Pro/Monday auto-push.");
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
      statusUpdatedAt: household.statusUpdatedAt || new Date().toLocaleString(),
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
        `Age: ${calculateAge(household.client.birthdate) || "-"}\n` +
        `Email: ${household.client.email || "-"}\n` +
        `Reason: ${household.reasonForCall}\n` +
        `Agent: ${household.assignedAgent}\n` +
        `Current Premium: ${household.currentPremium || household.client.currentMedSuppPremium || household.client.currentTotalPremium || "-"}\n` +
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

  function updateSavedHousehold(id, field, value) {
    const stamp = new Date().toLocaleString();
    setHouseholds((prev) => prev.map((item) => item.id === id ? { ...item, [field]: value, updatedAt: stamp, ...(field === "businessStatus" || field === "status" ? { statusUpdatedAt: stamp } : {}) } : item));
    if (household.id === id) {
      updateHousehold(field, value);
      if (field === "businessStatus" || field === "status") setHousehold((prev) => ({ ...prev, statusUpdatedAt: stamp }));
    }
    setMessage("Client record updated in the dashboard sheet.");
  }

  function parseSheetRows(text) {
    const lines = String(text || "").split(/\r?\n/).filter((line) => line.trim());
    if (!lines.length) return [];
    const splitLine = (line) => line.includes("\t") ? line.split("\t") : line.split(",");
    const headers = splitLine(lines[0]).map((h) => h.trim().toLowerCase().replace(/[^a-z0-9]/g, ""));
    const find = (row, names) => {
      for (const name of names) {
        const key = name.toLowerCase().replace(/[^a-z0-9]/g, "");
        const index = headers.indexOf(key);
        if (index >= 0) return (row[index] || "").trim();
      }
      return "";
    };

    return lines.slice(1).map((line, index) => {
      const row = splitLine(line).map((cell) => cell.replace(/^"|"$/g, "").trim());
      const firstName = find(row, ["First Name", "First", "Client First Name"]);
      const lastName = find(row, ["Last Name", "Last", "Client Last Name"]);
      const full = find(row, ["Name", "Client Name", "Full Name"]);
      const parts = full && !firstName ? full.split(/\s+/) : [];
      const client = {
        ...blankPerson,
        firstName: firstName || parts[0] || "",
        lastName: lastName || parts.slice(1).join(" ") || "",
        phone: formatPhone(find(row, ["Phone", "Phone Number", "Client Phone"])),
        email: find(row, ["Email", "Client Email"]),
        birthdate: formatDate(find(row, ["DOB", "Birthdate", "Date of Birth"])),
        address: find(row, ["Address", "Street Address"]),
        city: find(row, ["City"]),
        state: find(row, ["State"]),
        zip: find(row, ["Zip", "ZIP Code", "Postal Code"]),
        currentCarrier: find(row, ["Carrier", "Current Carrier", "Company"]),
        currentMedSuppPremium: find(row, ["Current Premium", "Premium", "Monthly Premium"]),
      };
      return {
        ...blankHousehold,
        id: `CC-${Date.now()}-${index}`,
        status: "Rate Increase Call",
        businessStatus: find(row, ["Business Status", "Status"]) || "Rate Increase Call",
        assignedAgent: find(row, ["Agent", "Assigned Agent"]) || "Admin",
        currentPremium: client.currentMedSuppPremium,
        carrier: client.currentCarrier,
        policyNumber: find(row, ["Policy Number", "Policy #"]),
        rateIncreaseDate: find(row, ["Rate Increase Date", "Increase Date", "Renewal Date"]),
        rateIncreaseAmount: find(row, ["Rate Increase Amount", "Increase Amount", "New Premium"]),
        callStatus: find(row, ["Call Status"]) || "Not Called",
        nextCallDate: find(row, ["Next Call Date", "Call Date"]),
        sheetRowId: find(row, ["Row ID", "ID"]) || `IMPORT-${Date.now()}-${index}`,
        reasonForCall: "Rate increase review",
        notes: find(row, ["Notes", "Comments"]),
        client,
        spouse: { ...blankPerson },
        ancillary: { ...blankAncillary },
        createdAt: new Date().toLocaleString(),
      };
    }).filter((item) => item.client.firstName || item.client.lastName || item.client.phone || item.client.email);
  }

  function handleCurrentClientUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imported = parseSheetRows(reader.result);
      setHouseholds((prev) => [...imported, ...prev]);
      setMessage(`${imported.length} current client record(s) imported for rate-increase calls.`);
    };
    reader.readAsText(file);
  }

  function downloadCurrentClientSheetTemplate() {
    const headers = ["First Name","Last Name","Phone","Email","DOB","Address","City","State","ZIP","Carrier","Policy Number","Current Premium","Rate Increase Date","Rate Increase Amount","Agent","Call Status","Next Call Date","Notes"];
    const sample = ["Jane","Client","601-555-1212","jane@example.com","01/01/1955","123 Main St","Pearl","MS","39208","Aetna","POL123","185.00","06/01/2026","22.00","Admin","Not Called","","Upcoming rate increase review"];
    const csv = [headers, sample].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sips-current-client-rate-increase-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportDashboardSheet() {
    const headers = ["ID","First Name","Last Name","Phone","Email","Agent","Business Status","Call Status","Carrier","Policy Number","Current Premium","Rate Increase Date","Rate Increase Amount","Next Call Date","Notes"];
    const rows = households.map((item) => [item.id, item.client?.firstName, item.client?.lastName, item.client?.phone, item.client?.email, item.assignedAgent, item.businessStatus || item.status, item.callStatus, item.carrier || item.client?.currentCarrier, item.policyNumber, item.currentPremium || item.client?.currentMedSuppPremium, item.rateIncreaseDate, item.rateIncreaseAmount, item.nextCallDate, item.notes]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell || "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sips-dashboard-sheet-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }


  function daysSince(value) {
    if (!value) return 0;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 0;
    return Math.floor((Date.now() - parsed.getTime()) / 86400000);
  }

  function getRecordAlerts(item) {
    const alerts = [];
    const status = item.businessStatus || item.status || "New";
    const ageDays = daysSince(item.statusUpdatedAt || item.applicationDate || item.createdAt);
    if (status === "Pending Business" && ageDays >= 5) alerts.push(`Pending ${ageDays} days — follow up with carrier`);
    if ((item.status === "Rate Increase Call" || item.businessStatus === "Rate Increase Call" || item.rateIncreaseDate) && (item.callStatus || "Not Called") === "Not Called") alerts.push("Rate increase client not contacted yet");
    if (item.nextCallDate && item.nextCallDate <= new Date().toISOString().slice(0, 10) && !["Completed", "Do Not Call"].includes(item.callStatus || "")) alerts.push("Call due today or overdue");
    if (status === "Written Business" && !item.applicationDate) alerts.push("Written business missing application date");
    if (status === "Issued Business" && !item.policyNumber) alerts.push("Issued business missing policy number");
    return alerts;
  }

  function moveCurrentApplicationStatus(nextStatus) {
    const id = household.id || selectedHouseholdId;
    const stamp = new Date().toLocaleString();
    setHousehold((prev) => ({ ...prev, businessStatus: nextStatus, status: nextStatus, statusUpdatedAt: stamp }));
    if (id) setHouseholds((prev) => prev.map((item) => item.id === id ? { ...item, businessStatus: nextStatus, status: nextStatus, statusUpdatedAt: stamp, updatedAt: stamp } : item));
    setMessage(`Application moved to ${nextStatus}.`);
  }

  function advanceSavedApplication(id, nextStatus) {
    const stamp = new Date().toLocaleString();
    setHouseholds((prev) => prev.map((item) => item.id === id ? { ...item, businessStatus: nextStatus, status: nextStatus, statusUpdatedAt: stamp, updatedAt: stamp } : item));
    if (household.id === id) setHousehold((prev) => ({ ...prev, businessStatus: nextStatus, status: nextStatus, statusUpdatedAt: stamp }));
    setMessage(`Record moved to ${nextStatus}.`);
  }

  function getDailyTasks() {
    const today = new Date().toISOString().slice(0, 10);
    const todaysEvents = getVisibleEvents().filter((event) => event.date === today).map((event) => ({ id: event.id, type: "Appointment", title: event.title, detail: `${event.time} · ${event.agent} · ${event.location}`, source: event }));
    const followUps = getVisibleHouseholds().flatMap((item) => {
      const tasks = [];
      getRecordAlerts(item).forEach((alert, index) => tasks.push({ id: `${item.id}-alert-${index}`, type: "Alert", title: fullName(item.client), detail: alert, source: item }));
      if (item.nextCallDate === today) tasks.push({ id: `${item.id}-call`, type: "Call", title: fullName(item.client), detail: `${item.client?.phone || "No phone"} · ${item.callStatus || "Not Called"}`, source: item });
      return tasks;
    });
    return [...todaysEvents, ...followUps];
  }

  function getAgentPerformanceRows() {
   return (["Admin", "Senior Agent", "Office Manager"].includes(activeUserRole)
  ? AGENTS
  : AGENTS.filter((agent) => agent.name === activeUserName)
).map((agent) => {
      const assigned = getVisibleHouseholds().filter((item) => (item.assignedAgent || "Admin") === agent.name);
      const countBy = (status) => assigned.filter((item) => (item.businessStatus || item.status) === status).length;
      return { agent: agent.name, total: assigned.length, written: countBy("Written Business"), pending: countBy("Pending Business"), issued: countBy("Issued Business"), declined: countBy("Declined Business"), rateCalls: assigned.filter((item) => item.status === "Rate Increase Call" || item.businessStatus === "Rate Increase Call" || item.rateIncreaseDate).length, appointments: getVisibleEvents().filter((event) => event.agent === agent.name).length };
    });
  }

  function renderDailyTasks() {
    const tasks = getDailyTasks();
    return (
      <section style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Daily Admin Task List</h2>
        <p style={{ marginTop: 0 }}>Shows today’s appointments, pending business alerts, rate-increase clients not contacted, and due call-backs.</p>
        <div style={styles.nav}>
          <button type="button" style={styles.button} onClick={() => setView("calendar")}>Calendar / Availability</button>
          <button type="button" style={styles.button} onClick={() => setView("status")}>Status Pipeline</button>
          <button type="button" style={styles.button} onClick={() => setView("currentClients")}>Rate Calls</button>
        </div>
        {tasks.length === 0 ? <p>No urgent admin tasks for today.</p> : null}
        {tasks.map((task) => (
          <div key={task.id} style={{ border: "1px solid #d6dde8", borderRadius: 12, padding: 14, marginTop: 10, background: task.type === "Alert" ? "#fff7ed" : "white" }}>
            <strong>{task.type}: {task.title}</strong>
            <p style={{ marginBottom: 8 }}>{task.detail}</p>
            {task.source?.client ? <button type="button" style={styles.button} onClick={() => { loadHousehold(task.source); setView("household"); }}>Open Client</button> : null}
          </div>
        ))}
      </section>
    );
  }

  function renderPerformance() {
    const rows = getAgentPerformanceRows();
    return (
      <section style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Agent Performance View</h2>
        <p style={{ marginTop: 0 }}>Tracks written, pending, issued, declined, rate-increase call records, and appointments by agent.</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 840 }}>
            <thead><tr>{["Agent", "Total", "Written", "Pending", "Issued", "Declined", "Rate Calls", "Appointments"].map((head) => <th key={head} style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #d6dde8" }}>{head}</th>)}</tr></thead>
            <tbody>{rows.map((row) => (<tr key={row.agent}><td style={{ padding: 8, fontWeight: 700 }}>{row.agent}</td><td style={{ padding: 8 }}>{row.total}</td><td style={{ padding: 8 }}>{row.written}</td><td style={{ padding: 8 }}>{row.pending}</td><td style={{ padding: 8 }}>{row.issued}</td><td style={{ padding: 8 }}>{row.declined}</td><td style={{ padding: 8 }}>{row.rateCalls}</td><td style={{ padding: 8 }}>{row.appointments}</td></tr>))}</tbody>
          </table>
        </div>
      </section>
    );
  }


  function renderLeadCapture() {
    return (
      <LeadCapturePage household={household} updatePerson={updatePerson} updateHousehold={updateHousehold} saveIntake={saveIntake} setView={setView} />
    );
  }


  function renderPermissions() {
    return (
      <>
        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Role Access Control</h2>
          <p style={{ marginTop: 0 }}>Permissions are simplified into three roles so you do not have to manage individual page checkboxes.</p>
          <div style={styles.grid3}>
            <div style={{ padding: 12, border: "1px solid #d6dde8", borderRadius: 12, background: "#f8fafc" }}><strong>Agent</strong><br />Agent page, Calendar, Household, Quick Rater, Calculator. Data is filtered to that agent only.</div>
            <div style={{ padding: 12, border: "1px solid #d6dde8", borderRadius: 12, background: "#f8fafc" }}><strong>Senior Agent</strong><br />Full system access and all agency records.</div>
            <div style={{ padding: 12, border: "1px solid #d6dde8", borderRadius: 12, background: "#f8fafc" }}><strong>Admin</strong><br />Full unrestricted access, role preview, imports, exports, and tracking.</div>
          </div>
          <div style={{ ...styles.nav, marginTop: 14 }}>
            <button type="button" style={styles.button} onClick={() => { setActiveUserRole("Agent"); setView("agent"); }}>Preview Agent</button>
            <button type="button" style={styles.button} onClick={() => { setActiveUserRole("Senior Agent"); setView("admin"); }}>Preview Senior Agent</button>
            <button type="button" style={styles.primaryButton} onClick={() => { setActiveUserRole("Admin"); setView("admin"); }}>Return to Admin</button>
          </div>
        </section>

        <section style={styles.card}>
          <h3 style={{ marginTop: 0 }}>Agent Data Filtering</h3>
          <p style={{ marginTop: 0 }}>When the role is Agent, the dashboard automatically limits calendar appointments, household records, and visible pipeline data to the selected agent. Senior Agent and Admin see everything.</p>
          <div style={styles.grid2}>
            <div><strong>Current Role:</strong> {activeUserRole}</div>
            <div><strong>Selected Agent:</strong> {activeUserRole === "Admin" ? "All agency data" : activeUserName}</div>
          </div>
        </section>
      </>
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
    const todaysAppointments = getVisibleEvents().filter((event) => event.date === new Date().toISOString().slice(0, 10));
    const activeClient = fullName(household.client);

    return (
      <>
        <section style={{ ...styles.card, border: "2px solid #0f2a44" }}>
          <h2 style={{ marginTop: 0 }}>Admin Hub — Clean Command Center</h2>
          <p style={{ marginTop: 0 }}>
            Admin stays simple: start intake, search appointments, open clients, prepare emails, or export Medicare Pro/Monday fields.
            Scheduling details now live in the separate Initial Intake form.
          </p>
          <div style={styles.nav}>
            <button type="button" style={styles.primaryButton} onClick={() => setView("initialIntake")}>Initial Intake Form</button>
            <button type="button" style={styles.button} onClick={() => setView("calendar")}>Search Calendar</button>
            <button type="button" style={styles.button} onClick={() => { const today = new Date().toISOString().slice(0, 10); setAppointmentSearchFrom(today); setAppointmentSearchTo(today); setView("calendar"); }}>Today</button>
            <button type="button" style={styles.button} onClick={() => setView("clients")}>Clients</button>
            <button type="button" style={styles.button} onClick={() => setView("currentClients")}>Current Clients / Rate Calls</button>
            <button type="button" style={styles.button} onClick={() => setView("dailyTasks")}>Daily Admin Tasks</button>
            <button type="button" style={styles.button} onClick={() => setView("performance")}>Agent Performance</button>
            <button type="button" style={styles.button} onClick={() => setView("status")}>Status Pipeline</button>
            <button type="button" style={styles.button} onClick={() => setView("permissions")}>Agent Permissions</button>
            <button type="button" style={styles.button} onClick={() => setView("agent")}>Agent Page</button>
            <button type="button" style={styles.button} onClick={openSipsGoogleCalendar}>Google Calendar</button>
          </div>
          {message ? <p><strong>{message}</strong></p> : null}
        </section>

        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Admin Alerts / Today</h2>
          <div style={styles.grid3}>
            <div><strong>Tasks Today:</strong> {getDailyTasks().length}</div>
            <div><strong>Pending Alerts:</strong> {getVisibleHouseholds().filter((item) => getRecordAlerts(item).length).length}</div>
            <div><strong>Appointments:</strong> {todaysAppointments.length}</div>
          </div>
          <div style={{ ...styles.nav, marginTop: 12 }}>
            <button type="button" style={styles.primaryButton} onClick={() => setView("dailyTasks")}>Open Daily Task List</button>
            <button type="button" style={styles.button} onClick={() => setView("performance")}>Open Performance View</button>
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Current Working File</h2>
          <div style={styles.grid3}>
            <div><strong>Client:</strong> {activeClient}</div>
            <div><strong>Phone:</strong> {household.client.phone || "-"}</div>
            <div><strong>Agent:</strong> {household.assignedAgent || "Admin"}</div>
            <div><strong>Status:</strong> {household.businessStatus || household.status || "New"}</div>
            <div><strong>Reason:</strong> {household.reasonForCall || "-"}</div>
            <div><strong>Premium:</strong> {household.currentPremium || household.client.currentMedSuppPremium || "-"}</div>
          </div>
          <div style={{ ...styles.grid3, marginTop: 12 }}>
            <select style={styles.input} value={household.businessStatus || household.status || "New"} onChange={(e) => updateHousehold("businessStatus", e.target.value)}>
              {BUSINESS_STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <input style={styles.input} value={household.carrier || ""} onChange={(e) => updateHousehold("carrier", e.target.value)} placeholder="Carrier / Company" />
            <input style={styles.input} value={household.policyNumber || ""} onChange={(e) => updateHousehold("policyNumber", e.target.value)} placeholder="Policy Number" />
          </div>
          <div style={{ ...styles.nav, marginTop: 12 }}>
            <button type="button" style={styles.primaryButton} onClick={saveIntake}>Save Current Record</button>
            <button type="button" style={styles.button} onClick={() => setView("initialIntake")}>Continue Intake / Schedule</button>
            <button type="button" style={styles.button} onClick={resetIntake}>Clear Intake</button>
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Admin Quick Actions</h2>
          <div style={styles.nav}>
            <button type="button" style={styles.button} onClick={refreshEmailTemplateWithLatestData}>Refresh Email Template</button>
            <button type="button" style={styles.button} onClick={copyEmailPackage}>Copy Email Package</button>
            <button type="button" style={styles.button} onClick={openEmailDraft}>Open Email Draft</button>
            <button type="button" style={styles.button} onClick={() => navigator.clipboard?.writeText(JSON.stringify(buildIntegrationAutofillData(household).medicarePro, null, 2))}>Copy Medicare Pro Fields</button>
            <button type="button" style={styles.button} onClick={() => navigator.clipboard?.writeText(JSON.stringify(buildIntegrationAutofillData(household).monday, null, 2))}>Copy Monday Fields</button>
            <button type="button" style={styles.button} onClick={() => downloadIntegrationCsv(household)}>Export CSV</button>
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Today Snapshot</h2>
          {todaysAppointments.length === 0 ? <p>No saved appointments for today yet.</p> : null}
          {todaysAppointments.slice(0, 6).map((event) => (
            <div key={event.id} style={{ border: "1px solid #d6dde8", borderRadius: 10, padding: 10, marginTop: 8 }}>
              <strong>{event.time || "No time"} — {event.title}</strong>
              <div>{event.agent || "Unassigned"} · {event.location || "Phone Call"}</div>
            </div>
          ))}
        </section>
      </>
    );
  }

  function renderInitialIntake() {
    const clientSnapshot = calculatePremiumSnapshot(household.client, "client", household.ancillary || blankAncillary);
    const spouseSnapshot = calculatePremiumSnapshot(household.spouse, "spouse", household.ancillary || blankAncillary);

    return (
      <>
        <section style={{ ...styles.card, border: "2px solid #0f2a44" }}>
          <h2 style={{ marginTop: 0 }}>Initial Intake Form — Call-In Appointment</h2>
          <p style={{ marginTop: 0 }}>
            Use this screen when a client calls in. Enter client/spouse information, assign the agent, schedule the appointment, then save.
          </p>
          <div style={styles.nav}>
            <button type="button" style={styles.primaryButton} onClick={saveIntake}>Save Intake</button>
            <button type="button" style={styles.primaryButton} onClick={createCalendarEvent}>Schedule Appointment</button>
            <button type="button" style={styles.button} onClick={() => { setCalendarViewMode("Open Slots View"); setAppointmentSearchFrom(appointmentDate || new Date().toISOString().slice(0, 10)); setAppointmentSearchTo(appointmentDate || new Date().toISOString().slice(0, 10)); setView("calendar"); }}>Check Availability / Open Slots</button>
            <button type="button" style={styles.button} onClick={openSipsGoogleCalendar}>Open Google Calendar</button>
            <button type="button" style={styles.button} onClick={() => setView("admin")}>Return to Admin</button>
          </div>
          {message ? <p><strong>{message}</strong></p> : null}
        </section>

        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Appointment Scheduler</h2>
          <div style={styles.grid3}>
            <select style={styles.input} value={household.reasonForCall} onChange={(e) => updateHousehold("reasonForCall", e.target.value)}>
              {APPOINTMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            <select style={styles.input} value={household.assignedAgent} onChange={(e) => updateHousehold("assignedAgent", e.target.value)}>
              {AGENTS.map((agent) => <option key={agent.name} value={agent.name}>{agent.name}</option>)}
            </select>
            <select style={styles.input} value={household.status} onChange={(e) => updateHousehold("status", e.target.value)}>
              <option value="New">New</option>
              <option value="Working">Working</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div style={{ ...styles.grid3, marginTop: 12 }}>
            <input style={styles.input} type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} />
            <input style={styles.input} type="time" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} />
            <select style={styles.input} value={appointmentDuration} onChange={(e) => setAppointmentDuration(e.target.value)}>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
            </select>
          </div>
          <div style={{ ...styles.grid3, marginTop: 12 }}>
            <select style={styles.input} value={appointmentLocation} onChange={(e) => setAppointmentLocation(e.target.value)}>
              <option value="Phone Call">Phone Call</option>
              <option value="Office">Office</option>
              <option value="Client Home">Client Home</option>
              <option value="Zoom / Virtual">Zoom / Virtual</option>
              <option value="Other">Other</option>
            </select>
            <input style={styles.input} value={household.referredBy} onChange={(e) => updateHousehold("referredBy", e.target.value)} placeholder="Referral source / Referred by" />
            <button type="button" style={styles.primaryButton} onClick={createCalendarEvent}>Create Appointment</button>
          </div>
        </section>

        <div style={styles.grid2}>
          <PersonForm title="Client" type="client" person={household.client} updatePerson={updatePerson} />
          <PersonForm title="Spouse" type="spouse" person={household.spouse} updatePerson={updatePerson} />
        </div>

        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Coverage, Premium, Health, and Notes</h2>
          <div style={styles.grid3}>
            <select style={styles.input} value={household.currentCoverage} onChange={(e) => updateHousehold("currentCoverage", e.target.value)}>
              <option value="">Current Coverage</option>
              {COVERAGE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            {household.currentCoverage === "Group" ? (
              <select style={styles.input} value={household.groupSize} onChange={(e) => updateHousehold("groupSize", e.target.value)}>
                <option value="">Group Size</option>
                {GROUP_SIZE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            ) : <input style={styles.input} value={household.groupSize} onChange={(e) => updateHousehold("groupSize", e.target.value)} placeholder="Group Size / Coverage Detail" />}
            <input style={styles.input} value={household.currentPremium} onChange={(e) => updateHousehold("currentPremium", e.target.value)} placeholder="Household Current Premium" />
          </div>
          <div style={{ ...styles.grid3, marginTop: 12 }}>
            <input style={styles.input} value={household.client.currentMedSuppPremium} onChange={(e) => updatePerson("client", "currentMedSuppPremium", e.target.value)} placeholder="Client Current Premium" />
            <input style={styles.input} value={household.spouse.currentMedSuppPremium} onChange={(e) => updatePerson("spouse", "currentMedSuppPremium", e.target.value)} placeholder="Spouse Current Premium" />
            <input style={styles.input} readOnly value={moneyDisplay(clientSnapshot.currentMonthly + spouseSnapshot.currentMonthly)} placeholder="Current Household Total" />
          </div>
          <div style={{ ...styles.grid2, marginTop: 12 }}>
            <textarea style={styles.textarea} value={household.client.health} onChange={(e) => updatePerson("client", "health", e.target.value)} placeholder="Client health, medications, underwriting notes" />
            <textarea style={styles.textarea} value={household.spouse.health} onChange={(e) => updatePerson("spouse", "health", e.target.value)} placeholder="Spouse health, medications, underwriting notes" />
          </div>
          <textarea style={{ ...styles.textarea, marginTop: 12 }} value={household.notes} onChange={(e) => updateHousehold("notes", e.target.value)} placeholder="Call notes / appointment notes / what agent needs to know" />
          <div style={{ ...styles.nav, marginTop: 12 }}>
            <button type="button" style={styles.primaryButton} onClick={saveIntake}>Save Intake</button>
            <button type="button" style={styles.button} onClick={() => setView("agent")}>Send to Agent Page</button>
            <button type="button" style={styles.button} onClick={() => setView("quickRater")}>Go to Quick Rater</button>
          </div>
        </section>
      </>
    );
  }


  function renderCalendar() {
    const today = new Date().toISOString().slice(0, 10);
    const activeDate = appointmentSearchFrom || appointmentDate || today;

    function addDays(dateString, days) {
      const date = new Date(`${dateString}T00:00:00`);
      date.setDate(date.getDate() + days);
      return date.toISOString().slice(0, 10);
    }

    function getRangeForView() {
      if (calendarViewMode === "Week View") return { from: activeDate, to: addDays(activeDate, 6) };
      if (calendarViewMode === "Month View") return { from: activeDate.slice(0, 8) + "01", to: addDays(activeDate.slice(0, 8) + "01", 34) };
      if (appointmentSearchFrom || appointmentSearchTo) return { from: appointmentSearchFrom, to: appointmentSearchTo };
      return { from: activeDate, to: activeDate };
    }

    const range = getRangeForView();
    const filteredEvents = getVisibleEvents().filter((event) => {
      const viewForcesAllAgents = calendarViewMode === "All Agents View";
      const agentMatch = activeUserRole === "Agent" ? event.agent === activeUserName : (viewForcesAllAgents || appointmentsAgentFilter === "All" || event.agent === appointmentsAgentFilter);
      const typeMatch = appointmentsTypeFilter === "All" || event.appointmentType === appointmentsTypeFilter;
      const fromMatch = !range.from || event.date >= range.from;
      const toMatch = !range.to || event.date <= range.to;
      const text = appointmentSearchText.toLowerCase().trim();
      const textMatch = !text || [event.title, event.clientName, event.agent, event.appointmentType, event.location, event.description].join(" ").toLowerCase().includes(text);
      return agentMatch && typeMatch && fromMatch && toMatch && textMatch;
    }).sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

    const dateList = [];
    if (range.from && range.to) {
      let cursor = range.from;
      let guard = 0;
      while (cursor <= range.to && guard < 35) {
        dateList.push(cursor);
        cursor = addDays(cursor, 1);
        guard += 1;
      }
    } else {
      dateList.push(activeDate);
    }

    const visibleAgents = calendarViewMode === "All Agents View"
      ? AGENTS.map((agent) => agent.name)
      : [appointmentsAgentFilter === "All" ? (household.assignedAgent || selectedAgent || "Admin") : appointmentsAgentFilter];

    function getBookedSlotEvent(date, time, agentName) {
      return events.find((event) => event.date === date && event.time === time && event.agent === agentName);
    }

    function isSlotBooked(date, time, agentName) {
      return Boolean(getBookedSlotEvent(date, time, agentName));
    }

    function bookSlot(date, time, agentName) {
      const bookedEvent = getBookedSlotEvent(date, time, agentName);
      if (bookedEvent) {
        setMessage(`${date} at ${time} is already booked for ${agentName}: ${bookedEvent.clientName || bookedEvent.title}. Choose an open slot.`);
        return;
      }
      setAppointmentDate(date);
      setAppointmentTime(time);
      updateHousehold("assignedAgent", agentName);
      setAppointmentsAgentFilter(agentName);
      setView("initialIntake");
      setMessage(`Selected ${date} at ${time} for ${agentName}. Complete Initial Intake, then click Schedule Appointment.`);
    }

    function setQuickView(mode) {
      setCalendarViewMode(mode);
      const baseDate = appointmentSearchFrom || appointmentDate || today;
      if (mode === "Day View" || mode === "Agent View" || mode === "All Agents View" || mode === "Open Slots View" || mode === "Appointment Type View") {
        setAppointmentSearchFrom(baseDate);
        setAppointmentSearchTo(baseDate);
      }
      if (mode === "Week View") {
        setAppointmentSearchFrom(baseDate);
        setAppointmentSearchTo(addDays(baseDate, 6));
      }
      if (mode === "Month View") {
        const first = baseDate.slice(0, 8) + "01";
        setAppointmentSearchFrom(first);
        setAppointmentSearchTo(addDays(first, 34));
      }
    }

    const groupedByDate = dateList.map((date) => ({
      date,
      events: filteredEvents.filter((event) => event.date === date),
    }));

    return (
      <>
        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Calendar / Availability</h2>
          <p style={{ marginTop: 0 }}>Choose Day, Week, Month, Agent, All Agents, Appointment Type, or Open Slots. Admin can see open slots in green and booked slots in red before scheduling from Initial Intake.</p>

          <div style={{ ...styles.nav, marginBottom: 12 }}>
            {CALENDAR_VIEW_OPTIONS.map((mode) => (
              <button key={mode} type="button" style={calendarViewMode === mode ? styles.primaryButton : styles.button} onClick={() => setQuickView(mode)}>
                {mode.replace(" View", "")}
              </button>
            ))}
          </div>

          <div style={{ ...styles.grid3, marginBottom: 14 }}>
            <div>
              <label style={{ fontWeight: 700 }}>Search From</label>
              <input style={{ ...styles.input, marginTop: 6 }} type="date" value={appointmentSearchFrom} onChange={(e) => setAppointmentSearchFrom(e.target.value)} />
            </div>
            <div>
              <label style={{ fontWeight: 700 }}>Search To</label>
              <input style={{ ...styles.input, marginTop: 6 }} type="date" value={appointmentSearchTo} onChange={(e) => setAppointmentSearchTo(e.target.value)} />
            </div>
            <div>
              <label style={{ fontWeight: 700 }}>Search Text</label>
              <input style={{ ...styles.input, marginTop: 6 }} value={appointmentSearchText} onChange={(e) => setAppointmentSearchText(e.target.value)} placeholder="Client, agent, phone, type" />
            </div>
          </div>

          <div style={styles.grid3}>
            <div>
              <label style={{ fontWeight: 700 }}>Agent Calendar</label>
              <select style={{ ...styles.input, marginTop: 6 }} value={appointmentsAgentFilter} onChange={(e) => setAppointmentsAgentFilter(e.target.value)}>
                <option value="All">All Agents</option>
                {AGENTS.map((agent) => <option key={agent.name} value={agent.name}>{agent.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontWeight: 700 }}>Appointment Type</label>
              <select style={{ ...styles.input, marginTop: 6 }} value={appointmentsTypeFilter} onChange={(e) => { setAppointmentsTypeFilter(e.target.value); if (e.target.value !== "All") updateHousehold("reasonForCall", e.target.value); }}>
                <option value="All">All Appointment Types</option>
                {APPOINTMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontWeight: 700 }}>New Appointment Type</label>
              <select style={{ ...styles.input, marginTop: 6 }} value={household.reasonForCall} onChange={(e) => updateHousehold("reasonForCall", e.target.value)}>
                {APPOINTMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
          </div>

          <div style={{ ...styles.nav, marginTop: 12 }}>
            <button type="button" style={styles.primaryButton} onClick={() => { setAppointmentSearchFrom(today); setAppointmentSearchTo(today); setCalendarViewMode("Day View"); }}>Today</button>
            <button type="button" style={styles.button} onClick={() => setView("initialIntake")}>Schedule From Intake</button>
            <button type="button" style={styles.button} onClick={() => { setAppointmentSearchFrom(""); setAppointmentSearchTo(""); setAppointmentSearchText(""); }}>Clear Search</button>
            <button type="button" style={styles.button} onClick={openSipsGoogleCalendar}>Open Google Calendar</button>
            <button type="button" style={styles.button} onClick={() => setView("admin")}>Return to Admin</button>
          </div>
        </section>

        {(calendarViewMode === "Open Slots View" || calendarViewMode === "All Agents View" || calendarViewMode === "Agent View" || calendarViewMode === "Day View" || calendarViewMode === "Week View") ? (
          <section style={styles.card}>
            <h3 style={{ marginTop: 0 }}>Open Slots / Availability</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #d6dde8" }}>Date</th>
                    <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #d6dde8" }}>Agent</th>
                    <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #d6dde8" }}>Time Slots</th>
                  </tr>
                </thead>
                <tbody>
                  {dateList.slice(0, calendarViewMode === "Month View" ? 31 : 7).flatMap((date) => visibleAgents.map((agentName) => {
                    const slotStatus = APPOINTMENT_TIME_SLOTS.map((time) => ({ time, bookedEvent: getBookedSlotEvent(date, time, agentName) }));
                    const openSlotsCount = slotStatus.filter((slot) => !slot.bookedEvent).length;
                    return (
                      <tr key={`${date}-${agentName}`}>
                        <td style={{ padding: 8, borderBottom: "1px solid #eef2f6", fontWeight: 700 }}>{date}</td>
                        <td style={{ padding: 8, borderBottom: "1px solid #eef2f6" }}>{agentName}</td>
                        <td style={{ padding: 8, borderBottom: "1px solid #eef2f6" }}>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {slotStatus.map((slot) => (
                              slot.bookedEvent ? (
                                <button
                                  key={slot.time}
                                  type="button"
                                  title={`${slot.time} booked: ${slot.bookedEvent.clientName || slot.bookedEvent.title}`}
                                  style={{
                                    ...styles.button,
                                    padding: "7px 9px",
                                    fontSize: 12,
                                    background: "#fee2e2",
                                    border: "1px solid #ef4444",
                                    color: "#991b1b",
                                    cursor: "not-allowed",
                                    textDecoration: "line-through",
                                  }}
                                  onClick={() => setMessage(`${date} at ${slot.time} is booked for ${agentName}: ${slot.bookedEvent.clientName || slot.bookedEvent.title}.`)}
                                >
                                  {slot.time} Booked
                                </button>
                              ) : (
                                <button
                                  key={slot.time}
                                  type="button"
                                  style={{ ...styles.button, padding: "7px 9px", fontSize: 12, background: "#ecfdf5", border: "1px solid #10b981", color: "#065f46" }}
                                  onClick={() => bookSlot(date, slot.time, agentName)}
                                >
                                  {slot.time} Open
                                </button>
                              )
                            ))}
                            {!openSlotsCount ? <strong style={{ color: "#991b1b" }}>Fully booked</strong> : null}
                          </div>
                        </td>
                      </tr>
                    );
                  }))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <section style={styles.card}>
          <h3 style={{ marginTop: 0 }}>Booked Appointments</h3>
          {filteredEvents.length === 0 ? <p>No saved appointments match this view.</p> : null}
          {groupedByDate.map((group) => (
            <div key={group.date} style={{ marginTop: 12 }}>
              <h4 style={{ marginBottom: 8 }}>{group.date}</h4>
              {group.events.length === 0 ? <p style={{ marginTop: 0 }}>No appointments saved for this date.</p> : null}
              {group.events.map((event) => (
                <div key={event.id} style={{ border: "1px solid #d6dde8", borderRadius: 12, padding: 14, marginTop: 10 }}>
                  <strong>{event.title}</strong>
                  <p>{event.date} at {event.time} · {event.location}</p>
                  <p>Agent: {event.agent} · Type: {event.appointmentType || "-"}</p>
                  <p>{event.description?.split("\\n").slice(0, 4).join(" | ")}</p>
                  <div style={styles.nav}>
                    <button type="button" style={styles.button} onClick={() => { const match = households.find((h) => h.id === event.householdId); if (match) loadHousehold(match); setView("household"); }}>Open Household</button>
                    <button type="button" style={styles.button} onClick={() => { setSelectedAgent(event.agent || selectedAgent); setView("agent"); }}>Open Agent</button>
                    <button type="button" style={styles.button} onClick={() => setView("quickRater")}>Quick Rater</button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </section>
      </>
    );
  }



  function renderStatusPipeline() {
    const counts = PIPELINE_STATUS_OPTIONS.reduce((acc, status) => {
      acc[status] = getVisibleHouseholds().filter((item) => (item.businessStatus || item.status) === status).length;
      return acc;
    }, {});
    const filtered = getVisibleHouseholds().filter((item) => pipelineStatusFilter === "All" || (item.businessStatus || item.status) === pipelineStatusFilter);

    return (
      <section style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Status Pipeline</h2>
        <p style={{ marginTop: 0 }}>Track applications from written business through pending, issued, or declined.</p>
        <div style={{ marginBottom: 12 }}>
          {PIPELINE_STATUS_OPTIONS.map((status) => <span key={status} style={styles.pipelineBadge}>{status}: {counts[status] || 0}</span>)}
        </div>
        <div style={{ ...styles.grid2, marginBottom: 12 }}>
          <select style={styles.input} value={pipelineStatusFilter} onChange={(e) => setPipelineStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            {PIPELINE_STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <button type="button" style={styles.button} onClick={exportDashboardSheet}>Export Sheet Update</button>
        </div>
        {filtered.length === 0 ? <p>No records in this status.</p> : null}
        {filtered.map((item) => (
          <div key={item.id} style={{ border: "1px solid #d6dde8", borderRadius: 12, padding: 14, marginTop: 10 }}>
            <div style={styles.grid3}>
              <div><strong>{fullName(item.client)}</strong><br />{item.client?.phone || "No phone"}</div>
              <select style={styles.input} value={item.businessStatus || item.status || "New"} onChange={(e) => updateSavedHousehold(item.id, "businessStatus", e.target.value)}>
                {BUSINESS_STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {PIPELINE_STATUS_OPTIONS.map((status) => <button key={status} type="button" style={{ ...styles.button, padding: "8px 9px", fontSize: 12 }} onClick={() => advanceSavedApplication(item.id, status)}>{status.replace(" Business", "")}</button>)}
              </div>
              <input style={styles.input} value={item.policyNumber || ""} onChange={(e) => updateSavedHousehold(item.id, "policyNumber", e.target.value)} placeholder="Policy Number" />
              <input style={styles.input} value={item.carrier || item.client?.currentCarrier || ""} onChange={(e) => updateSavedHousehold(item.id, "carrier", e.target.value)} placeholder="Carrier" />
              <input style={styles.input} value={item.applicationDate || ""} onChange={(e) => updateSavedHousehold(item.id, "applicationDate", e.target.value)} placeholder="Application Date" />
              <select style={styles.input} value={item.assignedAgent || "Admin"} onChange={(e) => updateSavedHousehold(item.id, "assignedAgent", e.target.value)}>
                {AGENTS.map((agent) => <option key={agent.name} value={agent.name}>{agent.name}</option>)}
              </select>
            </div>
            <textarea style={{ ...styles.textarea, marginTop: 10, minHeight: 70 }} value={item.notes || ""} onChange={(e) => updateSavedHousehold(item.id, "notes", e.target.value)} placeholder="Status notes / application updates" />
            {getRecordAlerts(item).length ? <div style={{ marginTop: 10, padding: 10, borderRadius: 10, background: "#fff7ed", border: "1px solid #fed7aa" }}><strong>Alerts:</strong> {getRecordAlerts(item).join(" | ")}</div> : null}
            <div style={{ ...styles.nav, marginTop: 10 }}>
              <button type="button" style={styles.button} onClick={() => { loadHousehold(item); setView("household"); }}>Open Household</button>
              <button type="button" style={styles.button} onClick={() => { loadHousehold(item); setView("initialIntake"); }}>Schedule Follow Up</button>
            </div>
          </div>
        ))}
      </section>
    );
  }

  function renderCurrentClients() {
    const search = currentClientSearch.toLowerCase();
    const rateClients = getVisibleHouseholds().filter((item) => {
      const text = `${fullName(item.client)} ${item.client?.phone || ""} ${item.client?.email || ""} ${item.carrier || ""} ${item.policyNumber || ""}`.toLowerCase();
      const matchesSearch = !search || text.includes(search);
      const matchesCall = rateCallFilter === "All" || (item.callStatus || "Not Called") === rateCallFilter;
      const isCurrentClient = item.status === "Rate Increase Call" || item.businessStatus === "Rate Increase Call" || item.rateIncreaseDate || item.rateIncreaseAmount;
      return matchesSearch && matchesCall && isCurrentClient;
    });

    return (
      <section style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Current Clients — Rate Increase Calls</h2>
        <p style={{ marginTop: 0 }}>Upload an Excel-saved CSV to create phone-call records for clients with upcoming rate increases.</p>
        <div style={styles.nav}>
          <button type="button" style={styles.primaryButton} onClick={downloadCurrentClientSheetTemplate}>Download Sheet Template</button>
          <label style={{ ...styles.button, display: "inline-block" }}>
            Upload Excel / CSV
            <input type="file" accept=".csv,.txt" onChange={handleCurrentClientUpload} style={{ display: "none" }} />
          </label>
          <button type="button" style={styles.button} onClick={exportDashboardSheet}>Export Updated Sheet</button>
        </div>
        <div style={{ ...styles.grid3, marginTop: 12 }}>
          <input style={styles.input} value={currentClientSearch} onChange={(e) => setCurrentClientSearch(e.target.value)} placeholder="Search name, phone, carrier, policy" />
          <select style={styles.input} value={rateCallFilter} onChange={(e) => setRateCallFilter(e.target.value)}>
            <option value="All">All Call Statuses</option>
            {RATE_INCREASE_CALL_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
          <button type="button" style={styles.button} onClick={() => setView("calendar")}>View Calendar Availability</button>
        </div>
        {rateClients.length === 0 ? <p>No rate-increase call records loaded yet.</p> : null}
        {rateClients.map((item) => (
          <div key={item.id} style={{ border: "1px solid #d6dde8", borderRadius: 12, padding: 14, marginTop: 10 }}>
            <div style={styles.grid3}>
              <div><strong>{fullName(item.client)}</strong><br />{item.client?.phone || "No phone"}<br />{item.client?.email || "No email"}</div>
              <div><strong>Carrier:</strong> {item.carrier || item.client?.currentCarrier || "-"}<br /><strong>Policy:</strong> {item.policyNumber || "-"}<br /><strong>Premium:</strong> {item.currentPremium || item.client?.currentMedSuppPremium || "-"}</div>
              <div><strong>Increase Date:</strong> {item.rateIncreaseDate || "-"}<br /><strong>Increase Amount:</strong> {item.rateIncreaseAmount || "-"}</div>
              <select style={styles.input} value={item.callStatus || "Not Called"} onChange={(e) => updateSavedHousehold(item.id, "callStatus", e.target.value)}>
                {RATE_INCREASE_CALL_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              <input style={styles.input} value={item.nextCallDate || ""} onChange={(e) => updateSavedHousehold(item.id, "nextCallDate", e.target.value)} placeholder="Next Call Date" />
              <select style={styles.input} value={item.assignedAgent || "Admin"} onChange={(e) => updateSavedHousehold(item.id, "assignedAgent", e.target.value)}>
                {AGENTS.map((agent) => <option key={agent.name} value={agent.name}>{agent.name}</option>)}
              </select>
            </div>
            <textarea style={{ ...styles.textarea, marginTop: 10, minHeight: 70 }} value={item.notes || ""} onChange={(e) => updateSavedHousehold(item.id, "notes", e.target.value)} placeholder="Call notes / rate increase notes" />
            <div style={{ ...styles.nav, marginTop: 10 }}>
              <button type="button" style={styles.primaryButton} onClick={() => { loadHousehold(item); setAppointmentLocation("Phone Call"); setView("initialIntake"); }}>Set Phone Call</button>
              <button type="button" style={styles.button} onClick={() => { loadHousehold(item); setView("household"); }}>Open Client</button>
              <button type="button" style={styles.button} onClick={() => { loadHousehold(item); setView("calendar"); }}>Check Calendar</button>
            </div>
          </div>
        ))}
      </section>
    );
  }

  function renderClients() {
    const filteredHouseholds = getVisibleHouseholds().filter((item) => {
      return activeUserRole === "Agent" ? item.assignedAgent === activeUserName : (clientsAgentFilter === "All" || item.assignedAgent === clientsAgentFilter);
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
    const todaysEvents = getVisibleEvents().filter((event) => event.date === today);
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
    const agentEvents = getVisibleEvents().filter((event) => event.agent === selectedAgent);
    const agentHouseholds = getVisibleHouseholds().filter((item) => item.assignedAgent === selectedAgent);

    return (
      <>
<div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 14 }}>
  <section style={styles.card}>
    <h3 style={{ marginTop: 0 }}>Agent Tools</h3>

    {["Client", "CSG", "Company Login", "Client Summary", "Email Forms"].map((tab) => (
      <button
        key={tab}
        type="button"
        style={{
          ...(agentTab === tab ? styles.primaryButton : styles.button),
          width: "100%",
          marginBottom: 8,
          textAlign: "left",
        }}
        onClick={() => setAgentTab(tab)}
      >
        {tab}
      </button>
    ))}

    <hr />

    <button type="button" style={{ ...styles.button, width: "100%", marginBottom: 8 }} onClick={() => openAppointmentsForType(household.reasonForCall)}>Open Appointments</button>
    <button type="button" style={{ ...styles.button, width: "100%", marginBottom: 8 }} onClick={openSipsGoogleCalendar}>Open Google Appointments</button>
    <button type="button" style={{ ...styles.button, width: "100%", marginBottom: 8 }} onClick={() => navigator.clipboard?.writeText(JSON.stringify(buildIntegrationAutofillData(household).medicarePro, null, 2))}>Copy Medicare Pro Fields</button>
    <button type="button" style={{ ...styles.button, width: "100%", marginBottom: 8 }} onClick={() => navigator.clipboard?.writeText(JSON.stringify(buildIntegrationAutofillData(household).monday, null, 2))}>Copy Monday Fields</button>
    <button type="button" style={{ ...styles.button, width: "100%", marginBottom: 8 }} onClick={() => navigator.clipboard?.writeText(JSON.stringify(buildIntegrationAutofillData(household).csgActuarial, null, 2))}>Copy CSG Actuarial Fields</button>
    <button type="button" style={{ ...styles.primaryButton, width: "100%", marginBottom: 8 }} onClick={() => navigator.clipboard?.writeText(JSON.stringify(buildIntegrationAutofillData(household), null, 2))}>Copy All Autofill Data</button>
    <button type="button" style={{ ...styles.button, width: "100%", marginBottom: 8 }} onClick={() => downloadIntegrationCsv(household)}>Export Medicare Pro CSV</button>
    <button type="button" style={{ ...styles.button, width: "100%", marginBottom: 8 }} onClick={() => window.open("https://www.monday.com/", "_blank")}>Open Monday</button>
    <button type="button" style={{ ...styles.button, width: "100%", marginBottom: 8 }} onClick={() => openCsgRaterForPerson(household.client, "Client")}>Open CSG - Client</button>
    <button type="button" style={{ ...styles.button, width: "100%" }} onClick={() => openCsgRaterForPerson(household.spouse, "Spouse")}>Open CSG - Spouse</button>
  </section>

  <div>
        {agentTab === "Client" && (
  <section style={styles.card}>
    <h3>Client</h3>
    <p><strong>Name:</strong> {fullName(household.client)}</p>
    <p><strong>Phone:</strong> {household.client.phone || "-"}</p>
    <p><strong>Email:</strong> {household.client.email || "-"}</p>
    <p><strong>Age:</strong> {calculateAge(household.client.birthdate) || "-"}</p>
    <p><strong>Current Premium:</strong> {household.currentPremium || household.client.currentMedSuppPremium || "-"}</p>
  </section>
)}

{agentTab === "CSG" && (
  <section style={styles.card}>
    <h3>CSG</h3>
    <button style={styles.primaryButton} onClick={() => openCsgRaterForPerson(household.client, "Client")}>
      Open CSG - Client
    </button>
  </section>
)}

{agentTab === "Company Login" && (
  <section style={styles.card}>
    <h3>Company Login</h3>

    <select
      style={styles.input}
      value={selectedCompanyLogin}
      onChange={(e) => setSelectedCompanyLogin(e.target.value)}
    >
      <option value="">Select company login</option>
      {COMPANY_LOGIN_LINKS.map((company) => (
        <option key={company.name} value={company.url}>
          {company.name}
        </option>
      ))}
    </select>

    <div style={{ marginTop: 12 }}>
      <button
        type="button"
        style={styles.primaryButton}
        disabled={!selectedCompanyLogin}
        onClick={() => window.open(selectedCompanyLogin, "_blank", "noopener,noreferrer")}
      >
        Open Company Login
  <button
  type="button"
  style={styles.primaryButton}
  disabled={!selectedCompanyLogin}
  onClick={() => {
    if (!selectedCompanyLogin) {
      setMessage("Select a company first.");
      return;
    }

    if (selectedCompanyLogin === "NO_LINK") {
      setMessage("No login link is on file for this company yet.");
      return;
    }

    window.open(selectedCompanyLogin, "_blank", "noopener,noreferrer");
  }}
>
  Open Company Login
</button>
{agentTab === "Client Summary" && (
  <section style={styles.card}>
    <h3>Client Summary / Closing Tool</h3>

    <div style={styles.grid2}>
      <div>
        <h4>Client</h4>
        <p><strong>Name:</strong> {fullName(household.client)}</p>
        <p><strong>DOB:</strong> {household.client.birthdate || "-"}</p>
        <p><strong>Age:</strong> {calculateAge(household.client.birthdate) || "-"}</p>
        <p><strong>Phone:</strong> {household.client.phone || "-"}</p>
        <p><strong>Email:</strong> {household.client.email || "-"}</p>
        <p><strong>Current Carrier:</strong> {household.client.currentCarrier || "-"}</p>
        <p><strong>Current Premium:</strong> {household.currentPremium || household.client.currentMedSuppPremium || "-"}</p>
        <p><strong>Proposed Carrier:</strong> {household.client.proposedCarrier || "-"}</p>
        <p><strong>Proposed Premium:</strong> {household.client.proposedMedSuppPremium || household.client.csgProposedPremium || "-"}</p>
      </div>

      <div>
        <h4>Spouse</h4>
        <p><strong>Name:</strong> {personHasData(household.spouse) ? fullName(household.spouse) : "-"}</p>
        <p><strong>DOB:</strong> {household.spouse.birthdate || "-"}</p>
        <p><strong>Age:</strong> {calculateAge(household.spouse.birthdate) || "-"}</p>
        <p><strong>Current Carrier:</strong> {household.spouse.currentCarrier || "-"}</p>
        <p><strong>Current Premium:</strong> {household.spouse.currentMedSuppPremium || "-"}</p>
        <p><strong>Proposed Carrier:</strong> {household.spouse.proposedCarrier || "-"}</p>
        <p><strong>Proposed Premium:</strong> {household.spouse.proposedMedSuppPremium || household.spouse.csgProposedPremium || "-"}</p>
      </div>
    </div>

    <hr />

    <p><strong>Current Coverage:</strong> {household.currentCoverage || "-"}</p>
    <p><strong>Reason for Call:</strong> {household.reasonForCall || "-"}</p>
    <p><strong>Assigned Agent:</strong> {household.assignedAgent || "-"}</p>
    <p><strong>Notes:</strong> {household.notes || "-"}</p>

    <div style={styles.nav}>
      <button type="button" style={styles.primaryButton} onClick={() => window.print()}>
        Print / Save PDF
      </button>
      <button type="button" style={styles.button} onClick={() => setView("calculator")}>
        Open Calculator
      </button>
      <button type="button" style={styles.button} onClick={() => setView("quickRater")}>
        Open Quick Rater
      </button>
    </div>
  </section>
)}

{agentTab === "Email Forms" && (
  <section style={styles.card}>
    <h3>Email Forms</h3>

    <div style={styles.nav}>
      <button type="button" style={styles.button} onClick={() => setSelectedEmailTemplate("Appointment Reminder")}>
        Appointment Reminder
      </button>
      <button type="button" style={styles.button} onClick={() => setSelectedEmailTemplate("Plan Review")}>
        Plan Review
      </button>
      <button type="button" style={styles.button} onClick={() => setSelectedEmailTemplate("L564 Employer Form")}>
        L564 Employer Form
      </button>
      <button type="button" style={styles.button} onClick={() => setSelectedEmailTemplate("Policy Review Documents")}>
        Policy Review Documents
      </button>
    </div>

    <div style={styles.nav}>
      <button type="button" style={styles.button} onClick={refreshEmailTemplateWithLatestData}>
        Refresh Email Template
      </button>
      <button type="button" style={styles.primaryButton} onClick={copyEmailPackage}>
        Copy Email Package
      </button>
      <button type="button" style={styles.button} onClick={openEmailDraft}>
        Open Email Draft
      </button>
    </div>
  </section>
)}
        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Agent Page</h2>
          <div style={styles.nav}>
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

</div>

</>
);
}
  function renderIntegrations() {
    return (
      <>
        <section style={styles.card}>
          <h2 style={{ marginTop: 0 }}>Integrations / Export Center</h2>
          <p style={{ marginTop: 0 }}>Copy or export Medicare Pro, Monday, and CSG fields from the current household.</p>
        </section>
        <IntegrationAutofillPanel household={household} />
      </>
    );
  }

  function renderAccessRestricted() {
    return (
      <section style={styles.card}>
        <h2 style={{ marginTop: 0 }}>Access Restricted</h2>
        <p>This page is not visible in the selected agent view. Switch to Senior Agent/Admin view to see this area.</p>
        <button type="button" style={styles.primaryButton} onClick={() => { setActiveUserRole("Admin"); setView("permissions"); }}>Open Role Access</button>
      </section>
    );
  }

  return (
    <main style={styles.layout}>
      <SidebarNav view={view} setView={safeSetView} message={message} activeUserRole={activeUserRole} activeUserName={activeUserName} setActiveUserRole={setActiveUserRole} setActiveUserName={setActiveUserName} />
      <section style={styles.mainPanel}>
        <header style={styles.header}>
          <h1 style={{ margin: 0 }}>SIPS Connect</h1>
          <p style={{ marginBottom: 0 }}>Compact command center with Admin/Agent visibility controls. Current role: {activeUserRole}. {activeUserRole === "Agent" ? "Showing only " + activeUserName + " records." : "Full agency access."}</p>
        </header>

        {!canSeeView(view) ? renderAccessRestricted() : null}
        {canSeeView(view) && view === "dashboard" && renderDashboard()}
        {canSeeView(view) && view === "admin" && renderAdmin()}
        {canSeeView(view) && view === "initialIntake" && renderInitialIntake()}
        {canSeeView(view) && view === "leadCapture" && renderLeadCapture()}
        {canSeeView(view) && view === "calendar" && renderCalendar()}
        {canSeeView(view) && view === "clients" && renderClients()}
        {canSeeView(view) && view === "currentClients" && renderCurrentClients()}
        {canSeeView(view) && view === "dailyTasks" && renderDailyTasks()}
        {canSeeView(view) && view === "performance" && renderPerformance()}
        {canSeeView(view) && view === "status" && renderStatusPipeline()}
        {canSeeView(view) && view === "today" && renderToday()}
        {canSeeView(view) && view === "household" && renderHousehold()}
        {canSeeView(view) && view === "agent" && renderAgentPage()}
        {canSeeView(view) && view === "quickRater" && renderQuickRater()}
        {canSeeView(view) && view === "calculator" && renderCalculator()}
        {canSeeView(view) && view === "integrations" && renderIntegrations()}
        {canSeeView(view) && view === "permissions" && renderPermissions()}
      </section>
    </main>
  );
}
