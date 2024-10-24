// pages/api/wix.js
import { wixClientServer } from '../../app/lib/wixClientServer';

export default async function handler(req, res) {
  try {
    const wixClient = await wixClientServer();
    res.status(200).json({ token: { refreshToken: wixClient.auth.tokens.refreshToken } });
  } catch (error) {
    console.error("API error:", error); // Log the actual error
    res.status(500).json({ error: "Internal Server Error" });
  }
}
