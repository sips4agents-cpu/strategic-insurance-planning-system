import { google } from "googleapis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ?.replace(/\\n/g, "\n")
      ?.replace(/^"|"$/g, "");

    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const calendar = google.calendar({ version: "v3", auth });

    const list = await calendar.calendarList.list();

    return Response.json({
      success: true,
      calendars: list.data.items,
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}
