/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { createClient, OAuthStrategy } from "@wix/sdk";
import { products, collections } from "@wix/stores";
import { cart as currentCart } from "@wix/ecom";
import Cookies from "js-cookie";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { redirects } from "@wix/redirects";

// Funkcija, kas apstrādā tokenu iegūšanu klienta pusē
export const getRefreshToken = async () => {
    const refreshToken = Cookies.get("refreshToken"); // Mēģina iegūt refresh token no sīkdatnēm
    if (!refreshToken) {
        console.log("No refreshToken found. Requesting new token from server.");
        try {
            const response = await fetch("http://localhost:3000/api/wix"); // Pieprasījums serverim
            const data = await response.json(); // Pārveido atbildi JSON formātā
            console.log("API Response:", data);
            if (data.token?.refreshToken) {
                Cookies.set("refreshToken", JSON.stringify(data.token.refreshToken), { expires: 7, path: "/" }); // Saglabā jauno tokenu sīkdatnē
                return data.token.refreshToken; // Atgriež tokenu
            }
        } catch (error) {
            console.error("API fetch error:", error); // Kļūdas apstrāde
        }
    } else {
        console.log("Client-side refreshToken:", refreshToken);
        return JSON.parse(refreshToken); // Atgriež esošo tokenu
    }
    return null; // Ja nav pieejama tokena informācija
};

// Inicializē Wix klientu ar OAuth stratēģiju
const initializeWixClient = async () => {
    const refreshToken = await getRefreshToken(); // Iegūst refresh token
    const client = createClient({
        modules: {
            products,
            collections,
            currentCart,
            redirects,
        },
        auth: OAuthStrategy({
            clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!, // Klienta ID no vides mainīgajiem
            tokens: {
                refreshToken: refreshToken || { value: "", expiresAt: 0 }, // Izmanto iegūto tokenu
                accessToken: { value: "", expiresAt: 0 }, // Sākotnējā access token informācija
            },
        }),
    });

    console.log("Initialized WixClient:", client); // Pārbauda, vai Wix klients ir inicializēts
    return client; // Atgriež inicializēto klientu
};

export type WixClient = Awaited<ReturnType<typeof initializeWixClient>>; // Definē WixClient tipu
export const WixClientContext = createContext<WixClient | null>(null); // Izveido kontekstu

// Wix klienta konteksta nodrošinātājs
export const WixClientContextProvider = ({ children }: { children: ReactNode }) => {
    const [wixClient, setWixClient] = useState<WixClient | null>(null); // Wix klienta stāvokļa izveide
    const [loading, setLoading] = useState(true); // Ielādēšanas stāvoklis

    // Iegūst tokenu un inicializē Wix klientu komponentes montāžas laikā
    useEffect(() => {
        const initializeClient = async () => {
            try {
                const client = await initializeWixClient(); // Inicializē klientu
                setWixClient(client); // Iestata klientu stāvoklī
            } catch (error) {
                console.error("Failed to initialize Wix client:", error); // Kļūdas apstrāde
            } finally {
                setLoading(false); // Iestata ielādēšanu uz false neatkarīgi no rezultāta
            }
        };
        initializeClient(); // Izsauc funkciju
    }, []);

    // Ja klients tiek ielādēts, attēlo ielādēšanas ziņu
    if (loading) {
        return <div>Loading...</div>; // Opcionāla ielādes UI
    }

    // Ja Wix klients nav iestatīts, attēlo kļūdas ziņu
    if (!wixClient) {
        return <div>Error initializing Wix client. Please try again later.</div>; // Kļūdu UI
    }

    return (
        <WixClientContext.Provider value={wixClient}> {/* Nodrošina Wix klienta kontekstu bērnu komponentēm */}
            {children}
        </WixClientContext.Provider>
    );
};

// Custom hook, lai izmantotu Wix klientu
export const useWixClient = () => {
    const context = useContext(WixClientContext); // Iegūst kontekstu
    if (!context) {
        throw new Error("useWixClient must be used within a WixClientProvider"); // Pārbauda, vai konteksts ir pieejams
    }
    return context; // Atgriež Wix klientu
};
