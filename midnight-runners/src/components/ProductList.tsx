/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { useEffect, useState } from "react";
import { wixClientServer } from "../app/lib/wixClientServer";
import { products } from "@wix/stores";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import Pagination from "../components/pagination";

const PRODUCT_PER_PAGE = 8;

interface SearchParams {
  name?: string; // Optional name filter
  type?: string; // Optional type filter
  min?: number; // Minimum price
  max?: number; // Maximum price
  page?: number; // Current page number
  sort?: string; // Sorting criteria
}

const ProductList = ({
  limit = PRODUCT_PER_PAGE,
  searchParams = {} as SearchParams,
}: {
  limit?: number;
  searchParams?: SearchParams;
}) => {
  const [productData, setProductData] = useState<products.Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Destructure and provide default values for search parameters
  const { name = "", type = "", min = 0, max = 999999, page = 1, sort = "" } = searchParams;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      console.log("Fetching products...");

      // Log the search parameters
      console.log("Search Parameters:", { name, type, min, max, page, sort });
  
      try {
        const wixClient = await wixClientServer();
  
        const productQuery = wixClient.products
          .queryProducts()
          .startsWith("name", name)
          .hasSome("productType", type ? [type] : ["physical", "digital"])
          .gt("priceData.price", min)
          .lt("priceData.price", max)
          .limit(limit)
          .skip((page - 1) * limit);
  
        if (sort) {
          const [sortType, sortBy] = sort.split(" ");
          if (sortBy) {
            if (sortType === "asc") productQuery.ascending(sortBy);
            if (sortType === "desc") productQuery.descending(sortBy);
          }
        }
  
        const res = await productQuery.find();
        console.log("API Response:", res);  // Log full response
        console.log("Fetched products:", res.items);
        setProductData(res.items);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, [limit, name, type, min, max, page, sort]);

  // Handle loading and error states
  if (error) return <p>{error}</p>;
  if (loading) return <p>Loading...</p>;
  if (productData.length === 0) return <p>No products found!</p>;

  return (
    <div className="mt-12 flex gap-x-4 gap-y-8 justify-center flex-wrap">
      {productData.map((product) => (
        <Link
          href={`/${product.slug}`}
          className="w-full sm:w-[45%] md:w-[30%] lg:w-[22%] flex flex-col gap-4 p-4 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          key={product._id}
        >
          <div className="relative w-full h-56"> {/* Reduced height */}
            <Image
              src={product.media?.mainMedia?.image?.url || "/product.png"}
              alt={product.name || "Product image"} // Provide a fallback alt text
              fill
              sizes="25vw"
              className="absolute object-cover rounded-md z-10"
            />
            {product.media?.items?.[1] && (
              <Image
                src={product.media.items[1]?.image?.url || "/product.png"}
                alt={product.name || "Product image"}
                fill
                sizes="25vw"
                className="absolute object-cover rounded-md opacity-50" // Optional: make the second image less prominent
              />
            )}
          </div>
          <div className="flex justify-between">
            <span className="font-medium">{product.name}</span>
            <span className="font-semibold">
              ${product.price?.price ? product.price.price.toFixed(2) : "N/A"}
            </span>
          </div>
          {product.additionalInfoSections?.some((section) => section.title === "shortDesc") && (
            <div
              className="text-sm text-gray-500"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  product.additionalInfoSections.find(
                    (section: any) => section.title === "shortDesc"
                  )?.description || ""
                ),
              }}
            ></div>
          )}
          <button className="rounded-2xl ring-1 ring-lama text-lama w-max py-2 px-4 text-xs hover:bg-lama hover:text-white">
            Add to Cart
          </button>
        </Link>
      ))}
      {name && (
        <Pagination
          currentPage={page}
          hasPrev={page > 1}
          hasNext={productData.length === limit}
        />
      )}
    </div>
  );
};

export default ProductList;
