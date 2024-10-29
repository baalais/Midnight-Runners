/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useEffect, useState } from "react";
import { fetchProducts } from "../../utils/fetchProducts"; // Make sure to create this function to call your API
import Image from "next/image";
import Link from "next/link";
import Pagination from "../../components/pagination";
import Loading from "../../components/Loading";
import Header from "~/components/header";
import Footer from "~/components/footer";

const PRODUCTS_PER_PAGE = 100; // Define how many products to display per page

// Main ProductList component
const ProductList: React.FC = () => {
  const [productsData, setProductsData] = useState<any[]>([]); // State to hold product data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [currentPage, setCurrentPage] = useState(1); // Current page

  // Effect to fetch products when the page changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Set loading state to true
      setError(null); // Reset error state

      try {
        const response = await fetch("https://www.midnightrunners.club/_functions/get_products?page=" + currentPage); // Adjust the API URL as necessary
        const data = await response.json();
        
        if (response.ok) {
          setProductsData(data.items); // Set fetched products to state
        } else {
          throw new Error(data.message || "Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again later."); // Set error message
      } finally {
        setLoading(false); // Set loading state to false
      }
    };

    fetchProducts(); // Call the fetch function
  }, [currentPage]); // Re-run when currentPage changes

  // Display loading state
  if (loading) return <Loading />;
  // Display error message
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div>
      <Header /> {/* Display header */}
      <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 pt-20">
        <h1 className="text-4xl font-medium mb-6">All Products</h1> {/* Main title */}
        <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
          {productsData.map((product) => (
            <Link
              href={`/shop/${product.slug}`} // Navigate to product page
              className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
              key={product._id}
            >
              <div className="relative w-full h-80">
                <Image
                  src={product.mainMedia.replace('wix:image://', 'https://static.wixstatic.com/media/')} // Format the image URL
                  alt={product.name || "Product Name"}
                  fill
                  sizes="25vw"
                  className="absolute object-cover rounded-md"
                />
              </div>
              <div className="flex justify-between">
                <span className="font-medium">{product.name}</span>
                <span className="font-semibold">€{product.price}</span>
              </div>
              {product.additionalInfoSections && (
                <div className="text-sm text-gray-500">
                  {product.additionalInfoSections.find((section: any) => section.title === "PRODUCT INFO")?.description}
                </div>
              )}
              <button className="rounded-2xl ring-1 ring-blue-500 text-blue-500 w-max py-2 px-4 text-xs hover:bg-blue-500 hover:text-white">
                Add to Cart
              </button> {/* Button to add product to cart */}
            </Link>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          hasPrev={currentPage > 1} // Check if there is a previous page
          hasNext={productsData.length === PRODUCTS_PER_PAGE} // Check if there is a next page
          onPageChange={setCurrentPage} // Function to change page
        />
      </div>
      <Footer /> {/* Display footer */}
    </div>
  );
};

export default ProductList;
