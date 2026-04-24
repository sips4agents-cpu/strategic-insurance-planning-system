import { google } from "googleapis";

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, start, end, location } = body;

    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ?.replace(/\\n/g, "\n")
      ?.replace(/^"|"$/g, "");

    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const calendar = google.calendar({ version: "v3", auth });

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      resource: {
        summary: title,
        description,
        location,
        start: { dateTime: start, timeZone: "America/Chicago" },
        end: { dateTime: end, timeZone: "America/Chicago" },
      },
    });

    return Response.json({ success: true, event: response.data });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
