/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { useCartStore } from '../hooks/useCartStore';
import { useWixClient } from '../hooks/useWixClient';
import { useEffect } from 'react';

// Definē komponentes props
interface CartModalProps {
  onClose: () => void; // Funkcija, lai aizvērtu modāli
}

// Komponente, kas parāda iepirkumu grozu
const CartModal: React.FC<CartModalProps> = ({ onClose }) => {
  const { cart, getCart, removeItem, isLoading } = useCartStore(); // Iegūst groza datus un funkcijas no stāvokļa hook
  const { wixClient, clientReady } = useWixClient(); // Iegūst Wix klientu un tā gatavību

  // Efekts, kas iegūst iepirkumu grozu, kad Wix klients ir gatavs
  useEffect(() => {
    if (wixClient && clientReady) {
      getCart(wixClient); // Iegūst iepirkumu grozu
    }
  }, [wixClient, clientReady, getCart]); // Pārliecinās, ka atkarības ir pareizi norādītas

  // Ja dati tiek ielādēti, rādām ielādes ziņu
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="modal"> {/* Modālais logs */}
      <button onClick={onClose} className="close-button">Close</button> {/* Poga modāla aizvēršanai */}
      <h2>Your Cart</h2> {/* Virsraksts */}
      {cart?.lineItems?.length ? ( // Pārbauda, vai ir iepirkumu groza vienumi
        cart.lineItems.map((item) => ( // Ja ir, mapo cauri katram vienumam
          <div key={item.catalogReference?.catalogItemId} className="cart-item"> {/* Katram vienumam piešķir unikālu atslēgu */}
            <span>{String(item.productName ?? 'Unnamed Product')}</span> {/* Attēlo produkta nosaukumu */}
            <button onClick={() => wixClient && removeItem(wixClient, item.catalogReference?.catalogItemId || '')}>
              Remove {/* Poga, lai noņemtu preci no groza */}
            </button>
          </div>
        ))
      ) : (
        <p>Your cart is empty.</p> // Ja grozs ir tukšs, rādām ziņu
      )}
    </div>
  );
};

export default CartModal; // Eksportē komponenti
