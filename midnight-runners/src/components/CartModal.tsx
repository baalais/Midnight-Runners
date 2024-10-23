/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import Image from "next/image";
import { useCartStore } from "../hooks/useCartStore";
import { media as wixMedia } from "@wix/sdk";
import { useWixClient } from "../hooks/useWixClient";
import { currentCart } from "@wix/ecom";

// Definē komponentes CartModal props
interface CartModalProps {
  onClose: () => void; // Funkcija modāla aizvēršanai
}

// Galvenā komponente CartModal, kas apstrādā grozu
const CartModal: React.FC<CartModalProps> = ({ onClose }) => {
  const wixClient = useWixClient(); // Inicializē Wix klientu
  const { cart, isLoading, removeItem } = useCartStore(); // Pārvalda groza stāvokli, ielādes stāvokli un preču noņemšanu

  // Funkcija, kas apstrādā norēķināšanās procesu
  const handleCheckout = async () => {
    try {
      // Izveido norēķinu sesiju, izmantojot pašreizējo grozu
      const checkout = await wixClient.currentCart.createCheckoutFromCurrentCart({
        channelType: currentCart.ChannelType.WEB,
      });

      // Izveido novirzīšanas sesiju pēc veiksmīgas norēķināšanās
      const { redirectSession } = await wixClient.redirects.createRedirectSession({
        ecomCheckout: { checkoutId: checkout.checkoutId },
        callbacks: {
          postFlowUrl: window.location.origin, // Norāda pēc maksājuma atgriešanās URL
          thankYouPageUrl: `${window.location.origin}/success`, // Norāda veiksmīgas maksājuma lapu
        },
      });

      // Novirza lietotāju uz norēķināšanās lapu
      if (redirectSession?.fullUrl) {
        window.location.href = redirectSession.fullUrl;
      }
    } catch (err) {
      console.error(err); // Apstrādā kļūdas
    }
  };

  return (
    <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20 text-black">
      {/* Pievieno tekstu melnā krāsā, lai tas būtu redzams */}
      <button onClick={onClose} className="close-button">Close</button>
      {!cart.lineItems ? (
        <div className="text-black">Cart is Empty</div> // Ja grozs ir tukšs
      ) : (
        <>
          <h2 className="text-xl font-bold text-black">Shopping Cart</h2>
          {/* Preču saraksts grozā */}
          <div className="flex flex-col gap-8">
            {/* Katra prece grozā */}
            {cart.lineItems.map((item) => (
              <div className="flex gap-4" key={item._id}>
                {item.image && (
                  <Image
                    src={wixMedia.getScaledToFillImageUrl(item.image, 72, 96, {})} // Iegūst attēla URL un iestata izmērus
                    alt=""
                    width={72}
                    height={96}
                    className="object-cover rounded-md"
                  />
                )}
                <div className="flex flex-col justify-between w-full">
                  {/* Preces informācijas augšējā daļa */}
                  <div>
                    {/* Preces nosaukums un cena */}
                    <div className="flex items-center justify-between gap-8">
                      <h3 className="font-semibold text-black">
                        {item.productName?.original}
                      </h3>
                      <div className="p-1 bg-gray-50 rounded-sm flex items-center gap-2 text-black">
                        {item.quantity && item.quantity > 1 && (
                          <div className="text-xs text-green-500">
                            {item.quantity} x{" "}
                          </div>
                        )}
                        €{item.price?.amount}
                      </div>
                    </div>
                    {/* Preces pieejamības statuss */}
                    <div className="text-sm text-gray-500">
                      {item.availability?.status}
                    </div>
                  </div>
                  {/* Apakšējā daļa ar preces daudzumu un noņemšanas opciju */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Qty. {item.quantity}</span>
                    <span
                      className="text-blue-500"
                      style={{ cursor: isLoading ? "not-allowed" : "pointer" }} // Deaktivē noņemšanas pogu, kamēr tiek ielādēts
                      onClick={() => removeItem(wixClient, item._id!)} // Funkcija preces noņemšanai no groza
                    >
                      Remove
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Kopējā summa un norēķināšanās pogas */}
          <div className="">
            <div className="flex items-center justify-between font-semibold text-black">
              <span>Subtotal</span>
              <span>€{cart.subtotal.amount}</span> {/* Kopējā groza summa */}
            </div>
            <p className="text-gray-500 text-sm mt-2 mb-4">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="flex justify-between text-sm">
              <button className="rounded-md py-3 px-4 ring-1 ring-gray-300 text-black">
                View Cart
              </button>
              <button
                className="rounded-md py-3 px-4 bg-black text-white disabled:cursor-not-allowed disabled:opacity-75"
                disabled={isLoading} // Deaktivē pogu, kamēr norēķināšanās notiek
                onClick={handleCheckout} // Funkcija norēķināšanās sākšanai
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartModal;
