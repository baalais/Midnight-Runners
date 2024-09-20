import React from 'react';
//import Link from 'next/link';
import styles from '../styles/Footer.module.css'; // Adjust the path as needed

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.socialMedia}>
        <a href="https://www.facebook.com/midnightrunnerslatvija" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://instagram.com/midnightrunnerslatvija" target="_blank" rel="noopener noreferrer">Instagram</a>
        {/* Add more social media links as needed */}
      </div>
      <div className={styles.developer}>
        <p>Developer: Baalais</p>
      </div>
    </footer>
  );
};

export default Footer;
