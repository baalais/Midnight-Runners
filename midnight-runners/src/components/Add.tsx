/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable react/no-unescaped-entities */
import { currentCart } from '@wix/ecom';
import { useCartStore } from '../hooks/useCartStore';
import { useWixClient } from '../hooks/useWixClient';
import { useState, useEffect } from 'react';

// Definē komponentes props
interface AddProps {
  productId: string;
  variantId: string;
  stockNumber: number; // Preces pieejamais skaits
}

// Komponente, kas ļauj pievienot preci iepirkumu grozam
const Add: React.FC<AddProps> = ({ productId, variantId, stockNumber }) => {
  const [quantity, setQuantity] = useState<number>(1); // Iestata sākotnējo daudzumu uz 1
  const [localLoading, setLocalLoading] = useState<boolean>(false); // Iestata ielādes stāvokli
  const { wixClient, clientReady } = useWixClient(); // Iegūst Wix klientu un tā gatavību
  const { addItem } = useCartStore(); // Iegūst funkciju preces pievienošanai iepirkumu grozam

  // Efekts, kas pārbauda, vai currentCart ir definēts
  useEffect(() => {
    if (currentCart) {
      console.error('currentCart is not defined on wixClient'); // Ja nav definēts, izvada kļūdu
    } else {
      console.log('currentCart is initialized:', currentCart); // Ja ir definēts, izvada informāciju
    }
  }, [wixClient]); // Atjauno, ja wixClient mainās

  // Funkcija, kas apstrādā preces pievienošanu grozam
  const handleAddToCart = async () => {
    // Pārbauda, vai ievadi ir derīgas
    if (!variantId || !productId || quantity <= 0) {
      console.error('Invalid input for adding item to cart');
      return; // Ja ne, iznāk no funkcijas
    }

    // Pārbauda, vai Wix klients ir gatavs
    if (!wixClient || !clientReady) {
      console.error('WixClient not ready');
      return; // Ja nē, iznāk no funkcijas
    }

    setLocalLoading(true); // Iestata ielādes stāvokli uz true
    try {
      await addItem(wixClient, productId, variantId, quantity); // Mēģina pievienot preci grozam
    } catch (error) {
      console.error('Failed to add item to cart:', error); // Ja neizdodas, izvada kļūdu
    } finally {
      setLocalLoading(false); // Neatkarīgi no rezultāta, iestata ielādes stāvokli uz false
    }
  };

  // Funkcija, kas apstrādā daudzuma palielināšanu vai samazināšanu
  const handleQuantity = (type: 'i' | 'd') => {
    if (type === 'd' && quantity > 1) {
      setQuantity((prev) => prev - 1); // Samazina daudzumu
    }
    if (type === 'i' && quantity < stockNumber) {
      setQuantity((prev) => prev + 1); // Palielina daudzumu
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-medium">Choose a Quantity</h4> {/* Virsraksts, lai izvēlētos daudzumu */}
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-32">
            {/* Poga daudzuma samazināšanai */}
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
              onClick={() => handleQuantity('d')}
              disabled={quantity === 1} // Aizliedz pogas nospiešanu, ja daudzums ir 1
            >
              -
            </button>
            {quantity} {/* Attēlo pašreizējo daudzumu */}
            {/* Poga daudzuma palielināšanai */}
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
              onClick={() => handleQuantity('i')}
              disabled={quantity === stockNumber} // Aizliedz pogas nospiešanu, ja daudzums ir vienāds ar pieejamo skaitu
            >
              +
            </button>
          </div>
          {/* Rāda informāciju par pieejamību */}
          {stockNumber < 1 ? (
            <div className="text-xs">Product is out of stock</div> // Ja prece nav pieejama
          ) : (
            <div className="text-xs">
              Only <span className="text-orange-500">{stockNumber} items</span> left!<br /> Don't miss it
            </div>
          )}
        </div>
        {/* Poga, lai pievienotu preci grozam */}
        <button
          onClick={handleAddToCart}
          disabled={localLoading || stockNumber < 1} // Aizliedz, ja ir ielāde vai prece nav pieejama
          className="w-36 text-sm rounded-3xl ring-1 ring-lama text-lama py-2 px-4 hover:bg-lama hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Add; // Eksportē komponenti
