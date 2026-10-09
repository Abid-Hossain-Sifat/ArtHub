"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../../../public/Assets/Logo.png";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "react-hot-toast";

// Lucide Icons Import
import {
  LayoutDashboard,
  Palette,
  PlusCircle,
  History,
  UserCircle,
  Home,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

const ArtistDashboardLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.replace("/sign-in");
      } else if (session.user?.role !== "artist") {
        router.replace("/unauthorized");
      }
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Successfully logged out!");
      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const navLinks = [
    {
      name: "Studio Overview",
      href: "/dashboard/artist",
      icon: <LayoutDashboard className="w-4.5 h-4.5" />,
    },
    {
      name: "Manage Artworks",
      href: "/dashboard/artist/manage-artwork",
      icon: <Palette className="w-4.5 h-4.5" />,
    },
    {
      name: "Add New Artwork",
      href: "/dashboard/artist/add-artwork",
      icon: <PlusCircle className="w-4.5 h-4.5" />,
    },
    {
      name: "Sales History",
      href: "/dashboard/artist/sales-history",
      icon: <History className="w-4.5 h-4.5" />,
    },
    {
      name: "Artist Profile",
      href: "/dashboard/artist/profile",
      icon: <UserCircle className="w-4.5 h-4.5" />,
    },
  ];

  // Sidebar Content
  const SidebarContent = () => (
    <div className="flex flex-col justify-between h-full p-6 bg-white select-none">
      {/* LOGO & LINKS */}
      <div className="space-y-7">
        {/* Logo */}
        <div className="flex items-center justify-between px-2 py-2">
          <Link href="/">
            <Image
              src={Logo}
              alt="ArtHub Logo"
              width={124}
              height={38}
              priority
              className="object-contain"
            />
          </Link>
          {/* Close button for mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1 text-stone-500 hover:text-stone-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Role Badge */}
        <div className="px-3 py-2 rounded-xl bg-[#B4136D]/10 border border-[#B4136D]/20 flex items-center gap-2">
          <Sparkles size={14} className="text-[#B4136D] shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#B4136D]">
            Verified Art Creator
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 relative">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold transition-colors duration-150 relative z-10 text-xs sm:text-[13px] ${
                  isActive
                    ? "text-white"
                    : "text-stone-600 hover:bg-[#B4136D]/5 hover:text-[#B4136D]"
                }`}
              >
                {/* Active Tab Slide Animation */}
                {isActive && (
                  <motion.div
                    layoutId="activeArtistIndicator"
                    className="absolute inset-0 bg-[#B4136D] rounded-xl shadow-md shadow-[#B4136D]/20 -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM SECTION */}
      <div className="border-t border-stone-100 pt-4 space-y-1">
        {/* Home Button */}
        <button
          onClick={() => {
            setIsMobileOpen(false);
            router.push("/");
          }}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-all text-xs cursor-pointer"
        >
          <Home className="w-4.5 h-4.5 text-stone-400" />
          <span>Gallery Home</span>
        </button>

        {/* Logout Button */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-medium text-stone-600 hover:bg-rose-50 hover:text-rose-700 transition-all text-xs cursor-pointer"
        >
          <LogOut className="w-4.5 h-4.5 text-stone-400 hover:text-rose-600" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  if (isPending || !session || session.user?.role !== "artist") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] w-full">
        <div className="flex flex-col items-center gap-3.5 text-center">
          <div className="w-10 h-10 border-3 border-[#B4136D] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest">
            Opening Artist Studio...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FAF8F5] relative overflow-x-hidden selection:bg-[#B4136D]/15 selection:text-[#B4136D]">
      {/* DESKTOP VIEWPORT */}
      <aside className="hidden lg:block w-64 border-r border-stone-200/80 bg-white sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* MOBILE & TABLET VIEWPORT */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Dark Overlay Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            {/* Sliding Sidebar Body */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.25 }}
              className="fixed inset-y-0 left-0 w-64 bg-white z-50 shadow-2xl lg:hidden h-screen"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN APP AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Header */}
        <header className="lg:hidden w-full bg-white border-b border-stone-200/80 p-4 flex items-center justify-between sticky top-0 z-30">
          <Image
            src={Logo}
            alt="ArtHub Logo"
            width={100}
            height={32}
            className="object-contain"
          />
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-xl bg-stone-50 text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Dynamic Inner Pages Render Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 bg-[#FAF8F5] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ArtistDashboardLayout;