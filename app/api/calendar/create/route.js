import { google } from "googleapis";

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, start, end, location } = body;

    if (!process.env.GOOGLE_CLIENT_EMAIL) {
      return Response.json({ success: false, error: "Missing GOOGLE_CLIENT_EMAIL" });
    }

    if (!process.env.GOOGLE_PRIVATE_KEY) {
      return Response.json({ success: false, error: "Missing GOOGLE_PRIVATE_KEY" });
    }

    if (!process.env.GOOGLE_CALENDAR_ID) {
      return Response.json({ success: false, error: "Missing GOOGLE_CALENDAR_ID" });
    }

    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      .replace(/\\n/g, "\n")
      .replace(/^"|"$/g, "");

    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const calendar = google.calendar({ version: "v3", auth });

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      resource: {
        summary: title || "Client Appointment",
        description: description || "",
        location: location || "Office",
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

    return Response.json({ success: true, event: response.data });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message || "Unknown calendar error",
    });
  }
}
