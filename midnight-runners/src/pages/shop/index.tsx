import Head from 'next/head';
//import React, { useEffect, useState } from 'react';
import Header from '../../components/header'; // Ensure the correct casing
import Footer from '../../components/footer'; // Ensure the correct casing
import styles from '../../styles/ShopPage.module.css'; // Adjust the path as needed

export default function Shop() {
  return (
    <>
      <Head>
        <title>Shop</title>
        <meta name="description" content="Shop page with Printful products" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className={styles.container}>
        <div className={styles.main}>
          <h1>Shop Page</h1>
        </div>
      </div>
      <Footer />
    </>
  );
};