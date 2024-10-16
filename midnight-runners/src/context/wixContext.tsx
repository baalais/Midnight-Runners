/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// wixClientServer.ts (Combining everything together)

// Import required dependencies
"use client";

import { createClient, OAuthStrategy } from "@wix/sdk";
import { products, collections } from "@wix/stores";
import { currentCart } from "@wix/ecom";
import Cookies from "js-cookie";
import { createContext, ReactNode, useEffect, useState } from "react";
import { redirects } from '@wix/redirects';

// Set up the Wix client using OAuthStrategy
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

// Create the context for WixClient
export type WixClient = typeof wixClient;

export const WixClientContext = createContext<WixClient>(wixClient);

// Context Provider component
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

// Function to fetch products from the Wix API
export const wixClientServer = async () => {
  try {
    const response = await fetch('YOUR_API_URL'); // Ensure correct API call
    const textData = await response.text(); // Get raw text response

    // Decode the data if URL-encoded
    const decodedData = decodeURIComponent(textData);

    // Parse the decoded data to JSON
    const jsonData = JSON.parse(decodedData);

    return jsonData;  // Return the parsed object
  } catch (error) {
    console.error('Error in wixClientServer:', error);
    throw error;
  }
};

// React component to fetch products and display them
const ProductList = ({
  categoryId,
  limit,
  searchParams,
}: {
  categoryId: string;
  limit?: number;
  searchParams?: any;
}) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  // Fetch products using useEffect
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const wixClient = await wixClientServer();
        // You can handle product query logic here, setting the result to state
        setProducts(wixClient.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, limit, searchParams]);

  return (
    <div>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <ul>
          {products.map((product: any) => (
            <li key={product._id}>{product.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;
