"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation"; // 👈 ১. usePathname ইমপোর্ট করা হয়েছে
import { Menu, Search, X } from "lucide-react"; 
import Logo from "../../public/Assets/Logo.png";

const Navbar = () => {
  // Hamburger menu open close state
  const [isOpen, setIsOpen] = useState(false);
  
  // Search Input Value track
  const [searchQuery, setSearchQuery] = useState("");

  const pathname = usePathname();
  const getLinkClass = (path, isMobile = false) => {
    const isActive = pathname === path;
    
    if (isMobile) {
      return isActive 
        ? "text-violet-600 font-semibold" 
        : "text-gray-600 hover:text-black transition";
    }
    
    return isActive
      ? "text-violet-600 border-b-2 border-violet-600 pb-1"
      : "text-gray-600 hover:text-black transition pb-1";
  };

  return (
    <div className="border-b bg-white w-full relative">
      <div className="w-full max-w-[90%] md:max-w-[85%] lg:max-w-[80%] mx-auto h-[72px] flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-14">
          <Link href='/'>
            <div className="flex items-center shrink-0">
              <Image
                src={Logo}
                alt="ArtHub Logo"
                width={120}
                height={120}
                className="object-contain w-auto h-auto"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <nav>
              <ul className="flex items-center gap-10 text-[17px] font-medium">
                <Link href="/" className={getLinkClass("/")}>
                  Home
                </Link>

                <Link href="/artworks" className={getLinkClass("/artworks")}>
                  Browse Artworks
                </Link>

                <Link href="/dashboard" className={getLinkClass("/dashboard")}>
                  Dashboard
                </Link>
              </ul>
            </nav>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">
          {/* Search input */}
          <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-3 w-[300px]">
            <Search size={18} className="text-gray-500 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Gallery"
              className="bg-transparent outline-none w-full text-sm text-black"
            />
          </div>

          {/* Sign In */}
          <div className="hidden lg:block">
            <button className="px-6 py-2 rounded-full bg-violet-600 text-white font-medium hover:bg-violet-700 transition">
              Sign In
            </button>
          </div>

          {/* Hamburger Button */}
          <div 
            className="lg:hidden block cursor-pointer text-black hover:opacity-80 transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-[73px] left-0 w-full bg-white border-b shadow-lg lg:hidden z-50 transition-all duration-300">
          <div className="max-w-[90%] md:max-w-[85%] mx-auto py-6 flex flex-col gap-6">
            
            {/* Mobile Navigation Links */}
            <nav>
              <ul className="flex flex-col gap-4 text-[17px] font-medium">
                {/* 👈 ৫. মোবাইল মেনুর জন্যও ডাইনামিক ক্লাস অ্যাপ্লাই করা হয়েছে */}
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)} 
                  className={getLinkClass("/", true)}
                >
                  Home
                </Link>

                <Link
                  href="/artworks"
                  onClick={() => setIsOpen(false)}
                  className={getLinkClass("/artworks", true)}
                >
                  Browse Artworks
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={getLinkClass("/dashboard", true)}
                >
                  Dashboard
                </Link>
              </ul>
            </nav>

            <hr className="border-gray-100" />

            {/* Mobile Search & Sign In */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-3 w-full">
                <Search size={18} className="text-gray-500 mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Gallery"
                  className="bg-transparent outline-none w-full text-sm text-black"
                />
              </div>

              <button className="w-full px-6 py-3 rounded-full bg-violet-600 text-white font-medium hover:bg-violet-700 transition text-center">
                Sign In
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;