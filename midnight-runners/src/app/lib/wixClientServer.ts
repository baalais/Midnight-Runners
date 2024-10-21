import { OAuthStrategy, createClient, RefreshToken as WixRefreshToken, TokenRole } from "@wix/sdk"; 
import { collections, products } from "@wix/stores";
import { orders } from "@wix/ecom";
import { members } from '@wix/members';

// Definē derīgu lomu tipu, saskaņā ar Wix SDK, un iestata noklusējuma lomu
type ValidTokenRoles = "user" | "admin"; 
const DEFAULT_ROLE: TokenRole = "user"; // Noklusējuma loma ir 'user'

// Funkcija, kas izveido un atgriež Wix klientu
export const wixClientServer = async () => {
  // Inicializē refreshToken ar null vērtību
  let refreshToken: WixRefreshToken | null = null;

  // Pārbauda vai darbojas klienta pusē (nevis servera)
  if (typeof window !== 'undefined') {
    const cookieValue = getCookieValue(document.cookie, "refreshToken"); // Iegūst refreshToken no sīkfaila
    if (cookieValue) {
      try {
        const decodedValue = decodeURIComponent(cookieValue); // Dekodē sīkfaila saturu
        const parsedToken = JSON.parse(decodedValue); // Parsē dekodēto virkni
        // Sagatavo refreshToken struktūru
        refreshToken = {
          value: parsedToken.value || "",
          role: parsedToken.role as ValidTokenRoles || DEFAULT_ROLE, // Pārvērš lomu par derīgu tipu
        };
      } catch (e) {
        console.error("Invalid refreshToken format", e); // Ja kļūda, izdrukā uz konsoles
      }
    }
  } else {
    throw new Error("This function is only intended to run on the client-side"); // Ja darbojas servera pusē, izmet kļūdu
  }

  // Iegūst klienta ID no vides mainīgajiem
  const clientId = process.env.NEXT_PUBLIC_WIX_CLIENT_ID;
  if (!clientId) {
    throw new Error("Wix Client ID is missing. Please check your environment variables.");
  }

  // Izveido Wix klientu ar atbilstošajiem moduļiem un OAuth autentifikāciju
  const wixClient = createClient({
    modules: {
      products,
      collections,
      orders,
      members,
    },
    auth: OAuthStrategy({
      clientId, // Izmanto klienta ID no vides mainīgajiem
      tokens: {
        refreshToken: refreshToken || { value: "", role: DEFAULT_ROLE }, // Izmanto refreshToken no sīkfaila vai noklusējumu
        accessToken: { value: "", expiresAt: 0 }, // Noklusēts accessToken, jāmaina pēc nepieciešamības
      },
    }),
  });

  return wixClient; // Atgriež izveidoto Wix klientu
};

// Funkcija, lai iegūtu sīkfaila vērtību pēc nosaukuma
function getCookieValue(cookieString: string, name: string) {
  const value = `; ${cookieString}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || ""; // Atgriež sīkfaila vērtību, ja tāda eksistē
  }
  return "";
}
