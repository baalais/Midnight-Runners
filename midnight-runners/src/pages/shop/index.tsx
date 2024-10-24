import React, { useEffect, useState } from "react";
import { useWixClient } from "../../hooks/useWixClient";
import { products } from "@wix/stores";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import Pagination from "../../components/pagination";
import Loading from "../../components/Loading";
import Header from "~/components/header";
import Footer from "~/components/footer";

const PRODUCTS_PER_PAGE = 100;

const ProductList = () => {
  const { wixClient, clientReady } = useWixClient();
  const [productsData, setProductsData] = useState<products.Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!clientReady || !wixClient) {
        console.warn("Wix client is not ready.");
        return; // Early return if client is not ready
      }

      setLoading(true);
      setError(null);

      try {
        const response = await wixClient.products
          .queryProducts()
          .limit(PRODUCTS_PER_PAGE)
          .skip((currentPage - 1) * PRODUCTS_PER_PAGE)
          .find();

        setProductsData(response.items);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const checkClientReady = () => {
      if (clientReady && wixClient) {
        fetchProducts();
      } else {
        setTimeout(checkClientReady, 100); // Retry after 100ms
      }
    };

    checkClientReady(); // Start checking if the client is ready
  }, [currentPage, wixClient, clientReady]); // Dependency on clientReady

  if (loading) return <Loading />;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div>
      <Header />
      <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 pt-20">
        <h1 className="text-4xl font-medium mb-6">All Products</h1>
        <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
          {productsData.map((product) => (
            <Link
              href={`/shop/${product.slug}`}
              className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
              key={product._id}
            >
              <div className="relative w-full h-80">
                <Image
                  src={product.media?.mainMedia?.image?.url || "/product.png"}
                  alt={product.name || "Product name"}
                  fill
                  sizes="25vw"
                  className="absolute object-cover rounded-md"
                />
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{product.name}</span>
                <span className="font-semibold">€{product.price?.price}</span>
              </div>
              {product.additionalInfoSections && (
                <div
                  className="text-sm text-gray-500"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      product.additionalInfoSections.find(
                        (section: any) => section.title === "shortDesc"
                      )?.description || ""
                    ),
                  }}
                />
              )}
              <button className="rounded-2xl ring-1 ring-blue-500 text-blue-500 w-max py-2 px-4 text-xs hover:bg-blue-500 hover:text-white">
                Add to Cart
              </button>
            </Link>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          hasPrev={currentPage > 1}
          hasNext={productsData.length === PRODUCTS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
      <Footer />
    </div>
  );
};

export default ProductList;
