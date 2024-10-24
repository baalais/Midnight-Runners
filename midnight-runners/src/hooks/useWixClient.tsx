"use client";

import { WixClientContext } from "../context/wixContext";
import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

// Custom hook to get the Wix client
export const useWixClient = () => {
  const wixClient = useContext(WixClientContext);
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    if (!wixClient) {
      console.warn("Wix client is not yet initialized.");
    } else {
      console.log("Wix client is initialized:", wixClient);
      setClientReady(true);
    }
  }, [wixClient]);

  // Access the token client-side for debugging
  useEffect(() => {
    const refreshToken = Cookies.get("refreshToken");
    if (!refreshToken) {
      console.warn("No refreshToken found in client-side cookies.");
    } else {
      console.log("Client-side refreshToken:", refreshToken);
    }
  }, []);

  if (!clientReady) {
    return null; // Optionally return a loading state while initializing
  }

  return wixClient;
};
