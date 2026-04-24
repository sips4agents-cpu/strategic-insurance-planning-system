async function createCalendarEvent() {
  const times = buildAppointmentTimes();
  if (!times) return;

  if (schedulerAgents.length === 0) {
    alert("Please select at least one agent.");
    return;
  }

  const clientName =
    `${client?.first_name || ""} ${client?.last_name || ""}`.trim() || "Client";

  const typeCode = appointmentCodeMap[appointmentType] || appointmentType;

  const agentCodes = schedulerAgents
    .map((agent) => agentInitialsMap[agent] || agent)
    .join("/");

  const aorCode = agentInitialsMap[household?.assigned_agent] || household?.assigned_agent || "-";

  const healthSummary = health.length ? health.join(", ") : "None";

  const title = `[${typeCode}] ${clientName} | ${agentCodes}`;

  const description =
    `Reason for Call: ${household?.reason_for_call || appointmentType || "-"}\n` +
    `Client: ${clientName}\n` +
    `Phone: ${client?.phone || "-"}\n` +
    `Email: ${client?.email || "-"}\n` +
    `Age: ${client?.age || "-"}\n` +
    `ZIP: ${client?.zip || "-"}\n` +
    `Assigned Agent: ${schedulerAgents.join(", ")}\n` +
    `Assigned Agent Initials: ${agentCodes}\n` +
    `AOR: ${aorCode}\n\n` +
    `Premiums:\n` +
    `Current Premium: ${household?.current_premium || "-"}\n` +
    `Proposed Premium: ${household?.proposed_premium || "-"}\n\n` +
    `Health Conditions:\n` +
    `${healthSummary}\n\n` +
    `Notes:\n` +
    `${workingNotes || "-"}`;

  const res = await fetch("/api/calendar/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      agents: schedulerAgents,
      title,
      description,
      location: appointmentLocation || "Office",
      start: times.start.toISOString(),
      end: times.end.toISOString(),
    }),
  });

  const data = await res.json();

  if (data.success) {
    await supabase
      .from("households")
      .update({
        appointment_type: appointmentType,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        appointment_duration: times.durationMinutes,
        appointment_location: appointmentLocation,
      })
      .eq("id", id);

    setAvailabilityMessage("Calendar event created.");
    alert("Calendar event created!");
  } else {
    setAvailabilityMessage("Error: " + data.error);
    alert("Error: " + data.error);
  }
}
