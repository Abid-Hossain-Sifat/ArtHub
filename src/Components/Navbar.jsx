"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  Palette,
  Home as HomeIcon,
} from "lucide-react";
import Logo from "../../public/Assets/Logo.png";
import { useSession, signOut } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [user?.id]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
    setIsOpen(false);
  }, [pathname]);

  const profileImg = user?.image?.trim() && !imageError ? user.image : null;
  const dashboardLink = user?.role ? `/dashboard/${user.role}` : "/dashboard";
  const profileLink = user?.role
    ? `/dashboard/${user.role}/profile`
    : "/dashboard";

  if (pathname && pathname.includes("dashboard")) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      setDropdownOpen(false);
      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const navLinks = [
    { label: "Home", href: "/", icon: HomeIcon },
    { label: "Browse Artworks", href: "/artworks", icon: Palette },
    { label: "Dashboard", href: dashboardLink, icon: LayoutDashboard },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#FAF8F5]/90 backdrop-blur-xl border-b border-stone-200/80 shadow-[0_4px_20px_rgba(28,25,23,0.03)]"
          : "bg-[#FAF8F5]/70 backdrop-blur-md border-b border-stone-200/40"
      }`}
    >
      <div className="w-full max-w-[90%] md:max-w-[85%] lg:max-w-[80%] mx-auto h-16 flex items-center justify-between">
          {/* Logo & Platform Tag */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center shrink-0 group">
              <Image
                src={Logo}
                alt="ArtHub Logo"
                width={105}
                height={32}
                className="object-contain h-7 sm:h-8 w-auto transition-transform duration-200 group-hover:scale-105"
                priority
              />
            </Link>
          </div>

          {/* Center Navigation Links with Smooth Sliding Pill */}
          <nav
            className="hidden md:flex items-center gap-1 relative"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {navLinks.map((link, idx) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    active
                      ? "text-stone-950 font-semibold"
                      : "text-stone-600 hover:text-stone-950"
                  }`}
                >
                  {/* Sliding Hover / Active Background Pill */}
                  {hoveredIndex === idx && (
                    <motion.div
                      layoutId="nav-hover-pill"
                      className="absolute inset-0 bg-stone-100/90 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}

                  <Icon
                    size={15}
                    className={`transition-colors ${
                      active ? "text-[#B4136D]" : "text-stone-400 group-hover:text-stone-600"
                    }`}
                  />
                  <span>{link.label}</span>

                  {/* Active Indicator dot */}
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B4136D] shrink-0" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action / Auth Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-stone-200 animate-pulse" />
            ) : user ? (
              <div className="relative shrink-0">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-label="User account menu"
                  aria-expanded={dropdownOpen}
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-stone-100/70 hover:bg-stone-100 transition border border-stone-200/80 cursor-pointer"
                >
                  {/* Avatar */}
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border border-stone-300 ring-2 ring-[#B4136D]/20 shrink-0 flex items-center justify-center">
                    {profileImg ? (
                      <Image
                        src={profileImg}
                        alt={user.name || "User Profile"}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                        unoptimized={profileImg.startsWith("http")}
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#7042F4] to-[#B4136D] text-white text-[11px] font-bold select-none">
                        {getInitials(user.name)}
                      </div>
                    )}
                  </div>

                  <span className="text-xs sm:text-sm font-semibold text-stone-800 truncate max-w-[100px] hidden sm:inline-block">
                    {user.name?.split(" ")[0]}
                  </span>

                  <ChevronDown
                    size={14}
                    className={`text-stone-500 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 mt-2.5 w-60 bg-white/95 backdrop-blur-2xl border border-stone-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-2 z-20 origin-top-right"
                      >
                        <div className="px-3 py-2 border-b border-stone-100 mb-1">
                          <p className="text-xs font-semibold text-stone-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-[11px] text-stone-500 truncate">
                            {user.email}
                          </p>
                          {user.role && (
                            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#B4136D]/10 text-[#B4136D]">
                              {user.role}
                            </span>
                          )}
                        </div>

                        <Link
                          href={profileLink}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm text-stone-700 hover:text-stone-950 hover:bg-stone-50 rounded-xl font-medium transition"
                        >
                          <UserIcon size={15} className="text-stone-400" />
                          Profile
                        </Link>

                        <Link
                          href={dashboardLink}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm text-stone-700 hover:text-stone-950 hover:bg-stone-50 rounded-xl font-medium transition"
                        >
                          <LayoutDashboard size={15} className="text-stone-400" />
                          Dashboard
                        </Link>

                        <div className="border-t border-stone-100 my-1" />

                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm text-rose-600 hover:bg-rose-50 rounded-xl font-medium transition text-left cursor-pointer"
                        >
                          <LogOut size={15} className="text-rose-500" />
                          Log Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  href="/sign-in"
                  className="text-xs sm:text-sm font-medium text-stone-700 hover:text-stone-950 px-3 py-1.5 rounded-full hover:bg-stone-100/70 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-1 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#B4136D] to-[#930E58] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-brand-glow hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Sparkles size={13} className="hidden sm:inline" />
                  <span>Join ArtHub</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              className="md:hidden p-1.5 text-stone-700 hover:bg-stone-100 rounded-full transition cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Animated Drawer Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="md:hidden border-t border-stone-200/80 bg-[#FAF8F5]/98 backdrop-blur-xl px-4 py-3 shadow-lg"
            >
              <div className="w-full max-w-[90%] md:max-w-[85%] lg:max-w-[80%] mx-auto flex flex-col gap-2">
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => {
                    const active = isActive(link.href);
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition ${
                          active
                            ? "bg-stone-100 text-[#B4136D] font-semibold"
                            : "text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        <Icon size={15} />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                {user ? (
                  <div className="border-t border-stone-200/70 pt-2 flex flex-col gap-1">
                    <div className="flex items-center gap-2 px-2 py-1 mb-1">
                      <span className="text-xs font-semibold text-stone-800">
                        {user.name}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        ({user.email})
                      </span>
                    </div>

                    <Link
                      href={profileLink}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 rounded-xl"
                    >
                      <UserIcon size={14} className="text-stone-400" />
                      Profile
                    </Link>

                    <Link
                      href={dashboardLink}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 rounded-xl"
                    >
                      <LayoutDashboard size={14} className="text-stone-400" />
                      Dashboard
                    </Link>

                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-medium text-left cursor-pointer"
                    >
                      <LogOut size={14} className="text-rose-500" />
                      Log Out
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-stone-200/70 pt-2 flex flex-col gap-2">
                    <Link
                      href="/sign-in"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 rounded-xl"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center py-2 rounded-full bg-gradient-to-r from-[#B4136D] to-[#930E58] text-white text-xs font-semibold shadow-sm"
                    >
                      Join ArtHub
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </header>
  );
};

export default Navbar;