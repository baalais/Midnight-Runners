import React from 'react';

// Footer komponente
const Footer: React.FC = () => {
  return (
    // Footer sadaļa ar stilu un satura centru
    <footer className="py-4 bg-gray-100 text-center border-t border-gray-200">
      {/* Saites uz Facebook un Instagram */}
      <div className="mb-4">
        <a
          href="https://www.facebook.com/midnightrunnerslatvija" // Facebook saite
          target="_blank" // Atver jaunu logu
          rel="noopener noreferrer" // Drošības iestatījumi
          className="mx-2 text-gray-700 hover:underline" // Stili saitei
        >
          Facebook
        </a>
        <a
          href="https://instagram.com/midnightrunnerslatvija" // Instagram saite
          target="_blank" // Atver jaunu logu
          rel="noopener noreferrer" // Drošības iestatījumi
          className="mx-2 text-gray-700 hover:underline" // Stili saitei
        >
          Instagram
        </a>
      </div>
      {/* Papildu informācija */}
      <div className="text-sm text-gray-600">
        <p>Developer: Baalais</p> {/* Izstrādātāja informācija */}
      </div>
    </footer>
  );
};

export default Footer; // Eksportē Footer komponenti
