"use client";

import { useState } from "react";

export default function IntakePage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    notes: "",
  });

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert("Intake saved locally for now. Next step is connecting this form to your client database.");
  }

  return (
    <main style={{ padding: "32px", fontFamily: "Arial, sans-serif", maxWidth: "640px" }}>
      <h1>New Intake</h1>
      <p>Enter new client information below.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px", marginTop: "24px" }}>
        <input
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={updateField}
          style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px" }}
          required
        />
        <input
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={updateField}
          style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px" }}
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={updateField}
          style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px" }}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={updateField}
          style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px" }}
        />
        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={updateField}
          rows="5"
          style={{ padding: "12px", border: "1px solid #ccc", borderRadius: "8px" }}
        />
        <button type="submit" style={{ padding: "12px", borderRadius: "8px", cursor: "pointer" }}>
          Save Intake
        </button>
      </form>
    </main>
  );
}
