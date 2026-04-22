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
];

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

export default function IntakePage() {
  const [client, setClient] = useState({ ...blankPerson });
  const [spouse, setSpouse] = useState({ ...blankPerson });
  const [agent, setAgent] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(null);

  const clientAge = useMemo(() => calculateAge(client.birthdate), [client.birthdate]);
  const spouseAge = useMemo(() => calculateAge(spouse.birthdate), [spouse.birthdate]);

  const clientPhoneMatches = client.phone === client.phoneConfirm;
  const spousePhoneMatches = spouse.phone === spouse.phoneConfirm;

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
    return Boolean(spouse.firstName || spouse.lastName);
  }

  async function handleSubmit(e) {
    e.preventDefault();

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

    const { data: householdData, error } = await supabase
      .from("households")
      .insert([
        {
          owner_user_id: userId,
          assigned_agent: agent,
          notes,
          reason_for_call: reason,
        },
      ])
      .select()
      .single();

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    const householdId = householdData.id;

    await supabase.from("people").insert([
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
    ]);

    if (spouseHasData()) {
      await supabase.from("people").insert([
        {
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
        },
      ]);
    }

    await supabase.from("intakes").insert([
      {
        household_id: householdId,
        created_by: userId,
        notes,
      },
    ]);

    setMessage("Intake saved successfully.");
    setSaving(false);
  }

  return (
    <main style={{ padding: "32px", fontFamily: "Arial" }}>
      <h1>New Intake</h1>

      <h2>Admin</h2>

      <select value={agent} onChange={(e) => setAgent(e.target.value)}>
        <option value="">Assign Agent</option>
        {agentOptions.map((a) => (
          <option key={a}>{a}</option>
        ))}
      </select>

      <select value={reason} onChange={(e) => setReason(e.target.value)}>
        <option value="">Reason for Call</option>
        {reasonOptions.map((r) => (
          <option key={r}>{r}</option>
        ))}
      </select>

      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button onClick={handleSubmit} disabled={saving}>
        {saving ? "Saving..." : "Save Intake"}
      </button>

      {message && <p>{message}</p>}
    </main>
  );
}
