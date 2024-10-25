import { useCartStore } from '../hooks/useCartStore';
import { useWixClient } from '../hooks/useWixClient';
import { useEffect } from 'react';

interface CartModalProps {
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ onClose }) => {
  const { cart, getCart, removeItem, isLoading } = useCartStore();
  const { wixClient, clientReady } = useWixClient();

  useEffect(() => {
    if (wixClient && clientReady) {
      getCart(wixClient);
    }
  }, [wixClient, clientReady, getCart]); // Ensure dependencies are correctly listed

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="modal">
      <button onClick={onClose} className="close-button">Close</button>
      <h2>Your Cart</h2>
      {cart?.lineItems?.length ? (
        cart.lineItems.map((item) => (
          <div key={item.catalogReference?.catalogItemId} className="cart-item">
            <span>{String(item.productName ?? 'Unnamed Product')}</span>
            <button onClick={() => wixClient && removeItem(wixClient, item.catalogReference?.catalogItemId || '')}>
              Remove
            </button>
          </div>
        ))
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartModal;
