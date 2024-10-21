/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// useCartStore.ts

import { create } from "zustand";
import { currentCart } from "@wix/ecom";
import { WixClient } from "../context/wixContext";

// Definē karšu stāvokļa tipu
type CartState = {
  cart: currentCart.Cart; // Karšu dati
  isLoading: boolean; // Ielādes statuss
  counter: number; // Produktu skaits grozā
  getCart: (wixClient: WixClient) => void; // Funkcija, lai iegūtu grozu
  addItem: ( // Funkcija, lai pievienotu preci grozam
    wixClient: WixClient,
    productId: string,
    variantId: string,
    quantity: number
  ) => void;
  removeItem: ( // Funkcija, lai noņemtu preci no groza
    wixClient: WixClient,
    itemId: string
  ) => void;
};

// Izveido Zustand veikalu
export const useCartStore = create<CartState>((set) => ({
  cart: [], // Sākotnējais groza stāvoklis
  isLoading: true, // Sākotnējais ielādes statuss
  counter: 0, // Sākotnējais preču skaits grozā
  getCart: async (wixClient) => {
    try {
      const cart = await wixClient.currentCart.getCurrentCart(); // Iegūst pašreizējo grozu
      set({
        cart: cart || [], // Iestata grozu vai tukšu masīvu
        isLoading: false, // Iestata ielādes statusu
        counter: cart?.lineItems.length || 0, // Iestata preču skaitu grozā
      });
    } catch (err) {
      set((prev) => ({ ...prev, isLoading: false })); // Kļūdas gadījumā atjaunina ielādes statusu
    }
  },
  addItem: async (wixClient, productId, variantId, quantity) => {
    set((state) => ({ ...state, isLoading: true })); // Sāk ielādi
    const response = await wixClient.currentCart.addToCurrentCart({
      lineItems: [
        {
          catalogReference: {
            appId: process.env.NEXT_PUBLIC_WIX_APP_ID!, // Wix lietotnes ID
            catalogItemId: productId, // Produktu ID
            ...(variantId && { options: { variantId } }), // Variant ID, ja tas ir pieejams
          },
          quantity: quantity, // Preču daudzums
        },
      ],
    });

    set({
      cart: response.cart, // Atjaunina groza datus
      counter: response.cart?.lineItems.length, // Atjaunina preču skaitu grozā
      isLoading: false, // Beidz ielādi
    });
  },
  removeItem: async (wixClient, itemId) => {
    set((state) => ({ ...state, isLoading: true })); // Sāk ielādi
    const response = await wixClient.currentCart.removeLineItemsFromCurrentCart(
      [itemId] // Noņem precēm ID no groza
    );

    set({
      cart: response.cart, // Atjaunina groza datus
      counter: response.cart?.lineItems.length, // Atjaunina preču skaitu grozā
      isLoading: false, // Beidz ielādi
    });
  },
}));
