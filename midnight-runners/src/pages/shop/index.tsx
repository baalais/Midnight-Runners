import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import Header from '../../components/header'; // Ensure the correct casing
import Footer from '../../components/footer'; // Ensure the correct casing
import styles from '../../styles/ShopPage.module.css'; // Adjust the path as needed
import { fetchPrintfulData, PrintfulProduct } from '../../utils/printfulApi'; // Adjust the path as needed

export default function Shop() {
  const [products, setProducts] = useState<PrintfulProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await fetchPrintfulData('/store/products'); // Use the correct endpoint
        setProducts(result.result || []);
      } catch (error) {
        setError('Error fetching products');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Head>
        <title>Shop</title>
        <meta name="description" content="Shop page with Printful products" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className={styles.container}>
        <main className={styles.main}>
          <h1>Shop Page</h1>
          {loading && <p>Loading products...</p>}
          {error && <p>{error}</p>}
          <div className={styles.products}>
            {products.map((product) => (
              <div key={product.id} className={styles.product}>
                <h2>{product.name}</h2>
                {/* Add more product details and styling as needed */}
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
