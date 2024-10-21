import React from 'react';

const Footer: React.FC = () => {
  return (
    // Footer sadaļa ar stilu un satura centru
    <footer className="py-4 bg-gray-100 text-center border-t border-gray-200">
      {/* Saites uz Facebook un Instagram */}
      <div className="mb-4">
        <a
          href="https://www.facebook.com/midnightrunnerslatvija"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-2 text-gray-700 hover:underline"
        >
          Facebook
        </a>
        <a
          href="https://instagram.com/midnightrunnerslatvija"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-2 text-gray-700 hover:underline"
        >
          Instagram
        </a>
      </div>
      {/* Papildu informācija */}
      <div className="text-sm text-gray-600">
        <p>Developer: Baalais</p>
      </div>
    </footer>
  );
};

export default Footer;
