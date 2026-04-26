// SIPS Calendar Cross-Over Fix
// Purpose: make ALL important intake, premium, quick rater, calculator, client, spouse,
// coverage, and ancillary information save into the calendar appointment record.
//
// Replace your current createCalendarEvent() function with this version.
// This fixes the issue where only basic appointment info and current premium were crossing over.

function buildCalendarCrossOverRecord(household, appointmentDate, appointmentTime, appointmentDuration, appointmentLocation) {
  const ancillary = household.ancillary || blankAncillary;
  const clientSnapshot = calculatePremiumSnapshot(household.client, "client", ancillary);
  const spouseSnapshot = calculatePremiumSnapshot(household.spouse, "spouse", ancillary);

  const householdCurrentMonthly = clientSnapshot.currentMonthly + spouseSnapshot.currentMonthly;
  const householdProposedMonthly = clientSnapshot.proposedMonthly + spouseSnapshot.proposedMonthly;
  const householdMonthlySavings = householdCurrentMonthly - householdProposedMonthly;
  const householdAnnualSavings = householdMonthlySavings * 12;

  const client = household.client || {};
  const spouse = household.spouse || {};

  const ancillaryRows = Object.keys(ancillary).map((product) => {
    const row = ancillary[product] || {};
    return {
      product,
      clientCurrent: row.clientCurrent || "",
      clientProposed: row.clientProposed || "",
      spouseCurrent: row.spouseCurrent || "",
      spouseProposed: row.spouseProposed || "",
      clientAction: row.clientAction || "",
      spouseAction: row.spouseAction || "",
    };
  });

  return {
    householdId: household.id || selectedHouseholdId || "",
    assignedAgent: household.assignedAgent || "Admin",
    status: household.status || "New",
    referredBy: household.referredBy || "",
    reasonForCall: household.reasonForCall || "",
    appointmentDate,
    appointmentTime,
    appointmentDuration,
    appointmentLocation,

    client: {
      firstName: client.firstName || "",
      lastName: client.lastName || "",
      fullName: fullName(client),
      phone: client.phone || "",
      email: client.email || "",
      birthdate: client.birthdate || "",
      age: calculateAge(client.birthdate) || client.age || "",
      address: client.address || "",
      city: client.city || "",
      state: client.state || "",
      zip: client.zip || "",
      health: client.health || "",
      status: client.status || "",
      tobacco: client.tobacco || "",
      currentCoverage: client.coverageType || household.currentCoverage || "",
      currentCarrier: client.currentCarrier || "",
      currentPlan: client.currentPlan || "",
      currentMedSuppPremium: client.currentMedSuppPremium || "",
      proposedCarrier: client.proposedCarrier || "",
      proposedPlan: client.proposedPlan || "",
      proposedPremiumSource: client.proposedPremiumSource || "",
      proposedMedSuppPremium: getEffectiveProposed(client) || "",
      csgSelectedCompany: client.csgSelectedCompany || "",
      csgProposedPremium: client.csgProposedPremium || "",
      manualOverrideProposedRate: client.manualOverrideProposedRate || "",
      currentMonthlyTotal: clientSnapshot.currentMonthly,
      proposedMonthlyTotal: clientSnapshot.proposedMonthly,
      monthlySavings: clientSnapshot.monthlySavings,
      annualSavings: clientSnapshot.annualSavings,
    },

    spouse: {
      firstName: spouse.firstName || "",
      lastName: spouse.lastName || "",
      fullName: personHasData(spouse) ? fullName(spouse) : "",
      phone: spouse.phone || "",
      email: spouse.email || "",
      birthdate: spouse.birthdate || "",
      age: calculateAge(spouse.birthdate) || spouse.age || "",
      address: spouse.address || "",
      city: spouse.city || "",
      state: spouse.state || "",
      zip: spouse.zip || "",
      health: spouse.health || "",
      status: spouse.status || "",
      tobacco: spouse.tobacco || "",
      currentCoverage: spouse.coverageType || "",
      currentCarrier: spouse.currentCarrier || "",
      currentPlan: spouse.currentPlan || "",
      currentMedSuppPremium: spouse.currentMedSuppPremium || "",
      proposedCarrier: spouse.proposedCarrier || "",
      proposedPlan: spouse.proposedPlan || "",
      proposedPremiumSource: spouse.proposedPremiumSource || "",
      proposedMedSuppPremium: getEffectiveProposed(spouse) || "",
      csgSelectedCompany: spouse.csgSelectedCompany || "",
      csgProposedPremium: spouse.csgProposedPremium || "",
      manualOverrideProposedRate: spouse.manualOverrideProposedRate || "",
      currentMonthlyTotal: spouseSnapshot.currentMonthly,
      proposedMonthlyTotal: spouseSnapshot.proposedMonthly,
      monthlySavings: spouseSnapshot.monthlySavings,
      annualSavings: spouseSnapshot.annualSavings,
    },

    householdTotals: {
      currentMonthly: householdCurrentMonthly,
      proposedMonthly: householdProposedMonthly,
      monthlySavings: householdMonthlySavings,
      annualSavings: householdAnnualSavings,
      currentPremiumFromAdmin: household.currentPremium || "",
      currentCoverageFromAdmin: household.currentCoverage || "",
      groupSize: household.groupSize || "",
    },

    ancillary: ancillaryRows,

    medicarePro: {
      status: household.medicareProStatus || "Not started",
      clientId: household.medicareProClientId || "",
      agentAccess: household.medicareProAgentAccess || "",
    },

    notes: {
      adminNotes: household.notes || "",
      agentNotes: household.clientAgentNotes || "",
      healthFlags: household.healthFlags || [],
    },
  };
}

function buildCalendarDescriptionFromCrossOver(crossOver) {
  const ancillaryLines = (crossOver.ancillary || [])
    .filter((row) => row.clientCurrent || row.clientProposed || row.spouseCurrent || row.spouseProposed)
    .map((row) =>
      `${row.product}: Client current ${moneyDisplay(row.clientCurrent || 0)} / proposed ${moneyDisplay(row.clientProposed || 0)} | Spouse current ${moneyDisplay(row.spouseCurrent || 0)} / proposed ${moneyDisplay(row.spouseProposed || 0)}`
    )
    .join("\n");

  return (
    `CLIENT INTAKE\n` +
    `Client: ${crossOver.client.fullName}\n` +
    `Phone: ${crossOver.client.phone || "-"}\n` +
    `Email: ${crossOver.client.email || "-"}\n` +
    `DOB/Age: ${crossOver.client.birthdate || "-"} / ${crossOver.client.age || "-"}\n` +
    `Address: ${[crossOver.client.address, crossOver.client.city, crossOver.client.state, crossOver.client.zip].filter(Boolean).join(", ") || "-"}\n` +
    `Client Health: ${crossOver.client.health || "-"}\n\n` +

    `SPOUSE INTAKE\n` +
    `Spouse: ${crossOver.spouse.fullName || "-"}\n` +
    `Phone: ${crossOver.spouse.phone || "-"}\n` +
    `Email: ${crossOver.spouse.email || "-"}\n` +
    `DOB/Age: ${crossOver.spouse.birthdate || "-"} / ${crossOver.spouse.age || "-"}\n` +
    `Spouse Health: ${crossOver.spouse.health || "-"}\n\n` +

    `CURRENT COVERAGE / PREMIUMS\n` +
    `Client Current Carrier: ${crossOver.client.currentCarrier || "-"}\n` +
    `Client Current Premium: ${moneyDisplay(crossOver.client.currentMedSuppPremium || 0)}\n` +
    `Spouse Current Carrier: ${crossOver.spouse.currentCarrier || "-"}\n` +
    `Spouse Current Premium: ${moneyDisplay(crossOver.spouse.currentMedSuppPremium || 0)}\n` +
    `Household Current Monthly Total: ${moneyDisplay(crossOver.householdTotals.currentMonthly)}\n\n` +

    `PROPOSED COVERAGE / PREMIUMS\n` +
    `Client Proposed: ${crossOver.client.proposedCarrier || "-"} ${crossOver.client.proposedPlan || ""}\n` +
    `Client Proposed Premium: ${moneyDisplay(crossOver.client.proposedMedSuppPremium || 0)}\n` +
    `Spouse Proposed: ${crossOver.spouse.proposedCarrier || "-"} ${crossOver.spouse.proposedPlan || ""}\n` +
    `Spouse Proposed Premium: ${moneyDisplay(crossOver.spouse.proposedMedSuppPremium || 0)}\n` +
    `Household Proposed Monthly Total: ${moneyDisplay(crossOver.householdTotals.proposedMonthly)}\n\n` +

    `SAVINGS\n` +
    `Monthly Savings: ${moneyDisplay(crossOver.householdTotals.monthlySavings)}\n` +
    `Annual Savings: ${moneyDisplay(crossOver.householdTotals.annualSavings)}\n\n` +

    `ANCILLARY BENEFITS\n` +
    `${ancillaryLines || "No ancillary benefits entered."}\n\n` +

    `ADMIN / MEDICARE PRO\n` +
    `Reason: ${crossOver.reasonForCall || "-"}\n` +
    `Assigned Agent: ${crossOver.assignedAgent || "-"}\n` +
    `Medicare Pro Status: ${crossOver.medicarePro.status || "-"}\n` +
    `Medicare Pro Client ID/Search: ${crossOver.medicarePro.clientId || "-"}\n` +
    `Group Size: ${crossOver.householdTotals.groupSize || "-"}\n\n` +

    `NOTES\n` +
    `${crossOver.notes.adminNotes || "-"}\n\n` +
    `Agent Notes: ${crossOver.notes.agentNotes || "-"}\n\n` +
    `RETURN LINKS:\n${getReturnLinks()}`
  );
}

async function createCalendarEvent() {
  if (!appointmentDate || !appointmentTime) {
    setMessage("Choose appointment date and time before creating calendar event.");
    return;
  }

  // Save first so the latest intake/quick rater/calculator values are locked into the household record.
  if (household.client.firstName || household.client.lastName) {
    saveIntake();
  }

  const start = new Date(`${appointmentDate}T${appointmentTime}:00`);
  const end = new Date(start.getTime() + Number(appointmentDuration || 60) * 60000);
  const agent = AGENTS.find((item) => item.name === household.assignedAgent) || AGENTS[0];
  const clientName = fullName(household.client);
  const typeCode = APPOINTMENT_CODE[household.reasonForCall] || household.reasonForCall;

  const crossOver = buildCalendarCrossOverRecord(
    household,
    appointmentDate,
    appointmentTime,
    appointmentDuration,
    appointmentLocation
  );

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

    // Important structured fields for Calendar / Availability display and filtering
    currentPremium: crossOver.householdTotals.currentMonthly,
    proposedPremium: crossOver.householdTotals.proposedMonthly,
    monthlySavings: crossOver.householdTotals.monthlySavings,
    annualSavings: crossOver.householdTotals.annualSavings,
    currentCoverage: crossOver.householdTotals.currentCoverageFromAdmin || crossOver.client.currentCoverage,
    proposedCoverage: `${crossOver.client.proposedCarrier || ""} ${crossOver.client.proposedPlan || ""}`.trim(),
    clientPhone: crossOver.client.phone,
    clientEmail: crossOver.client.email,
    spouseName: crossOver.spouse.fullName,
    spousePhone: crossOver.spouse.phone,
    spouseEmail: crossOver.spouse.email,
    medicareProStatus: crossOver.medicarePro.status,
    medicareProClientId: crossOver.medicarePro.clientId,

    // Full record that can be opened later by admin/agent
    crossOver,

    description: buildCalendarDescriptionFromCrossOver(crossOver),
    returnLinks: getReturnLinks(),
  };

  setEvents((prev) => [event, ...prev]);
  setMessage("Appointment created with full intake, premium, quick rater, calculator, spouse, ancillary, and savings details crossed over.");

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

        // Also send structured details if your route supports them.
        extendedProperties: {
          private: {
            householdId: event.householdId,
            currentPremium: String(event.currentPremium || ""),
            proposedPremium: String(event.proposedPremium || ""),
            monthlySavings: String(event.monthlySavings || ""),
            annualSavings: String(event.annualSavings || ""),
            clientPhone: event.clientPhone || "",
            clientEmail: event.clientEmail || "",
            spouseName: event.spouseName || "",
            medicareProStatus: event.medicareProStatus || "",
          },
        },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) setMessage("Appointment created and full details sent to Google Calendar.");
    }
  } catch (error) {
    // Local save remains active when API is not connected.
  }
}

// OPTIONAL: add this compact display inside your Calendar / Availability appointment card
// so admin can SEE that premium and savings crossed over.
function CalendarPremiumMiniCard({ event }) {
  return (
    <div style={{ marginTop: 8, padding: 10, border: "1px solid #d6dde8", borderRadius: 10, background: "#f8fafc" }}>
      <strong>Premium Snapshot</strong>
      <div>Current: {moneyDisplay(event.currentPremium || event.crossOver?.householdTotals?.currentMonthly || 0)}</div>
      <div>Proposed: {moneyDisplay(event.proposedPremium || event.crossOver?.householdTotals?.proposedMonthly || 0)}</div>
      <div>Savings: {moneyDisplay(event.monthlySavings || event.crossOver?.householdTotals?.monthlySavings || 0)} monthly / {moneyDisplay(event.annualSavings || event.crossOver?.householdTotals?.annualSavings || 0)} annual</div>
    </div>
  );
}
