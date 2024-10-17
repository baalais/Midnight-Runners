import Head from 'next/head';
import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import styles from '../styles/MainPage.module.css';
import { FaShoppingCart, FaCamera, FaGamepad } from 'react-icons/fa';

export default function Home() {
  return (
    <>
      <Head>
        <title>Midnight Runners</title>
        <meta name="description" content="The ultimate car club experience in Latvia." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className={styles.hero}>
        <img className={styles.heroImage} src="/landing2.jpg" alt="Landing Image" />
        <div className={styles.heroText}>
          <h1>Welcome to Midnight Runners</h1>
          <p>Your ultimate car club experience starts here!</p>
        </div>
      </div>
      <div className={styles.container}>
        <main className={styles.main}>
          {/* Shop Section */}
          <section className={styles.section}>
            <img className={styles.sectionImage} src="/shop.jpg" alt="Shop" />
            <div className={styles.sectionContent}>
              <h2>Shop</h2>
              <p>Get the latest Midnight Runners merchandise and show your support!</p>
              <a href="/shop" className={styles.button}><FaShoppingCart /> Shop Now</a>
            </div>
          </section>
          {/* Album Section */}
          <section className={styles.section}>
            <img className={styles.sectionImage} src="/album.jpg" alt="Album" />
            <div className={styles.sectionContent}>
              <h2>Album</h2>
              <p>Check out photos from our latest events and meets.</p>
              <a href="/album" className={styles.button}><FaCamera /> View Album</a>
            </div>
          </section>
          {/* Games Section */}
          <section className={styles.section}>
            <img className={styles.sectionImage} src="/coming.jpg" alt="Games" />
            <div className={styles.sectionContent}>
              <h2>Games</h2>
              <p>Play the latest car-themed games and compete with others!</p>
              <a href="/games" className={styles.button}><FaGamepad /> Play Now</a>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
