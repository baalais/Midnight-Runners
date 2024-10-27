/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-floating-promises */
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

const PRODUCTS_PER_PAGE = 100; // Definē, cik produkti jāparāda vienā lapā

// Galvenā ProductList komponente
const ProductList = () => {
  const { wixClient, clientReady } = useWixClient(); // Iegūst Wix klientu un tā gatavības statusu
  const [productsData, setProductsData] = useState<products.Product[]>([]); // Stāvoklis, lai turētu produktu datus
  const [loading, setLoading] = useState(true); // Ielādes stāvoklis
  const [error, setError] = useState<string | null>(null); // Kļūdu stāvoklis
  const [currentPage, setCurrentPage] = useState(1); // Aktuālā lapa

  // Efekts, lai iegūtu produktus, kad mainās lapas numurs vai klienta gatavības statuss
  useEffect(() => {
    const fetchProducts = async () => {
      // Agrīna atgriešanās, ja klients nav gatavs
      if (!clientReady || !wixClient) {
        console.warn("Wix klients nav gatavs.");
        return;
      }

      setLoading(true); // Iestata ielādes statusu uz true
      setError(null); // Atiestata kļūdu stāvokli

      try {
        // Vaicā Wix par produktiem ar lapas ierobežojumiem
        const response = await wixClient.products
          .queryProducts()
          .limit(PRODUCTS_PER_PAGE)
          .skip((currentPage - 1) * PRODUCTS_PER_PAGE)
          .find();

        setProductsData(response.items); // Iestata iegūtos produktus stāvoklī
      } catch (error) {
        console.error("Kļūda, iegūstot produktus:", error);
        setError("Neizdevās iegūt produktus. Lūdzu, mēģiniet vēlreiz vēlāk.");
      } finally {
        setLoading(false); // Iestata ielādes statusu uz false
      }
    };

    const checkClientReady = () => {
      // Pārbauda, vai klients ir gatavs, un, ja jā, izsauc produktu iegūšanas funkciju
      if (clientReady && wixClient) {
        fetchProducts();
      } else {
        setTimeout(checkClientReady, 100); // Mēģina vēlreiz pēc 100ms
      }
    };

    checkClientReady(); // Sāk pārbaudīt, vai klients ir gatavs
  }, [currentPage, wixClient, clientReady]); // Atkarības, kas izsauc efektu

  // Attēlo ielādes stāvokli
  if (loading) return <Loading />;
  // Attēlo kļūdas ziņojumu
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div>
      <Header /> {/* Attēlo galveni */}
      <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 pt-20">
        <h1 className="text-4xl font-medium mb-6">Visi produkti</h1> {/* Galvenais virsraksts */}
        <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
          {productsData.map((product) => (
            <Link
              href={`/shop/${product.slug}`} // Pāreja uz produkta lapu
              className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
              key={product._id}
            >
              <div className="relative w-full h-80">
                <Image
                  src={product.media?.mainMedia?.image?.url || "/product.png"}
                  alt={product.name || "Produkta nosaukums"}
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
                Pievienot grozam
              </button> {/* Poga, lai pievienotu produktu grozam */}
            </Link>
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          hasPrev={currentPage > 1} // Pārbauda, vai ir iepriekšējā lapa
          hasNext={productsData.length === PRODUCTS_PER_PAGE} // Pārbauda, vai ir nākamā lapa
          onPageChange={setCurrentPage} // Funkcija lapas maiņai
        />
      </div>
      <Footer /> {/* Attēlo kājējo informāciju */}
    </div>
  );
};

export default ProductList;
