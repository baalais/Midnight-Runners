/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useWixClient } from "../hooks/useWixClient";
import { products } from "@wix/stores";
import Image from "next/image";
import CartModal from "../components/CartModal";
import CustomizeProducts from "../components/CustomizeProducts";
import Reviews from "../components/Reviews";
import Add from "../components/Add";
import Header from "~/components/header";
import Footer from "~/components/footer";

// Define Media and Product interfaces
interface Media {
  items: {
    url: string;
  }[];
}

interface Product extends products.GetProductResponse {
  name: string;
  media: Media;
  description: string;
  price?: {
    price: number;
    discountedPrice?: number;
  };
  variants?: any[];
  productOptions?: any[];
  additionalInfoSections?: {
    title: string;
    description: string;
  }[];
}

const ProductPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const wixClient = useWixClient();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCartModalOpen, setCartModalOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        const productsResponse = await wixClient.products
          .queryProducts()
          .eq("slug", slug as string)
          .find();

        if (!productsResponse.items[0]) {
          setError("Product not found.");
          return;
        }

        const productData = productsResponse.items[0];
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to fetch product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, wixClient]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  const toggleCartModal = () => {
    setCartModalOpen((prev) => !prev);
  };

  return (
    <div>
      <Header />
      {/* Add padding to avoid header overlap */}
      <div className="product-page px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 pt-24 flex flex-col lg:flex-row gap-16">
        {/* IMG */}
        <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
          <Image
            src={product.media?.mainMedia?.image?.url || "/product.png"}
            alt={product.name}
            width={400}
            height={400}
            className="product-image"
          />
        </div>
        {/* TEXTS */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <h1 className="text-4xl font-medium">{product.name}</h1>
          <p className="text-gray-500">{product.description}</p>
          <div className="h-[2px] bg-gray-100" />
          {product.price?.price === product.price?.discountedPrice ? (
            <h2 className="font-medium text-2xl">${product.price?.price}</h2>
          ) : (
            <div className="flex items-center gap-4">
              <h3 className="text-xl text-gray-500 line-through">
                ${product.price?.price}
              </h3>
              <h2 className="font-medium text-2xl">
                ${product.price?.discountedPrice}
              </h2>
            </div>
          )}
          <div className="h-[2px] bg-gray-100" />
          {product.variants && product.productOptions ? (
            <CustomizeProducts
              productId={product._id!}
              variants={product.variants}
              productOptions={product.productOptions}
            />
          ) : (
            <Add
              productId={product._id!}
              variantId="00000000-0000-0000-0000-000000000000"
              stockNumber={product.stock?.quantity || 0}
            />
          )}
          <div className="h-[2px] bg-gray-100" />
          {product.additionalInfoSections?.map((section) => (
            <div className="text-sm" key={section.title}>
              <h4 className="font-medium mb-4">{section.title}</h4>
              <p>{section.description}</p>
            </div>
          ))}
          <div className="h-[2px] bg-gray-100" />
          {/* REVIEWS */}
          <h1 className="text-2xl">User Reviews</h1>
          <Reviews productId={product._id!} />
        </div>
        {isCartModalOpen && <CartModal onClose={toggleCartModal} />}
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
