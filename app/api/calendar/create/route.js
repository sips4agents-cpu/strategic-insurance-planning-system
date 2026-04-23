import { google } from "googleapis";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      start,
      end,
      location
    } = body;

    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY,
      ["https://www.googleapis.com/auth/calendar"]
    );

    const calendar = google.calendar({ version: "v3", auth });

    const event = {
      summary: title,
      description: description,
      location: location,
      start: {
        dateTime: start,
        timeZone: "America/Chicago"
      },
      end: {
        dateTime: end,
        timeZone: "America/Chicago"
      }
    };

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      resource: event
    });

    return Response.json({ success: true, event: response.data });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: error.message });
  }
}
