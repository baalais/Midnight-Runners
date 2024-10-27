/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useWixClient } from "../../hooks/useWixClient";
import { products } from "@wix/stores";
import Image from "next/image";
import CartModal from "../../components/CartModal";
import CustomizeProducts from "../../components/CustomizeProducts";
import Reviews from "../../components/Reviews";
import Add from "../../components/Add";
import Header from "~/components/header";
import Footer from "~/components/footer";
import Loading from "../../components/Loading";

// Definē mediju un produkta struktūru
interface Media {
  mainMedia?: {
    image?: {
      url: string;
    };
  };
}

interface Product {
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
  _id?: string;
  brand?: string | null;
  stock?: {
    quantity: number;
  };
}

// Galvenā ProductPage komponente
const ProductPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query; // Iegūst produkta slug no URL
  const { wixClient, clientReady } = useWixClient(); // Iegūst Wix klientu un tā gatavības statusu
  const [product, setProduct] = useState<Product | null>(null); // Stāvoklis, lai turētu iegūto produktu
  const [loading, setLoading] = useState(true); // Ielādes stāvoklis
  const [error, setError] = useState<string | null>(null); // Kļūdu stāvoklis
  const [isCartModalOpen, setCartModalOpen] = useState(false); // Stāvoklis, lai pārvaldītu iepirkumu modālā loga redzamību

  // Efekts, lai iegūtu produkta datus, kad slug vai klienta statuss mainās
  useEffect(() => {
    const fetchProduct = async () => {
      // Agrīna atgriešanās, ja atkarības nav gatavas
      if (!slug || !clientReady || !wixClient) return;

      setLoading(true); // Iestata ielādes statusu uz true pirms iegūšanas
      setError(null); // Atiestata kļūdu stāvokli

      try {
        // Vaicā Wix par produktu, pamatojoties uz slug
        const productsResponse = await wixClient.products
          .queryProducts()
          .eq("slug", slug as string)
          .find();

        // Pārbauda, vai produkts tika atrasts
        if (!productsResponse.items.length) {
          setError("Produkts nav atrasts. Lūdzu, pārbaudiet URL vai mēģiniet vēlreiz.");
          return;
        }

        const productData = productsResponse.items[0]; // Iegūst pirmo produktu

        // Pārvērš produkta datus noteiktajā struktūrā
        const transformedProduct: Product = {
          name: productData.name || "Neievadīts produkts",
          media: {
            mainMedia: {
              image: {
                url: productData.media?.mainMedia?.image?.url || "/default-image.png",
              },
            },
          },
          description: productData.description || "Nav pieejama apraksta informācija",
          price: productData.price
            ? {
                price: productData.price.price || 0,
                discountedPrice: productData.price.discountedPrice,
              }
            : undefined,
          variants: productData.variants,
          productOptions: productData.productOptions,
          additionalInfoSections: productData.additionalInfoSections?.map((section) => ({
            title: section.title || "Bez virsraksta",
            description: section.description || "Bez apraksta",
          })) || [],
          _id: productData._id,
          brand: productData.brand,
          stock: productData.stock,
        };

        setProduct(transformedProduct); // Atjaunina produkta stāvokli
      } catch (error) {
        console.error("Kļūda, iegūstot produktu:", error);
        setError("Neizdevās iegūt produktu. Lūdzu, pārbaudiet interneta savienojumu un mēģiniet vēlreiz.");
      } finally {
        setLoading(false); // Iestata ielādes statusu uz false pēc mēģinājuma
      }
    };

    fetchProduct(); // Izsauc funkciju, lai iegūtu produktu
  }, [slug, wixClient, clientReady]); // Atkarības, kas izsauc efektu

  // Attēlo ielādes stāvokli
  if (loading) return <Loading />;
  // Attēlo kļūdas ziņojumu
  if (error) return <p className="text-center text-red-600">{error}</p>;
  // Attēlo ziņojumu, ja produkts nav atrasts
  if (!product) return <p className="text-center text-lg">Produkts nav atrasts.</p>;

  // Funkcija, lai pārslēgtu iepirkumu modālā loga redzamību
  const toggleCartModal = () => {
    setCartModalOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header /> {/* Attēlo galveni */}
      <div className="flex-grow container mx-auto px-4 md:px-8 pt-20 lg:flex lg:flex-row lg:items-start">
        <div className="w-full lg:w-1/2 lg:sticky top-20">
          <Image
            src={product.media.mainMedia?.image?.url || "/product.png"}
            alt={product.name || "Produkta attēls"}
            width={600}
            height={600}
            className="rounded-lg shadow-lg max-h-90 object-cover"
          />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col p-6 bg-gray-50 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p
            className="text-gray-700 mb-4"
            dangerouslySetInnerHTML={{ __html: product.description }} // Attēlo HTML aprakstu
          />
          <div className="flex items-center mb-4">
            {product.price && product.price.price === product.price.discountedPrice ? (
              <span className="text-2xl font-semibold">
                €{product.price.price}
              </span>
            ) : (
              product.price && (
                <div className="flex items-center">
                  <span className="text-lg text-gray-500 line-through mr-2">
                    €{product.price.price}
                  </span>
                  <span className="text-2xl font-semibold text-red-600">
                    €{product.price.discountedPrice}
                  </span>
                </div>
              )
            )}
          </div>
          {product.variants && product.productOptions ? (
            <CustomizeProducts
              productId={product._id!}
              variants={product.variants}
              productOptions={product.productOptions}
            />
          ) : (
            <Add
              productId={product._id!}
              variantId="00000000-0000-0000-0000-000000000000" // Noklusējuma variantu ID
              stockNumber={product.stock?.quantity || 0} // Krājuma daudzums
            />
          )}
          <div className="my-6 border-t border-gray-300" />
          {product.additionalInfoSections?.map((section) => (
            <div className="mb-4" key={section.title}>
              <h4 className="font-medium text-lg mb-2">{section.title}</h4>
              <p className="text-gray-600">{section.description}</p>
            </div>
          ))}
          <div className="my-6 border-t border-gray-300" />
          <h1 className="text-2xl font-semibold mt-4">Lietotāju atsauksmes</h1>
          <Reviews productId={product._id!} />
        </div>
        {isCartModalOpen && <CartModal onClose={toggleCartModal} />} {/* Attēlo iepirkumu modālo logu, ja tas ir atvērts */}
      </div>
      <Footer /> {/* Attēlo kājējo informāciju */}
    </div>
  );
};

export default ProductPage;
