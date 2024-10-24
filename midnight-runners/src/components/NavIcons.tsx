import { useEffect, useState } from "react";
import { useWixClient } from "../hooks/useWixClient";
import { useCartStore } from "../hooks/useCartStore";
import Image from "next/image";
import CartModal from "../components/CartModal";

const NavIcons = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, counter, getCart, isLoading } = useCartStore(); // Get isLoading from the store
  const wixClient = useWixClient();

  useEffect(() => {
    if (wixClient && counter === 0 && !isLoading) {
      getCart(wixClient);
    }
  }, [wixClient, counter, isLoading, getCart]); // Add isLoading to dependencies

  const handleCloseCartModal = () => {
    setIsCartOpen(false);
  };

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      <div
        className="relative cursor-pointer"
        onClick={() => setIsCartOpen((prev) => !prev)}
      >
        <Image src="/cart.png" alt="Cart" width={22} height={22} />
        {counter > 0 && (
          <div className="absolute -top-4 -right-4 w-6 h-6 bg-red-600 rounded-full text-white text-sm flex items-center justify-center">
            {counter}
          </div>
        )}
      </div>
      {isCartOpen && <CartModal onClose={handleCloseCartModal} />}
    </div>
  );
};

export default NavIcons;
