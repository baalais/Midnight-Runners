import React from "react";

const Loading: React.FC = () => {
  return (
    // Galvenais konteiners, kas izkārto elementus centrā vertikāli un horizontāli
    <div className="flex items-center justify-center h-screen">
      {/* Ielādes animācija - rotējošs aplis */}
      <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      {/* Teksts "Loading..." blakus animācijai */}
      <span className="ml-4 text-xl text-gray-700">Loading...</span>
    </div>
  );
};

export default Loading;
