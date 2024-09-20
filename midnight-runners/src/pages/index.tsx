import Head from 'next/head';
import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import styles from '../styles/MainPage.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Midnight Runners</title>
        <meta name="description" content="Generated by Baalais" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className={styles.container}>
        <main className={styles.main}>
          <link className={styles.mainPhoto} href="https://via.placeholder.com/600x400"/>
          <p className={styles.description}>
            Midnight Runners is a car club based in Latvia. We host monthly meetings and events, open to all car enthusiasts. Everyone is welcome! To join, simply send us a DM on our social media platforms.
          </p>
        </main>
      </div>
      <Footer />
    </>
  );
}
