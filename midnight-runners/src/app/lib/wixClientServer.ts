import { OAuthStrategy, createClient, TokenRole, RefreshToken } from "@wix/sdk";
import { products, collections } from "@wix/stores";
import { cart, cart as currentCart } from "@wix/ecom";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";

type SecureRefreshToken = {
  value: string;
  role: TokenRole;
};

// Function to generate a secure token
function generateSecureToken(): RefreshToken {
  const secureToken = randomBytes(32).toString("hex");
  return { value: secureToken, role: "user" as TokenRole };
}

export const wixClientServer = async () => {
  const cookieStore = cookies();
  let refreshToken: RefreshToken | null = cookieStore.get("refreshToken")?.value ? JSON.parse(cookieStore.get("refreshToken")!.value) : null;

  if (!refreshToken || refreshToken.value === "newGeneratedTokenValue") {
    refreshToken = generateSecureToken();
    cookieStore.set("refreshToken", JSON.stringify(refreshToken), {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
  }

  const clientId = process.env.NEXT_PUBLIC_WIX_CLIENT_ID;
  if (!clientId) throw new Error("Wix Client ID is missing.");

  const wixClient = createClient({
    modules: {
      products,
      collections,
      currentCart: cart, // Ensure this matches the module name in your client setup
    },
    auth: OAuthStrategy({
      clientId,
      tokens: {
        refreshToken: refreshToken as RefreshToken,
        accessToken: { value: "", expiresAt: 0 },
      },
    }),
  });

  return wixClient;
};
