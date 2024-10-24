import { useCartStore } from '../hooks/useCartStore';
import { useWixClient } from '../hooks/useWixClient';
import { useEffect } from 'react';

const CartModal: React.FC = () => {
    const { cart, getCart, removeItem, isLoading } = useCartStore();
    const wixClient = useWixClient();

    useEffect(() => {
        if (wixClient) {
            getCart(wixClient);
        }
    }, [getCart, wixClient]);

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="modal">
            <h2>Your Cart</h2>
            {cart?.lineItems?.length ? (
                cart.lineItems.map((item) => (
                    <div key={item.catalogReference?.catalogItemId} className="cart-item">
                        <span>{item.name}</span>
                        <button onClick={() => removeItem(wixClient, item.catalogReference?.catalogItemId || '')}>
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
