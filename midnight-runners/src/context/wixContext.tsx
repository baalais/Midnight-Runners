/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

"use client";

import { createClient, OAuthStrategy } from "@wix/sdk";
import { products, collections } from "@wix/stores";
import { currentCart } from "@wix/ecom";
import Cookies from "js-cookie";
import { createContext, ReactNode, useEffect, useState } from "react";
import { redirects } from '@wix/redirects';

// Iestata Wix klientu, izmantojot OAuthStrategy
const refreshToken = JSON.parse(Cookies.get("refreshToken") || "{}");

const wixClient = createClient({
  modules: {
    products,
    collections,
    currentCart,
    redirects
  },
  auth: OAuthStrategy({
    clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
    tokens: {
      refreshToken,
      accessToken: { value: "", expiresAt: 0 },
    },
  }),
});

// Izveido WixClient kontekstu
export type WixClient = typeof wixClient;

export const WixClientContext = createContext<WixClient>(wixClient);

// Konteksta nodrošinātāja komponents
export const WixClientContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <WixClientContext.Provider value={wixClient}>
      {children}
    </WixClientContext.Provider>
  );
};

// Funkcija, lai iegūtu produktus no Wix API
// export const wixClientServer = async () => {
//   try {
//     const response = await fetch('YOUR_API_URL'); // Nodrošiniet pareizu API izsaukumu
//     const textData = await response.text(); // Iegūstiet neapstrādātu teksta atbildi

//     // Atkodējiet datus, ja tie ir URL-iekodēti
//     const decodedData = decodeURIComponent(textData);

//     // Pārvērst atkodētos datus par JSON
//     const jsonData = JSON.parse(decodedData);

//     return jsonData;  // Atgriežot analizēto objektu
//   } catch (error) {
//     console.error('Error in wixClientServer:', error);
//     throw error;
//   }
// };

// React komponents produktu iegūšanai un attēlošanai
const ProductList = ({
  categoryId,
  limit,
  searchParams,
}: {
  categoryId: string;
  limit?: number;
  searchParams?: any;
}) => {
  const [loading, setLoading] = useState(false); // Ielādes statuss
  const [products, setProducts] = useState([]); // Saglabā produktus

  // Iegūt produktus, izmantojot useEffect
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     setLoading(true); // Sāk ielādi
  //     try {
  //       const wixClient = await wixClientServer();
  //       // Šeit varat apstrādāt produktu vaicājuma loģiku, iestatot rezultātu uz stāvokli
  //       setProducts(wixClient.products || []); // Saglabā produktus
  //     } catch (error) {
  //       console.error("Error fetching products:", error); // Kļūdu apstrāde
  //     } finally {
  //       setLoading(false); // Beidz ielādi
  //     }
  //   };

  //   fetchProducts(); // Izsauc produktu iegūšanas funkciju
  // }, [categoryId, limit, searchParams]);

  return (
    <div>
      {loading ? (
        <p>Loading products...</p> // Ielādes ziņojums
      ) : (
        <ul>
          {products.map((product: any) => (
            <li key={product._id}>{product.name}</li> // Attēlo produktus
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;
