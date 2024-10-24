"use client";

import { createClient, OAuthStrategy } from "@wix/sdk";
import { products, collections } from "@wix/stores";
import { currentCart } from "@wix/ecom";
import Cookies from "js-cookie";
import { createContext, ReactNode, useEffect, useState } from "react";
import { redirects } from '@wix/redirects';

// Function to handle the token retrieval on the client-side
const getRefreshToken = async () => {
  const refreshToken = Cookies.get("refreshToken");
  if (!refreshToken) {
    console.log("No refreshToken found in client-side cookies. Requesting new token from server.");

    try {
      const response = await fetch('http://localhost:3000/api/wix');
      const data = await response.json();
      console.log("API Response:", data);
      if (data.token?.refreshToken) {
        Cookies.set("refreshToken", JSON.stringify(data.token.refreshToken), { expires: 7, path: "/" });
        return data.token.refreshToken;
      }
    } catch (error) {
      console.error("API fetch error:", error);
    }
  } else {
    console.log("Client-side refreshToken:", refreshToken);
    return JSON.parse(refreshToken);
  }

  return null;
};

// Initialize Wix client with OAuth strategy
const initializeWixClient = async () => {
  const refreshToken = await getRefreshToken();

  return createClient({
    modules: {
      products,
      collections,
      currentCart,
      redirects,
    },
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
      tokens: {
        refreshToken: refreshToken || { value: "", expiresAt: 0 },
        accessToken: { value: "", expiresAt: 0 },
      },
    }),
  });
};

export type WixClient = Awaited<ReturnType<typeof initializeWixClient>>;
export const WixClientContext = createContext<WixClient | null>(null);

export const WixClientContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [wixClient, setWixClient] = useState<WixClient | null>(null);

  // Fetch the token and initialize Wix client on component mount
  useEffect(() => {
    const initializeClient = async () => {
      const client = await initializeWixClient();
      setWixClient(client);
    };

    initializeClient();
  }, []);

  if (!wixClient) {
    return <div>Loading...</div>; // Optional loading UI
  }

  return (
    <WixClientContext.Provider value={wixClient}>
      {children}
    </WixClientContext.Provider>
  );
};
