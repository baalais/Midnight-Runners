import { OAuthStrategy, createClient } from "@wix/sdk";
import { products, collections } from "@wix/stores";
import { cart as currentCart } from "@wix/ecom";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";

// Function to generate a secure token
function generateSecureToken() {
    try {
        const secureToken = randomBytes(32).toString("hex");
        console.log("Generated secure token:", secureToken);
        return secureToken;
    } catch (error) {
        console.error("Error generating secure token:", error);
        throw new Error("Failed to generate secure token.");
    }
}

export const wixClientServer = async () => {
    try {
        console.log("wixClientServer invoked");

        const cookieStore = cookies();
        let refreshToken = cookieStore.get("refreshToken")?.value || null;
        console.log("Current refreshToken value from cookies:", refreshToken);

        if (!refreshToken || refreshToken === '{"value":"newGeneratedTokenValue"}') {
            console.log("No valid refreshToken found. Generating a new one.");
            const newToken = {
                value: generateSecureToken(),
                role: "user",
            };
            refreshToken = JSON.stringify(newToken);

            try {
                cookieStore.delete("refreshToken"); // Ensure no stale token
                cookieStore.set("refreshToken", refreshToken, {
                    path: "/",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                });
                console.log("Token generated and set in cookies", newToken);
            } catch (error) {
                console.error("Error setting refreshToken cookie:", error);
                throw new Error("Failed to set refreshToken in cookies.");
            }
        } else {
            try {
                refreshToken = JSON.parse(refreshToken);
                console.log("Existing refreshToken after parsing:", refreshToken);
            } catch (error) {
                console.error("Error parsing refresh token:", error);
                throw new Error("Failed to parse refreshToken.");
            }
        }

        const clientId = process.env.NEXT_PUBLIC_WIX_CLIENT_ID;
        console.log("Client ID in wixClientServer:", clientId);
        if (!clientId) {
            throw new Error("Wix Client ID is missing.");
        }

        const wixClient = createClient({
            modules: {
                products,
                collections,
                currentCart,
            },
            auth: OAuthStrategy({
                clientId,
                tokens: {
                    refreshToken,
                    accessToken: { value: "", expiresAt: 0 },
                },
            }),
        });

        console.log("Wix client created successfully");
        return wixClient;
    } catch (error) {
        console.error("Error in wixClientServer:", error.message, error.stack);
        throw new Error("Failed to initialize Wix client.");
    }
};
