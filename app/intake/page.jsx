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
    <main style={{ padding: "32px", fontFamily: "Arial, sans-serif", maxWidth: "1100px", margin: "0 auto" }}>
      <h1>New Intake</h1>
      <p>Client and spouse intake form.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "24px", marginTop: "24px" }}>
        <section style={boxStyle}>
          <h2 style={{ marginTop: 0 }}>Client</h2>

          <div style={grid2}>
            <input
              value={client.firstName}
              onChange={(e) => updateClient("firstName", e.target.value)}
              placeholder="Client First Name"
              style={inputStyle}
            />
            <input
              value={client.lastName}
              onChange={(e) => updateClient("lastName", e.target.value)}
              placeholder="Client Last Name"
              style={inputStyle}
            />
          </div>

          <div style={grid2}>
            <input
              value={client.phone}
              onChange={(e) => updateClient("phone", e.target.value)}
              placeholder="Client Phone"
              style={inputStyle}
            />
            <input
              value={client.email}
              onChange={(e) => updateClient("email", e.target.value)}
              placeholder="Client Email"
              style={inputStyle}
            />
          </div>

          <div style={grid2}>
            <input
              value={client.birthdate}
              onChange={(e) => updateClient("birthdate", e.target.value)}
              placeholder="Client Birthdate"
              style={inputStyle}
            />
            <input value={clientAge} readOnly placeholder="Client Age" style={inputStyle} />
          </div>

          <div style={grid3}>
            <select value={client.sex} onChange={(e) => updateClient("sex", e.target.value)} style={inputStyle}>
              <option value="">Sex</option>
              {sexOptions.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>

            <select value={client.tobacco} onChange={(e) => updateClient("tobacco", e.target.value)} style={inputStyle}>
              <option value="">Tobacco</option>
              {tobaccoOptions.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>

            <select
              value={client.coverageType}
              onChange={(e) => updateClient("coverageType", e.target.value)}
              style={inputStyle}
            >
              <option value="">Coverage Type</option>
              {coverageTypeOptions.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </div>
        </section>

        <section style={boxStyle}>
          <h2 style={{ marginTop: 0 }}>Spouse</h2>

          <div style={grid2}>
            <input
              value={spouse.firstName}
              onChange={(e) => updateSpouse("firstName", e.target.value)}
              placeholder="Spouse First Name"
              style={inputStyle}
            />
            <input
              value={spouse.lastName}
              onChange={(e) => updateSpouse("lastName", e.target.value)}
              placeholder="Spouse Last Name"
              style={inputStyle}
            />
          </div>

          <div style={grid2}>
            <input
              value={spouse.phone}
              onChange={(e) => updateSpouse("phone", e.target.value)}
              placeholder="Spouse Phone"
              style={inputStyle}
            />
            <input
              value={spouse.email}
              onChange={(e) => updateSpouse("email", e.target.value)}
              placeholder="Spouse Email"
              style={inputStyle}
            />
          </div>

          <div style={grid2}>
            <input
              value={spouse.birthdate}
              onChange={(e) => updateSpouse("birthdate", e.target.value)}
              placeholder="Spouse Birthdate"
              style={inputStyle}
            />
            <input value={spouseAge} readOnly placeholder="Spouse Age" style={inputStyle} />
          </div>

          <div style={grid3}>
            <select value={spouse.sex} onChange={(e) => updateSpouse("sex", e.target.value)} style={inputStyle}>
              <option value="">Sex</option>
              {sexOptions.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>

            <select value={spouse.tobacco} onChange={(e) => updateSpouse("tobacco", e.target.value)} style={inputStyle}>
              <option value="">Tobacco</option>
              {tobaccoOptions.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>

            <select
              value={spouse.coverageType}
              onChange={(e) => updateSpouse("coverageType", e.target.value)}
              style={inputStyle}
            >
              <option value="">Coverage Type</option>
              {coverageTypeOptions.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </div>
        </section>

        <section style={boxStyle}>
          <h2 style={{ marginTop: 0 }}>Admin</h2>

          <div style={grid2}>
            <select value={agent} onChange={(e) => setAgent(e.target.value)} style={inputStyle}>
              <option value="">Assign Agent</option>
              {agentOptions.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" style={inputStyle} />
          </div>
        </section>

        <div style={{ display: "flex", gap: "12px" }}>
          <button type="submit" style={buttonStyle}>Save Intake</button>
          <a href="/dashboard" style={linkStyle}>Return to Dashboard</a>
        </div>

        {message ? <p>{message}</p> : null}
      </form>
    </main>
  );
}

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

const linkStyle = {
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #c9d1d9",
  textDecoration: "none",
  color: "inherit",
  display: "inline-block",
};
