import { currentCart } from '@wix/ecom';
import { useCartStore } from '../hooks/useCartStore';
import { useWixClient } from '../hooks/useWixClient';
import { useState, useEffect } from 'react';

interface AddProps {
  productId: string;
  variantId: string;
  stockNumber: number;
}

const Add: React.FC<AddProps> = ({ productId, variantId, stockNumber }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const { wixClient, clientReady } = useWixClient();
  const { addItem } = useCartStore();

  useEffect(() => {
    if (currentCart) {
      console.error('currentCart is not defined on wixClient');
    } else {
      console.log('currentCart is initialized:', currentCart);
    }
  }, [wixClient]);

  const handleAddToCart = async () => {
    if (!variantId || !productId || quantity <= 0) {
      console.error('Invalid input for adding item to cart');
      return;
    }

    if (!wixClient || !clientReady) {
      console.error('WixClient not ready');
      return;
    }

    setLocalLoading(true);
    try {
      await addItem(wixClient, productId, variantId, quantity);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleQuantity = (type: 'i' | 'd') => {
    if (type === 'd' && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
    if (type === 'i' && quantity < stockNumber) {
      setQuantity((prev) => prev + 1);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-medium">Choose a Quantity</h4>
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-32">
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
              onClick={() => handleQuantity('d')}
              disabled={quantity === 1}
            >
              -
            </button>
            {quantity}
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
              onClick={() => handleQuantity('i')}
              disabled={quantity === stockNumber}
            >
              +
            </button>
          </div>
          {stockNumber < 1 ? (
            <div className="text-xs">Product is out of stock</div>
          ) : (
            <div className="text-xs">
              Only <span className="text-orange-500">{stockNumber} items</span> left!<br /> Don't miss it
            </div>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={localLoading || stockNumber < 1}
          className="w-36 text-sm rounded-3xl ring-1 ring-lama text-lama py-2 px-4 hover:bg-lama hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Add;
