"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Search, X, LogOut, LayoutDashboard, User as UserIcon, ChevronDown } from "lucide-react";
import Logo from "../../public/Assets/Logo.png";
import { useSession, authClient } from "@/lib/auth-client";

const Navbar = () => {
  const pathname = usePathname(); // 1. Proper validation hook call ekhane niye asha hoyeche
  const router = useRouter();

  // 2. Correct logic & spelling check ('dashboard')
  if (pathname.includes('dashboard')) {
    return null;
  }

  // Hamburger menu open close state
  const [isOpen, setIsOpen] = useState(false);

  // Search Input Value track
  const [searchQuery, setSearchQuery] = useState("");

  // Better Auth session state
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setDropdownOpen(false);
            router.push('/');
            router.refresh();
          }
        }
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
          <Link href="/">
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

          {/* Desktop Auth Section */}
          <div className="hidden lg:block">
            {user ? (
              <div className="relative shrink-0">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:opacity-90 transition focus:outline-none cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-purple-500 shadow-sm shrink-0">
                    <img
                      src={user.image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                      alt={user.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-800 truncate max-w-[120px]">
                    {user.name}
                  </span>
                  <ChevronDown size={16} className={`text-slate-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-2.5 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-20 transition-all transform origin-top-right">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium transition first:rounded-t-2xl"
                      >
                        <UserIcon size={16} className="text-slate-400" />
                        Profile
                      </Link>

                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium transition"
                      >
                        <LayoutDashboard size={16} className="text-slate-400" />
                        Dashboard
                      </Link>

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold transition text-left cursor-pointer last:rounded-b-2xl"
                      >
                        <LogOut size={16} className="text-red-500" />
                        Log Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/sign-in">
                <button className="px-6 py-2 rounded-full bg-gradient-to-r from-[#7042F4] to-[#FF47A6] text-white font-medium hover:opacity-95 transition-all active:scale-95 shadow-md shadow-purple-500/10 cursor-pointer">
                  Sign In
                </button>
              </Link>
            )}
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

            {/* Mobile Search & Auth */}
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

              {/* Mobile Auth */}
              {user ? (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl font-medium transition"
                  >
                    <UserIcon size={16} className="text-slate-400" />
                    Profile
                  </Link>

                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl font-medium transition"
                  >
                    <LayoutDashboard size={16} className="text-slate-400" />
                    Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl font-semibold transition text-left cursor-pointer"
                  >
                    <LogOut size={16} className="text-red-500" />
                    Log Out
                  </button>
                </div>
              ) : (
                <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                  <button className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-[#7042F4] to-[#FF47A6] text-white font-medium transition-all text-center active:scale-95 hover:opacity-95 shadow-md shadow-purple-500/10">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;