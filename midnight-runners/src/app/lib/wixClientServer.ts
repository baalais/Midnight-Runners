/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { OAuthStrategy, createClient, RefreshToken as WixRefreshToken, TokenRole } from "@wix/sdk"; // Import RefreshToken and TokenRole directly from the SDK
import { collections, products } from "@wix/stores";
import { orders } from "@wix/ecom";
import { members } from '@wix/members';

// Assuming TokenRole can be 'user' | 'admin' | 'developer' etc. Adjust these values according to your actual definition
type ValidTokenRoles = "user" | "admin"; // Define valid roles according to SDK

const DEFAULT_ROLE: TokenRole = "user"; // Assign a default role

export const wixClientServer = async () => {
  let refreshToken: WixRefreshToken | null = null; // Use WixRefreshToken directly

  if (typeof window !== 'undefined') {
    const cookieValue = getCookieValue(document.cookie, "refreshToken");
    if (cookieValue) {
      try {
        const decodedValue = decodeURIComponent(cookieValue); // Decode the URL-encoded cookie
        const parsedToken = JSON.parse(decodedValue); // Parse the decoded string

        // Ensure the structure matches what the SDK expects
        refreshToken = {
          value: parsedToken.value || "",
          role: parsedToken.role as ValidTokenRoles || DEFAULT_ROLE, // Cast role to a valid type
        };
      } catch (e) {
        console.error("Invalid refreshToken format", e);
      }
    }
  } else {
    throw new Error("This function is only intended to run on the client-side");
  }

  const clientId = process.env.NEXT_PUBLIC_WIX_CLIENT_ID;
  if (!clientId) {
    throw new Error("Wix Client ID is missing. Please check your environment variables.");
  }

  const wixClient = createClient({
    modules: {
      products,
      collections,
      orders,
      members,
    },
    auth: OAuthStrategy({
      clientId,
      tokens: {
        refreshToken: refreshToken || { value: "", role: DEFAULT_ROLE }, // Use a default structure that matches WixRefreshToken
        accessToken: { value: "", expiresAt: 0 }, // Set default access token; adjust as needed
      },
    }),
  });

  return wixClient;
};

// Helper function to retrieve cookie value
function getCookieValue(cookieString: string, name: string) {
  const value = `; ${cookieString}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || "";
  }
  return "";
}
