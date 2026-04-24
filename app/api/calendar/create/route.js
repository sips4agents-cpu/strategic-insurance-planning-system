import { google } from "googleapis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const agentColorMap = {
  Admin: "3", // purple
  "Loyd Richardson": "10", // green
  "Blake Richardson": "6", // orange
  "William Sykes": "9", // blue
  "Jimmie Bassett": "11", // red
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
    message: "Calendar route is ready",
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
      agent,
      checkOnly,
    } = body;

    if (!process.env.GOOGLE_CALENDAR_ID) {
      return Response.json({ success: false, error: "Missing GOOGLE_CALENDAR_ID" });
    }

    const calendar = google.calendar({ version: "v3", auth: getAuth() });

    const freeBusy = await calendar.freebusy.query({
      resource: {
        timeMin: start,
        timeMax: end,
        timeZone: "America/Chicago",
        items: [{ id: process.env.GOOGLE_CALENDAR_ID }],
      },
    });

    const busyTimes =
      freeBusy.data.calendars?.[process.env.GOOGLE_CALENDAR_ID]?.busy || [];

    const hasConflict = busyTimes.length > 0;

    if (checkOnly) {
      return Response.json({
        success: true,
        available: !hasConflict,
        busyTimes,
      });
    }

    if (hasConflict) {
      return Response.json({
        success: false,
        error: "This time is already booked on the shared calendar.",
        busyTimes,
      });
    }

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      resource: {
        summary: title || "Client Appointment",
        description: description || "",
        location: location || "Office",
        colorId: agentColorMap[agent] || "3",
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
