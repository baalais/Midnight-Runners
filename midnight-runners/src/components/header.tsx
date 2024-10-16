"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import NavIcons from "./NavIcons"; // Import the NavIcons component
import mr from "../img/mrmr.png"; // Adjust the path as needed

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // State for the menu

  const toggleMenu = () => {
    setIsOpen(!isOpen); // Toggle the menu state
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-5 bg-gray-800 text-white">
      {/* Logo */}
      <div className="text-2xl font-bold">
        <Image src={mr} alt="Logo" priority/>
      </div>

      {/* Burger Menu Icon */}
      <div className="md:hidden" onClick={toggleMenu}>
        {isOpen ? <AiOutlineClose size={30} /> : <AiOutlineMenu size={30} />}
      </div>

      {/* Navigation Links */}
      <nav
        className={`${
          isOpen ? "flex" : "hidden"
        } md:flex flex-col md:flex-row absolute md:static top-16 left-0 right-0 w-full md:w-auto bg-gray-800 md:bg-transparent items-center md:items-start md:gap-4 gap-8 p-5 md:p-0`}
      >
        <Link href="/" passHref>
          <button className="bg-gray-700 hover:bg-teal-500 text-white py-2 px-4 rounded-md">
            Home
          </button>
        </Link>
        <Link href="/album" passHref>
          <button className="bg-gray-700 hover:bg-teal-500 text-white py-2 px-4 rounded-md">
            Album
          </button>
        </Link>
        <Link href="/shop" passHref>
          <button className="bg-gray-700 hover:bg-teal-500 text-white py-2 px-4 rounded-md">
            Shop
          </button>
        </Link>
        <Link href="/game" passHref>
          <button className="bg-gray-700 hover:bg-teal-500 text-white py-2 px-4 rounded-md">
            Game
          </button>
        </Link>
        {/* NavIcons for cart and profile */}
        <NavIcons />
      </nav>
    </header>
  );
};

export default Header;
