"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import Logo from "../../public/Assets/Logo.png";

const Footer = () => {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <footer className="border-t border-stone-200/80 pt-12 pb-8 mt-auto bg-stone-100/40">
      <div className="w-full max-w-[90%] md:max-w-[85%] lg:max-w-[80%] mx-auto flex flex-col gap-10">
        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-3.5 max-w-sm">
            <Link href="/" className="inline-block">
              <Image
                src={Logo}
                alt="ArtHub Logo"
                width={115}
                height={36}
                className="object-contain h-8 w-auto"
              />
            </Link>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Empowering artists and collectors through a premium, curated digital gallery experience. Bridging the gap between creativity and ownership.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-1">
              <a
                href="https://github.com/Abid-Hossain-Sifat"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Profile"
                className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:text-stone-950 hover:border-stone-400 shadow-xs transition"
              >
                <FaGithub className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/abid-hossain-sifat"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Profile"
                className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:text-white hover:bg-[#0077b5] hover:border-transparent shadow-xs transition"
              >
                <FaLinkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/share/18ep55nz64/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook Profile"
                className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:text-white hover:bg-[#1877f2] hover:border-transparent shadow-xs transition"
              >
                <FaFacebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Marketplace */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-widest">
              Marketplace
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-stone-600">
              <li>
                <Link href="/artworks" className="hover:text-[#B4136D] transition">
                  Browse Artworks
                </Link>
              </li>
              <li>
                <Link href="/artworks" className="hover:text-[#B4136D] transition">
                  Featured Masterpieces
                </Link>
              </li>
              <li>
                <Link href="/artworks" className="hover:text-[#B4136D] transition">
                  Top Curated Artists
                </Link>
              </li>
              <li>
                <Link href="/artworks" className="hover:text-[#B4136D] transition">
                  Digital Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Platform */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-widest">
              Platform
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-stone-600">
              <li>
                <Link href="/dashboard" className="hover:text-[#B4136D] transition">
                  Creator Dashboard
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-[#B4136D] transition">
                  Join as an Artist
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="hover:text-[#B4136D] transition">
                  Collector Sign In
                </Link>
              </li>
              <li>
                <Link href="/artworks" className="hover:text-[#B4136D] transition">
                  Live Showcase
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Support */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-widest">
              Trust & Support
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-stone-600">
              <li>Verified Creators</li>
              <li>Stripe Secure Checkout</li>
              <li>Authenticity Guarantee</li>
              <li>24/7 Collector Support</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 ArtHub. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-stone-700 font-medium shadow-xs">
              <span>Crafted with</span>
              <Heart size={12} className="text-rose-500 fill-rose-500" />
              <span>by Abid Hossain Sifat</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;