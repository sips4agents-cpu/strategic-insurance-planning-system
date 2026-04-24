import { google } from "googleapis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  try {
    const calendar = google.calendar({ version: "v3", auth: getAuth() });
    const list = await calendar.calendarList.list();

    return Response.json({
      success: true,
      clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
      calendarIdFromVercel: process.env.GOOGLE_CALENDAR_ID,
      calendars: list.data.items?.map((cal) => ({
        id: cal.id,
        summary: cal.summary,
        accessRole: cal.accessRole,
      })),
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, start, end, location } = body;

    const calendar = google.calendar({ version: "v3", auth: getAuth() });

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      resource: {
        summary: title || "Client Appointment",
        description: description || "",
        location: location || "Office",
        start: { dateTime: start, timeZone: "America/Chicago" },
        end: { dateTime: end, timeZone: "America/Chicago" },
      },
    });

    return Response.json({ success: true, event: response.data });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
    });
  }
}
