// SIPS Agent Dashboard Widgets + Cleanup Build

const ROLE_ACCESS = {
  Agent: ["agentDashboard", "quickRater", "calendar", "appointments", "medicarePro", "emailTemplates", "csgActuarial", "companyDirectory", "household", "calculator"],
  "Senior Agent": "FULL",
  Admin: "FULL",
};

function canAccessView(currentRole, view) {
  if (currentRole === "Admin" || currentRole === "Senior Agent") return true;
  return ROLE_ACCESS.Agent.includes(view);
}

function canSeeRecord(currentRole, currentAgentName, record) {
  if (currentRole === "Admin" || currentRole === "Senior Agent") return true;
  return (record.assignedAgent || record.agent || "") === currentAgentName;
}

function getTodayISODate() {
  return new Date().toISOString().slice(0, 10);
}

function AgentActionCard({ title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "white",
        border: "1px solid #d6dde8",
        borderRadius: 16,
        padding: 18,
        textAlign: "left",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(15, 42, 68, 0.06)",
      }}
    >
      <div style={{ fontSize: 19, fontWeight: 800, color: "#0f2a44", marginBottom: 6 }}>
        {title}
      </div>
      <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.45 }}>
        {subtitle}
      </div>
    </button>
  );
}

const agentMetricCardStyle = {
  background: "white",
  border: "1px solid #d6dde8",
  borderRadius: 16,
  padding: 16,
  boxShadow: "0 2px 8px rgba(15, 42, 68, 0.06)",
};

const agentMetricLabelStyle = {
  fontSize: 13,
  color: "#475569",
  marginBottom: 6,
};

const agentMetricNumberStyle = {
  fontSize: 32,
  fontWeight: 900,
  color: "#0f2a44",
};

const agentWidgetCardStyle = {
  background: "white",
  border: "1px solid #d6dde8",
  borderRadius: 16,
  padding: 16,
  boxShadow: "0 2px 8px rgba(15, 42, 68, 0.06)",
  minHeight: 260,
};

const agentWidgetHeaderStyle = {
  margin: "0 0 12px",
  color: "#0f2a44",
};

const agentListItemStyle = {
  padding: "10px 0",
  borderBottom: "1px solid #eef2f6",
  fontSize: 14,
  lineHeight: 1.45,
};

const agentEmptyStyle = {
  color: "#64748b",
  fontSize: 14,
};

const agentSmallButtonStyle = {
  marginTop: 12,
  border: "1px solid #0f2a44",
  borderRadius: 10,
  padding: "10px 12px",
  background: "#0f2a44",
  color: "white",
  fontWeight: 800,
  cursor: "pointer",
  width: "100%",
};

function AgentTodayAppointments({ appointments, setView }) {
  return (
    <section style={agentWidgetCardStyle}>
      <h3 style={agentWidgetHeaderStyle}>My Appointments Today</h3>
      {appointments.length ? appointments.slice(0, 6).map((appt) => (
        <div key={appt.id || `${appt.date}-${appt.time}-${appt.clientName}`} style={agentListItemStyle}>
          <strong>{appt.time || "Time not set"} — {appt.clientName || appt.title || "Appointment"}</strong>
          <div>{appt.appointmentType || appt.reasonForCall || "Appointment"}</div>
          <div>{appt.clientPhone || appt.phone || ""}</div>
        </div>
      )) : (
        <p style={agentEmptyStyle}>No appointments scheduled for today.</p>
      )}
      <button type="button" style={agentSmallButtonStyle} onClick={() => setView("calendar")}>
        Open Calendar
      </button>
    </section>
  );
}

function AgentPendingBusiness({ records, setView }) {
  return (
    <section style={agentWidgetCardStyle}>
      <h3 style={agentWidgetHeaderStyle}>My Pending Business</h3>
      {records.length ? records.slice(0, 6).map((record) => (
        <div key={record.id || record.householdId || record.client?.phone} style={agentListItemStyle}>
          <strong>{record.client?.firstName || ""} {record.client?.lastName || record.clientName || "Client"}</strong>
          <div>Status: {record.status || record.businessStatus || "Pending"}</div>
          <div>Agent: {record.assignedAgent || record.agent || ""}</div>
        </div>
      )) : (
        <p style={agentEmptyStyle}>No pending or written business assigned.</p>
      )}
      <button type="button" style={agentSmallButtonStyle} onClick={() => setView("statusPipeline")}>
        Open Pipeline
      </button>
    </section>
  );
}

function AgentClientQuickList({ households, setView }) {
  return (
    <section style={agentWidgetCardStyle}>
      <h3 style={agentWidgetHeaderStyle}>My Clients</h3>
      {households.length ? households.slice(0, 6).map((household) => (
        <div key={household.id || household.client?.phone} style={agentListItemStyle}>
          <strong>{household.client?.firstName || ""} {household.client?.lastName || "Client"}</strong>
          <div>{household.client?.phone || "No phone listed"}</div>
          <div>{household.reasonForCall || household.status || ""}</div>
        </div>
      )) : (
        <p style={agentEmptyStyle}>No clients assigned yet.</p>
      )}
      <button type="button" style={agentSmallButtonStyle} onClick={() => setView("household")}>
        Open Household
      </button>
    </section>
  );
}

function AgentDashboardPage({
  currentRole,
  currentAgentName,
  households,
  events,
  businessRecords,
  setView,
}) {
  const today = getTodayISODate();

  const visibleEvents = (events || []).filter((event) =>
    canSeeRecord(currentRole, currentAgentName, event)
  );

  const myTodayAppointments = visibleEvents.filter((event) => event.date === today);

  const visibleHouseholds = (households || []).filter((household) =>
    canSeeRecord(currentRole, currentAgentName, household)
  );

  const visibleBusiness = (businessRecords || households || []).filter((record) =>
    canSeeRecord(currentRole, currentAgentName, record)
  );

  const myPendingBusiness = visibleBusiness.filter((record) => {
    const status = String(record.status || record.businessStatus || "").toLowerCase();
    return status.includes("pending") || status.includes("written");
  });

  return (
    <div style={{ padding: 24 }}>
      <section style={{
        background: "#0f2a44",
        color: "white",
        borderRadius: 18,
        padding: 22,
        marginBottom: 18,
      }}>
        <h1 style={{ margin: 0 }}>Agent Dashboard</h1>
        <p style={{ margin: "8px 0 0", opacity: 0.9 }}>
          {currentRole === "Admin" || currentRole === "Senior Agent"
            ? "Full agency visibility enabled."
            : `Showing records assigned to ${currentAgentName}.`}
        </p>
      </section>

      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: 14,
        marginBottom: 18,
      }}>
        <div style={agentMetricCardStyle}>
          <div style={agentMetricLabelStyle}>Today’s Appointments</div>
          <div style={agentMetricNumberStyle}>{myTodayAppointments.length}</div>
        </div>
        <div style={agentMetricCardStyle}>
          <div style={agentMetricLabelStyle}>Pending / Written</div>
          <div style={agentMetricNumberStyle}>{myPendingBusiness.length}</div>
        </div>
        <div style={agentMetricCardStyle}>
          <div style={agentMetricLabelStyle}>My Clients</div>
          <div style={agentMetricNumberStyle}>{visibleHouseholds.length}</div>
        </div>
        <div style={agentMetricCardStyle}>
          <div style={agentMetricLabelStyle}>Role</div>
          <div style={{ ...agentMetricNumberStyle, fontSize: 22 }}>{currentRole}</div>
        </div>
      </section>

      <section style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: 14,
        marginBottom: 18,
      }}>
        <AgentActionCard title="Quick Rater" subtitle="Quote client/spouse premiums and update savings." onClick={() => setView("quickRater")} />
        <AgentActionCard title="Appointments" subtitle="View assigned calls, meetings, and follow-ups." onClick={() => setView("appointments")} />
        <AgentActionCard title="Google Calendar" subtitle="Open the live calendar in a new tab." onClick={() => window.open(SIPS_GOOGLE_CALENDAR_URL, "_blank", "noopener,noreferrer")} />
        <AgentActionCard title="Medicare Pro" subtitle="Open Medicare Pro client lookup / entry." onClick={() => setView("medicarePro")} />
        <AgentActionCard title="Email Templates" subtitle="Use client follow-up and document emails." onClick={() => setView("emailTemplates")} />
        <AgentActionCard title="CSG Actuarial" subtitle="Open rater and compare carrier pricing." onClick={() => setView("csgActuarial")} />
        <AgentActionCard title="Company Directory" subtitle="Carrier contacts, underwriting notes, and quick links." onClick={() => setView("companyDirectory")} />
        <AgentActionCard title="Calculator" subtitle="Review premium comparison and savings." onClick={() => setView("calculator")} />
      </section>

      <section style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 16,
      }}>
        <AgentTodayAppointments appointments={myTodayAppointments} setView={setView} />
        <AgentPendingBusiness records={myPendingBusiness} setView={setView} />
        <AgentClientQuickList households={visibleHouseholds} setView={setView} />
      </section>
    </div>
  );
}

function CompanyDirectoryPage() {
  const [search, setSearch] = useState("");

  const companies = [
    { name: "Aetna / American Continental", type: "Medicare Supplement", phone: "Add carrier phone", notes: "Good for competitive Plan G review. Add underwriting notes here." },
    { name: "Mutual of Omaha", type: "Medicare Supplement", phone: "Add carrier phone", notes: "Add underwriting and household discount notes." },
    { name: "WoodmenLife", type: "Medicare Supplement", phone: "Add carrier phone", notes: "Add underwriting notes." },
    { name: "Bankers Fidelity", type: "Medicare Supplement", phone: "Add carrier phone", notes: "Add underwriting notes." },
    { name: "Aflac", type: "Ancillary", phone: "Add carrier phone", notes: "Cancer, dental, and ancillary support." },
    { name: "Humana", type: "Medicare / Ancillary", phone: "Add carrier phone", notes: "Add plan and service notes." },
    { name: "UnitedHealthcare / AARP", type: "Medicare Supplement", phone: "Add carrier phone", notes: "Add appointment/service notes." },
  ];

  const filtered = companies.filter((company) =>
    `${company.name} ${company.type} ${company.notes}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 24 }}>
      <section style={{ background: "#0f2a44", color: "white", borderRadius: 18, padding: 22, marginBottom: 18 }}>
        <h1 style={{ margin: 0 }}>Company Directory</h1>
        <p style={{ margin: "8px 0 0", opacity: 0.9 }}>Carrier contacts, notes, underwriting reminders, and agent quick links.</p>
      </section>

      <input
        style={{ width: "100%", boxSizing: "border-box", padding: "12px 13px", border: "1px solid #c8d1dc", borderRadius: 10, fontSize: 14, marginBottom: 16 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search company, product type, or notes..."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 }}>
        {filtered.map((company) => (
          <section key={company.name} style={{ background: "white", border: "1px solid #d6dde8", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(15, 42, 68, 0.06)" }}>
            <h3 style={{ marginTop: 0, color: "#0f2a44" }}>{company.name}</h3>
            <div><strong>Type:</strong> {company.type}</div>
            <div><strong>Phone:</strong> {company.phone}</div>
            <p>{company.notes}</p>
            <button type="button" style={agentSmallButtonStyle}>Open Carrier Notes</button>
          </section>
        ))}
      </div>
    </div>
  );
}

const AGENT_SIDEBAR_VIEWS = [
  { key: "agentDashboard", label: "Agent Dashboard" },
  { key: "quickRater", label: "Quick Rater" },
  { key: "calendar", label: "Calendar" },
  { key: "appointments", label: "Appointments" },
  { key: "medicarePro", label: "Medicare Pro" },
  { key: "emailTemplates", label: "Email Templates" },
  { key: "csgActuarial", label: "CSG Actuarial" },
  { key: "companyDirectory", label: "Company Directory" },
  { key: "calculator", label: "Calculator" },
];

function routeIntakeToAdminAndAgent({ household, setHouseholds, setAgentInbox }) {
  const record = {
    ...household,
    id: household.id || `HH-${Date.now()}`,
    createdAt: household.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  setHouseholds((prev) => {
    const withoutDuplicate = (prev || []).filter((item) => item.id !== record.id);
    return [record, ...withoutDuplicate];
  });

  setAgentInbox((prev) => {
    const assigned = record.assignedAgent || "Admin";
    const currentList = prev?.[assigned] || [];
    const withoutDuplicate = currentList.filter((item) => item.id !== record.id);
    return {
      ...(prev || {}),
      [assigned]: [record, ...withoutDuplicate],
    };
  });

  return record;
}
