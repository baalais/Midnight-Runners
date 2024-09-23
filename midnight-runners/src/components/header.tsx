/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Header.module.css'; // Adjust the path as needed
import mr from '../img/mrmr.png'; // Adjust the path as needed
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'; // Import burger and close icons

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle the menu state
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Image src={mr} alt="Logo" />
      </div>

      {/* Burger Menu Icon */}
      <div className={styles.burgerMenu} onClick={toggleMenu}>
        {isOpen ? <AiOutlineClose size={30} /> : <AiOutlineMenu size={30} />}
      </div>

      {/* Navigation Links */}
      <nav className={`${styles.nav} ${isOpen ? styles.showNav : ''}`}>
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
