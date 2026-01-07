import { google } from "googleapis";
import path from "path";

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "../../google-service-key.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

export const readSheet = async (spreadsheetId: string, range: string) => {
  const sheets = google.sheets({ version: "v4", auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  return res.data.values || [];
};
