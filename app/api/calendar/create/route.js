import { google } from "googleapis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const agentColorMap = {
  Admin: "3",
  "Loyd Richardson": "10",
  "Blake Richardson": "6",
  "William Sykes": "9",
  "Jimmie Bassett": "11",
  "Christiana Grant": "3",
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
    message: "Calendar route ready",
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
      checkOnly,
    } = body;

    const selectedAgents = Array.isArray(agents) ? agents : [agents];

    const calendar = google.calendar({ version: "v3", auth: getAuth() });

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
      return selectedAgents.some((agent) =>
        eventDescription.includes(`Assigned Agent: ${agent}`)
      );
    });

    if (checkOnly) {
      return Response.json({
        success: true,
        available: conflictingEvents.length === 0,
        conflicts: conflictingEvents.map((event) => ({
          summary: event.summary,
          start: event.start,
          end: event.end,
          description: event.description,
        })),
      });
    }

    if (conflictingEvents.length > 0) {
      return Response.json({
        success: false,
        error: "One or more selected agents already has an appointment at this time.",
        conflicts: conflictingEvents.map((event) => event.summary),
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
