"use client";

import { WixClientContext } from "../context/wixContext";
import { useContext } from "react";

// Izveido pielāgotu āķi, lai iegūtu Wix klientu
export const useWixClient = () => {
  return useContext(WixClientContext); // Atgriež Wix klientu no konteksta
};
