const { wixClientServer } = require('../../app/lib/wixClientServer'); // Correct path based on project structure

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export default async function handler(req, res) {
    console.log("API Endpoint: Handler invoked");

    console.log("Environment Variable - NEXT_PUBLIC_WIX_CLIENT_ID:", process.env.NEXT_PUBLIC_WIX_CLIENT_ID);

    try {
        console.log("API Endpoint: Invoking wixClientServer");
        const client = await wixClientServer();
        if (client) {
            res.status(200).json({ message: "Client initialized successfully", client });
        } else {
            throw new Error("Failed to initialize client");
        }
    } catch (error) {
        console.error("API Endpoint Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
