"use client";

import { useCartStore } from "../hooks/useCartStore"; 
import { useWixClient } from "../hooks/useWixClient";
import { useState } from "react";

// Komponente Add, kas apstrādā produkta pievienošanu grozam
const Add = ({
  productId,
  variantId,
  stockNumber,
}: {
  productId: string;
  variantId: string;
  stockNumber: number;
}) => {
  const [quantity, setQuantity] = useState(1); // Stāvoklis, kas kontrolē izvēlēto daudzumu

  // Funkcija, kas apstrādā preces daudzuma maiņu (palielināt vai samazināt)
  const handleQuantity = (type: "i" | "d") => {
    if (type === "d" && quantity > 1) { // Samazina daudzumu, ja tas ir lielāks par 1
      setQuantity((prev) => prev - 1);
    }
    if (type === "i" && quantity < stockNumber) { // Palielina daudzumu, ja noliktavā pieejams vairāk
      setQuantity((prev) => prev + 1);
    }
  };

  const wixClient = useWixClient(); // Inicializē Wix klientu

  const { addItem, isLoading } = useCartStore(); // Pievienošana grozam un ielādes stāvokļa pārbaude

  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-medium">Choose a Quantity</h4>
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          {/* Daudzuma izvēles bloks */}
          <div className="bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-32">
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
              onClick={() => handleQuantity("d")} // Samazina daudzumu
              disabled={quantity === 1} // Deaktivē poga, ja daudzums ir 1
            >
              -
            </button>
            {quantity} {/* Izvadīt pašreizējo daudzumu */}
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
              onClick={() => handleQuantity("i")} // Palielina daudzumu
              disabled={quantity === stockNumber} // Deaktivē poga, ja sasniegts noliktavas daudzuma limits
            >
              +
            </button>
          </div>
          {/* Informācija par noliktavas pieejamību */}
          {stockNumber < 1 ? (
            <div className="text-xs">Product is out of stock</div> // Ja prece nav noliktavā
          ) : (
            <div className="text-xs">
              Only <span className="text-orange-500">{stockNumber} items</span> left!
              <br /> {"Don't"} miss it
            </div>
          )}
        </div>
        {/* Poga, lai pievienotu preci grozam */}
        <button
          onClick={() => addItem(wixClient, productId, variantId, quantity)} // Funkcija pievieno preci grozam
          disabled={isLoading} // Deaktivē pogu, kamēr prece tiek pievienota
          className="w-36 text-sm rounded-3xl ring-1 ring-lama text-lama py-2 px-4 hover:bg-lama hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Add;
