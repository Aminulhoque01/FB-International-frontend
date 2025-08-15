"use client";
import Link from "next/link";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

interface NavbarProps {
  setIsMobileMenuOpen?: (open: boolean) => void;
}

const Navbar = ({ setIsMobileMenuOpen }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpenLocal] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpenLocal((prev) => {
      const newState = !prev;
      if (setIsMobileMenuOpen) {
        setIsMobileMenuOpen(newState);
      }
      return newState;
    });
  };

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Projects", href: "/project" },
    { name: "News", href: "/news" },
    { name: "Contact", href: "/contact" },
   
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="bg-[#F8EDE3] fixed top-5 z-50 rounded-xl left-0 right-0 max-w-3xl mx-auto text-[#5C4033]"
    >
      <div className="navbar p-2 shadow-sm flex justify-between items-center">
        {/* Left Side - Title */}
        <div className="text-xl font-bold text-[#B85842] bg-opacity-80 px-4 py-2 rounded-md">
          <Link href="/">Troscán</Link>
        </div>

        {/* Desktop Menu - Centered Links */}
        <div className="hidden md:flex flex-1 justify-center items-center space-x-4">
          {navLinks.slice(0, -1).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[#B85842] hover:text-[#4A3528] px-4 py-2 rounded-md font-bold text-[16px]"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Contact Us Button - Right Side */}
        <div className="hidden md:flex items-center">
          <Link
            href={navLinks[3].href}
            className="bg-[#B85842] text-white px-4 py-2 rounded-md hover:bg-[#D85842] font-bold text-[16px] border border-dashed border-red-400"  
          >
            {navLinks[3].name}
          </Link>
        </div>

        {/* Mobile Menu Button - Visible on Mobile */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-2xl text-[#5C4033] p-2 rounded-md hover:bg-white hover:bg-opacity-80"
          >
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-[#F8EDE3] shadow-lg fixed top-[70px] left-0 w-full z-40 p-4"
        >
          <ul className="flex flex-col items-center gap-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={() => {
                    setIsMobileMenuOpenLocal(false);
                    if (setIsMobileMenuOpen) {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className="text-[#5C4033] font-bold text-[16px] hover:text-[#4A3528]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;