"use client"; // Norāda, ka komponents tiek izmantots klients pusē

import { WixClientContext } from "../context/wixContext";
import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

// Personalizēts hooks, lai iegūtu Wix klientu
export const useWixClient = () => {
  const wixClient = useContext(WixClientContext); // Izmanto kontekstu, lai iegūtu Wix klientu
  const [clientReady, setClientReady] = useState(false); // Stāvokļa maiņa, lai norādītu, vai klients ir gatavs

  useEffect(() => {
    // Efekts, kas tiek izsaukts, kad wixClient mainās
    if (wixClient) {
      console.log("Wix client is initialized:", wixClient); // Konsolē, ja klients ir inicializēts
      setClientReady(true); // Iestata, ka klients ir gatavs
    } else {
      console.warn("Wix client is not yet initialized."); // Brīdina, ja klients nav inicializēts
    }
  }, [wixClient]); // Atkarība no wixClient

  return { wixClient: clientReady ? wixClient : null, clientReady }; // Atgriež klienta stāvokli un gatavības statusu
};
