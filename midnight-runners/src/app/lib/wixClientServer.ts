import { OAuthStrategy, createClient } from "@wix/sdk";
import { products, collections } from "@wix/stores";
import { currentCart } from "@wix/ecom";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";

export const wixClientServer = async () => {
  try {
    console.log("Server-side: wixClientServer invoked");

    const cookieStore = cookies();
    let refreshToken = cookieStore.get("refreshToken")?.value || null;
    console.log("Server-side: Current refreshToken value from cookies:", refreshToken);

    // If refreshToken doesn't exist or is invalid, generate and set a new one
    if (!refreshToken || refreshToken === '{"value":"newGeneratedTokenValue"}') {
      console.log("Server-side: No valid refreshToken found. Generating a new one.");
      
      const newToken = {
        value: generateSecureToken(),
        role: "user",
      };
      refreshToken = JSON.stringify(newToken);

      // Remove the old token (if any), and set the new token
      try {
        cookieStore.delete("refreshToken"); // Ensure no stale token
        cookieStore.set("refreshToken", refreshToken, {
          path: "/",
          httpOnly: false, // Set httpOnly false for easy debugging (change to true in production)
          secure: process.env.NODE_ENV === 'production',
        });
        console.log("Server-side: Token generated and set in cookies", newToken);
      } catch (error) {
        console.error("Error setting refreshToken cookie:", error);
        throw new Error("Failed to set refreshToken in cookies.");
      }
    } else {
      try {
        refreshToken = JSON.parse(refreshToken);
        console.log("Server-side: Existing refreshToken after parsing:", refreshToken);
      } catch (error) {
        console.error("Error parsing refresh token:", error);
        throw new Error("Failed to parse refreshToken.");
      }
    }

    const clientId = process.env.NEXT_PUBLIC_WIX_CLIENT_ID;
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

    console.log("Server-side: Wix client created successfully");
    return wixClient;

  } catch (error) {
    console.error("Server-side: Error in wixClientServer:", error.message, error.stack);
    throw new Error("Failed to initialize Wix client.");
  }
};

// Generate a secure token using crypto for server-side
function generateSecureToken() {
  try {
    const secureToken = randomBytes(32).toString("hex");
    console.log("Server-side: Generated secure token:", secureToken);
    return secureToken;
  } catch (error) {
    console.error("Error generating secure token:", error);
    throw new Error("Failed to generate secure token.");
  }
}
