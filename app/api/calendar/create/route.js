import { google } from "googleapis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const agentColorMap = {
  Admin: "3", // Purple
  "Loyd Richardson": "10", // Green
  "Blake Richardson": "6", // Orange
  "William Sykes": "9", // Blue
  "Jimmie Bassett": "11", // Red
  "Christiana Grant": "3", // Purple
};

function getAuth() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY
    ?.replace(/\\n/g, "\n")
    ?.replace(/^"|"$/g, "");

  return new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
}

export async function GET() {
  return Response.json({
    success: true,
    message: "Calendar create route is ready",
    calendarId: process.env.GOOGLE_CALENDAR_ID || null,
  });
}

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      start,
      end,
      location,
      agents = [],
      checkOnly = false,
    } = body;

    if (!process.env.GOOGLE_CALENDAR_ID) {
      return Response.json({
        success: false,
        error: "Missing GOOGLE_CALENDAR_ID",
      });
    }

    const selectedAgents = Array.isArray(agents) ? agents : [agents];

    if (!start || !end) {
      return Response.json({
        success: false,
        error: "Missing appointment start or end time.",
      });
    }

    const calendar = google.calendar({
      version: "v3",
      auth: getAuth(),
    });

    const eventsResponse = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: start,
      timeMax: end,
      singleEvents: true,
      orderBy: "startTime",
    });

    const existingEvents = eventsResponse.data.items || [];

    const conflictingEvents = existingEvents.filter((event) => {
      const eventDescription = event.description || "";
      const eventSummary = event.summary || "";

      return selectedAgents.some((agent) => {
        return (
          eventDescription.includes(`Assigned Agent: ${agent}`) ||
          eventDescription.includes(agent) ||
          eventSummary.includes(agent)
        );
      });
    });

    if (checkOnly) {
      return Response.json({
        success: true,
        available: conflictingEvents.length === 0,
        conflicts: conflictingEvents.map((event) => ({
          summary: event.summary,
          start: event.start,
          end: event.end,
        })),
      });
    }

    if (conflictingEvents.length > 0) {
      return Response.json({
        success: false,
        error:
          "One or more selected agents already has an appointment at this time.",
        conflicts: conflictingEvents.map((event) => ({
          summary: event.summary,
          start: event.start,
          end: event.end,
        })),
      });
    }

    const primaryAgent = selectedAgents[0] || "Admin";

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      resource: {
        summary: title || "Client Appointment",
        description: description || "",
        location: location || "Office",
        colorId: agentColorMap[primaryAgent] || "3",
        start: {
          dateTime: start,
          timeZone: "America/Chicago",
        },
        end: {
          dateTime: end,
          timeZone: "America/Chicago",
        },
      },
    });

    return Response.json({
      success: true,
      event: response.data,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message || "Unknown calendar error",
    });
  }
}
