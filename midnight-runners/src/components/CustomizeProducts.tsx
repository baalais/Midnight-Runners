/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
"use client";

import { products } from "@wix/stores";
import { useEffect, useState } from "react";
import Add from "./Add";

// Komponente, kas pielāgo produktus
const CustomizeProducts = ({
  productId,
  variants,
  productOptions,
}: {
  productId: string; // Produkta ID
  variants: products.Variant[]; // Produkta varianti
  productOptions: products.ProductOption[]; // Produkta iespējas
}) => {
  // Izveido atlasītās iespējas stāvokli
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({});

  // Izveido atlasīto variantu stāvokli
  const [selectedVariant, setSelectedVariant] = useState<products.Variant>();

  // Lieto efektu, lai atjauninātu atlasīto variantu, kad mainās atlasītās iespējas
  useEffect(() => {
    const variant = variants.find((v) => {
      const variantChoices = v.choices; // Iegūst varianta izvēles
      if (!variantChoices) return false; // Ja nav izvēļu, atgriež false
      return Object.entries(selectedOptions).every(
        ([key, value]) => variantChoices[key] === value // Pārbauda, vai visas izvēles atbilst variantam
      );
    });
    setSelectedVariant(variant); // Iestata atlasīto variantu
  }, [selectedOptions, variants]); // Atkarības: atlasītās iespējas un varianti

  // Funkcija, kas apstrādā izvēlēto iespēju
  const handleOptionSelect = (optionType: string, choice: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionType]: choice })); // Atjaunina atlasītās iespējas
  };

  // Funkcija, lai pārbaudītu, vai variants ir pieejams krājumā
  const isVariantInStock = (choices: { [key: string]: string }) => {
    return variants.some((variant) => {
      const variantChoices = variant.choices; // Iegūst varianta izvēles
      if (!variantChoices) return false; // Ja nav izvēļu, atgriež false

      return (
        Object.entries(choices).every(
          ([key, value]) => variantChoices[key] === value // Pārbauda, vai izvēles atbilst variantam
        ) &&
        variant.stock?.inStock && // Pārbauda, vai prece ir pieejama
        variant.stock?.quantity && // Pārbauda, vai ir pieejams daudzums
        variant.stock?.quantity > 0 // Pārbauda, vai pieejamais daudzums ir lielāks par 0
      );
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Izvēļu saraksta izvadīšana */}
      {productOptions.map((option) => (
        <div className="flex flex-col gap-4" key={option.name}>
          <h4 className="font-medium">Izvēlieties {option.name}</h4>
          <ul className="flex items-center gap-3">
            {option.choices?.map((choice) => {
              // Pārbauda, vai variants ir pieejams
              const disabled = !isVariantInStock({
                ...selectedOptions,
                [option.name!]: choice.description!, // Iestata atlasīto izvēli
              });

              const selected =
                selectedOptions[option.name!] === choice.description; // Pārbauda, vai izvēle ir atlasīta

              const clickHandler = disabled
                ? undefined // Ja izvēle nav pieejama, nav pogas nospiešanas funkcijas
                : () => handleOptionSelect(option.name!, choice.description!); // Cita gadījumā pievieno funkciju

              // Ja izvēles opcija ir "Krāsa", attēlot kā aplīti
              return option.name === "Color" ? (
                <li
                  className="w-8 h-8 rounded-full ring-1 ring-gray-300 relative"
                  style={{
                    backgroundColor: choice.value, // Iestata fona krāsu
                    cursor: disabled ? "not-allowed" : "pointer", // Pārbauda, vai izvēle ir pieejama
                  }}
                  onClick={clickHandler} // Poga, kas apstrādā klikšķi
                  key={choice.description}
                >
                  {selected && (
                    <div className="absolute w-10 h-10 rounded-full ring-2 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  )}
                  {disabled && (
                    <div className="absolute w-10 h-[2px] bg-red-400 rotate-45 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  )}
                </li>
              ) : (
                // Citas iespējas tiek attēlotas kā saraksts
                <li
                  className="ring-1 ring-lama text-lama rounded-md py-1 px-4 text-sm"
                  style={{
                    cursor: disabled ? "not-allowed" : "pointer", // Pārbauda, vai izvēle ir pieejama
                    backgroundColor: selected
                      ? "#f35c7a" // Atlasītais fons
                      : disabled
                      ? "#FBCFE8" // Aizliegtais fons
                      : "white", // Noklusējuma fons
                    color: selected || disabled ? "white" : "#f35c7a", // Krāsa atkarībā no stāvokļa
                    boxShadow: disabled ? "none" : "", // Pārbauda, vai pievienot ēnu
                  }}
                  key={choice.description}
                  onClick={clickHandler} // Poga, kas apstrādā klikšķi
                >
                  {choice.description} {/* Attēlo izvēles aprakstu */}
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {/* Pievienot grozam pogu */}
      <Add
        productId={productId} // Piegādā produkta ID
        variantId={
          selectedVariant?._id || "00000000-0000-0000-0000-000000000000" // Piegādā izvēlētā varianta ID vai noklusējuma vērtību
        }
        stockNumber={selectedVariant?.stock?.quantity || 0} // Piegādā izvēlētā varianta pieejamo daudzumu
      />
    </div>
  );
};

export default CustomizeProducts; // Eksportē komponenti
