/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useEffect, useState } from "react";
import { useWixClient } from "../hooks/useWixClient";
import { useCartStore } from "../hooks/useCartStore";
import Image from "next/image";
import CartModal from "../components/CartModal";

// NavIcons komponente
const NavIcons = () => {
  const [isCartOpen, setIsCartOpen] = useState(false); // Stāvoklis, lai kontrolētu groza modalitāti
  const { cart, counter, getCart, isLoading } = useCartStore(); // Iegūst groza datus un skaitītāju
  const { wixClient, clientReady } = useWixClient(); // Iegūst Wix klientu un tā stāvokli

  useEffect(() => {
    let isMounted = true; // Norāda, ka komponents ir uzstādīts

    // Funkcija, lai iegūtu groza datus
    const fetchCart = async () => {
      if (wixClient && clientReady && counter === 0 && !isLoading) {
        await getCart(wixClient); // Iegūst groza datus, ja nosacījumi ir izpildīti
      }
    };

    if (isMounted) {
      fetchCart(); // Izsauc fetchCart funkciju, ja komponents ir uzstādīts
    }

    return () => {
      isMounted = false; // Norāda, ka komponents vairs nav uzstādīts
    };
  }, [wixClient, clientReady]); // Pārliecinās, ka funkcija tiek izsaukta tikai tad, kad wixClient vai clientReady mainās

  // Funkcija, lai aizvērtu groza modalitāti
  const handleCloseCartModal = () => {
    setIsCartOpen(false);
  };

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      {/* Ikona grozam, kas atver modalitāti */}
      <div
        className="relative cursor-pointer"
        onClick={() => setIsCartOpen((prev) => !prev)} // Pārslēdz groza modalitātes atvēršanu
      >
        <Image src="/cart.png" alt="Cart" width={22} height={22} /> {/* Groza attēls */}
        {counter > 0 && (
          // Parāda skaitītāju, ja ir pievienoti elementi
          <div className="absolute -top-4 -right-4 w-6 h-6 bg-red-600 rounded-full text-white text-sm flex items-center justify-center">
            {counter}
          </div>
        )}
      </div>
      {/* Parāda groza modalitāti, ja tā ir atvērta */}
      {isCartOpen && <CartModal onClose={handleCloseCartModal} />}
    </div>
  );
};

export default NavIcons; // Eksportē NavIcons komponenti
