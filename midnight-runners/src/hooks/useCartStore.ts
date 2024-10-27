/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { create } from 'zustand';
import { currentCart } from '@wix/ecom';
import { WixClient } from '../context/wixContext';

// Definē stāvokļa tipu
type CartState = {
  cart: currentCart.Cart | null; // Grozs, kas var būt vai nu cart objekts, vai null
  counter: number; // Groza vienību skaits
  isLoading: boolean; // Ielādes stāvoklis
  getCart: (wixClient: WixClient) => void; // Funkcija, lai iegūtu grozu
  addItem: (
    wixClient: WixClient,
    productId: string,
    variantId: string,
    quantity: number
  ) => void; // Funkcija, lai pievienotu vienību grozam
  removeItem: (wixClient: WixClient, itemId: string) => void; // Funkcija, lai noņemtu vienību no groza
};

// Izveido groza veikala stāvokļa veikalu ar zustand
export const useCartStore = create<CartState>((set) => ({
  cart: null, // Sākotnējais grozs ir null
  counter: 0, // Sākotnējais vienību skaits ir 0
  isLoading: false, // Ielādes stāvoklis ir false
  // Funkcija groza iegūšanai
  getCart: async (wixClient) => {
    set({ isLoading: true }); // Iestata ielādes stāvokli uz true
    try {
      const cart = await currentCart.getCurrentCart(); // Iegūst pašreizējo grozu
      set({
        cart: cart || null, // Iestata groza stāvokli
        counter: cart?.lineItems?.length || 0, // Iestata vienību skaitu
        isLoading: false, // Iestata ielādes stāvokli uz false
      });
    } catch (err) {
      console.error('Error fetching cart:', err); // Kļūdas apstrāde
      set({ isLoading: false }); // Iestata ielādes stāvokli uz false
    }
  },
  // Funkcija, lai pievienotu produktu grozam
  addItem: async (wixClient, productId, variantId, quantity) => {
    set({ isLoading: true }); // Iestata ielādes stāvokli uz true
    try {
      const response = await currentCart.addToCurrentCart({
        lineItems: [
          {
            catalogReference: {
              appId: process.env.NEXT_PUBLIC_WIX_APP_ID!, // Wix aplikācijas ID
              catalogItemId: productId, // Produkta ID
              ...(variantId && { options: { variantId } }), // Ja ir variantu ID, pievieno to
            },
            quantity: quantity, // Iestata pievienojamo vienību daudzumu
          },
        ],
      });
      console.log('Add to cart response:', response); // Konsolē atbildi no groza pievienošanas
      if (response && response.cart) {
        set({
          cart: response.cart, // Iestata jauno grozu
          counter: response.cart?.lineItems?.length || 0, // Iestata vienību skaitu
          isLoading: false, // Iestata ielādes stāvokli uz false
        });
      } else {
        console.warn('No cart returned in response:', response); // Ja grozs netiek atgriezts
        set({ isLoading: false }); // Iestata ielādes stāvokli uz false
      }
    } catch (err) {
      console.error('Error in addToCurrentCart:', err); // Kļūdas apstrāde
      set({ isLoading: false }); // Iestata ielādes stāvokli uz false
    }
  },
  // Funkcija, lai noņemtu produktu no groza
  removeItem: async (wixClient, itemId) => {
    set({ isLoading: true }); // Iestata ielādes stāvokli uz true
    try {
      const response = await currentCart.removeCouponFromCurrentCart(); // Izsauc noņemšanas funkciju
      set({
        cart: response.cart, // Iestata jauno grozu
        counter: response.cart?.lineItems?.length || 0, // Iestata vienību skaitu
        isLoading: false, // Iestata ielādes stāvokli uz false
      });
    } catch (err) {
      console.error('Error in removeItem:', err); // Kļūdas apstrāde
      set({ isLoading: false }); // Iestata ielādes stāvokli uz false
    }
  },
}));
