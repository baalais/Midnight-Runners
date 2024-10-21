/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import CartModal from "./CartModal";
import { useWixClient } from "../hooks/useWixClient";
import Cookies from "js-cookie";
import { useCartStore } from "../hooks/useCartStore";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

const NavIcons = () => {
  const [isCartOpen, setIsCartOpen] = useState(false); // Statuss groza modalitātes atvēršanai/aizvēršanai
  const [isLoading, setIsLoading] = useState(false); // Statuss, vai notiek ielāde

  const router = useRouter(); // Navigācijas funkcionalitāte
  const pathName = usePathname(); // Ceļa nosaukuma iegūšana

  const wixClient = useWixClient(); // Wix klienta objekta iegūšana
  const isLoggedIn = wixClient.auth.loggedIn(); // Pārbaude, vai lietotājs ir pieteicies

  // Funkcija lietotāja izrakstīšanai
  const handleLogout = async () => {
    setIsLoading(true); // Ieslēdz ielādes statusu
    Cookies.remove("refreshToken"); // Noņem "refreshToken" sīkdatni
    const { logoutUrl } = await wixClient.auth.logout(window.location.href); // Izsauc izrakstīšanās URL
    setIsLoading(false); // Izslēdz ielādes statusu
    router.push(logoutUrl); // Pārsūta uz izrakstīšanās URL
  };

  const { cart, counter, getCart } = useCartStore(); // Groza stāvokļa pārvaldība

  useEffect(() => {
    getCart(wixClient); // Saņem groza datus no Wix klienta
  }, [wixClient, getCart]);

  // Funkcija, lai aizvērtu CartModal
  const handleCloseCartModal = () => {
    setIsCartOpen(false); // Aizver groza modalitāti
  };

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      {/* Groza ikona un groza preču skaits */}
      <div
        className="relative cursor-pointer"
        onClick={() => setIsCartOpen((prev) => !prev)}
      >
        <Image src="/cart.png" alt="Cart Icon" width={22} height={22} />
        <div className="absolute -top-4 -right-4 w-6 h-6 bg-lama rounded-full text-white text-sm flex items-center justify-center">
          {counter}
        </div>
      </div>
      {/* Ja groza modalitāte ir atvērta, parādīt CartModal */}
      {isCartOpen && <CartModal onClose={handleCloseCartModal} />}
    </div>
  );
};

export default NavIcons;
