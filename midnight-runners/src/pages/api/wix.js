/* eslint-disable @typescript-eslint/no-require-imports */
const { wixClientServer } = require('../../app/lib/wixClientServer'); // Pareizā ceļa noteikšana atkarībā no projekta struktūras

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export default async function handler(req, res) {
    console.log("API Endpoint: Handler invoked");

    // Pārbauda, vai vides mainīgais ir pieejams
    console.log("Environment Variable - NEXT_PUBLIC_WIX_CLIENT_ID:", process.env.NEXT_PUBLIC_WIX_CLIENT_ID);

    try {
        console.log("API Endpoint: Invoking wixClientServer");
        const client = await wixClientServer(); // Izsauc wixClientServer funkciju

        // Ja klients ir inicializēts, atgriež panākumu atbildi
        if (client) {
            res.status(200).json({ message: "Client initialized successfully", client });
        } else {
            throw new Error("Failed to initialize client"); // Kļūda, ja klients nav inicializēts
        }
    } catch (error) {
        console.error("API Endpoint Error:", error); // Izvada kļūdas ziņojumu konsolē
        res.status(500).json({ error: "Internal Server Error" }); // Atgriež 500 statusu, ja notiek kļūda
    }
}
