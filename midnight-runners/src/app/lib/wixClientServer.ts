import { OAuthStrategy, createClient, TokenRole, RefreshToken } from "@wix/sdk";
import { products, collections } from "@wix/stores";
import { cart, cart as currentCart } from "@wix/ecom";
import { cookies } from "next/headers"; // Ievieto cookies manipulācijas funkcijas no Next.js
import { randomBytes } from "crypto"; // Ievieto funkcionalitāti nejaušu baitu ģenerēšanai

// Definē tipa SecureRefreshToken
type SecureRefreshToken = {
  value: string;
  role: TokenRole;
};

// Funkcija, lai ģenerētu drošu tokenu
function generateSecureToken(): RefreshToken {
  const secureToken = randomBytes(32).toString("hex"); // Ģenerē 32 nejaušus baitus un konvertē uz heksadecimālo formātu
  return { value: secureToken, role: "user" as TokenRole }; // Atgriež objektu ar drošu tokenu un lomu "user"
}

// Funkcija, lai izveidotu Wix klientu
export const wixClientServer = async () => {
  const cookieStore = cookies(); // Iegūst cookies veikšanas veikalu
  // Mēģina iegūt refresh token no cookies, ja tas ir pieejams
  let refreshToken: RefreshToken | null = cookieStore.get("refreshToken")?.value ? JSON.parse(cookieStore.get("refreshToken")!.value) : null;

  // Ja refresh token nav pieejams vai tas ir ar noteiktu vērtību
  if (!refreshToken || refreshToken.value === "newGeneratedTokenValue") {
    refreshToken = generateSecureToken(); // Ģenerē jaunu drošu tokenu
    // Iestata refresh token cookies ar attiecīgām opcijām
    cookieStore.set("refreshToken", JSON.stringify(refreshToken), {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Nodrošina, ka cookies ir drošs tikai ražošanas vidē
    });
  }

  const clientId = process.env.NEXT_PUBLIC_WIX_CLIENT_ID; // Iegūst Wix klienta ID no vides mainīgajiem
  if (!clientId) throw new Error("Wix Client ID is missing."); // Pārbauda, vai klienta ID ir pieejams

  // Izveido Wix klientu
  const wixClient = createClient({
    modules: {
      products,
      collections,
      currentCart: cart, // Nodrošina, ka groza modulis ir pareizi definēts
    },
    auth: OAuthStrategy({
      clientId,
      tokens: {
        refreshToken: refreshToken as RefreshToken, // Iestata refresh token
        accessToken: { value: "", expiresAt: 0 }, // Iestata piekļuves token ar null vērtību
      },
    }),
  });

  return wixClient; // Atgriež izveidoto Wix klientu
};
