import { create } from "zustand";
import { currentCart } from "@wix/ecom";
import { WixClient } from "../context/wixContext";
import { fetchWithWixInstance } from '../utils/auth'; // Import the fetchWithWixInstance function

type CartState = {
  cart: currentCart.Cart | null;
  isLoading: boolean;
  counter: number;
  getCart: (wixClient: WixClient) => Promise<void>;
  addItem: (
    wixClient: WixClient,
    productId: string,
    variantId: string | undefined,
    quantity: number
  ) => Promise<void>;
  removeItem: (wixClient: WixClient, itemId: string) => Promise<void>;
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  isLoading: false,
  counter: 0,
  getCart: async (wixClient) => {
    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      const cart = await wixClient.currentCart.getCurrentCart();
      setTimeout(() => {
        set({
          cart: cart || {},
          counter: cart?.lineItems.length || 0,
          isLoading: false,
        });
      }, 0);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      set({ isLoading: false });
    }
  },
  addItem: async (wixClient, productId, variantId, quantity) => {
    if (!productId || quantity <= 0) return;
    set({ isLoading: true });
    try {
      const response = await wixClient.currentCart.addToCurrentCart({
        lineItems: [
          {
            catalogReference: {
              appId: process.env.NEXT_PUBLIC_WIX_APP_ID!,
              catalogItemId: productId,
              ...(variantId && { options: { variantId } }),
            },
            quantity,
          },
        ],
      });
      setTimeout(() => {
        set((state) => ({
          cart: response.cart || state.cart,
          counter: response.cart?.lineItems.length || state.counter,
          isLoading: false,
        }));
      }, 0);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      set({ isLoading: false });
    }
  },
  removeItem: async (wixClient, itemId) => {
    if (!itemId) return;
    set({ isLoading: true });
    try {
      // Use fetchWithWixInstance for authenticated request to delete the item
      const response = await fetchWithWixInstance(`/wix-data/v2/items/${itemId}`, {
        method: 'DELETE',
        params: {
          dataCollectionId: 'jebanutais kategorijas id jaieliek', // Replace with your actual collection ID
        },
      });
      const result = await response.json();
      setTimeout(() => {
        set((state) => ({
          cart: result.dataItem || state.cart,
          counter: (result.dataItem?.lineItems?.length || state.counter),
          isLoading: false,
        }));
      }, 0);
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      set({ isLoading: false });
    }
  },
}));
