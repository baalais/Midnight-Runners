import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Header.module.css'; // Adjust the path as needed
import mr from '../img/mrmr.png'; // Adjust the path as needed

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Image src={mr} alt="Logo" />
      </div>
      <nav className={styles.nav}>
        <Link href="/" passHref>
          <button className={styles.navButton}>Home</button>
        </Link>
        <Link href="/album" passHref>
          <button className={styles.navButton}>Album</button>
        </Link>
        <Link href="/shop" passHref>
          <button className={styles.navButton}>Shop</button>
        </Link>
        <Link href="/game" passHref>
          <button className={styles.navButton}>Game</button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
