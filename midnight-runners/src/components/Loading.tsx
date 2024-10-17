import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      <span className="ml-4 text-xl text-gray-700">Loading...</span>
    </div>
  );
};

export default Loading;
