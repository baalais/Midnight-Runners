import React from 'react';

const GamePage: React.FC = () => {
  return (
    <div className="game-container"> {/* Galvenais konteiners spēlei */}
      <iframe
        src="https://www.y8.com/games/extreme_car_driving_simulator" // URL uz spēli
        width="800" // Iframe platums
        height="600" // Iframe augstums
        frameBorder="0" // Bez rāmja
        title="Extreme Car Driving Simulator" // Iframe nosaukums
      ></iframe>
    </div>
  );
};

export default GamePage; // Eksportē GamePage komponentu
