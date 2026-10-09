"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

// Bespoke Fine Art Assets
import Hero1 from "../../public/Assets/Hero1.jpg";
import Hero2 from "../../public/Assets/Hero2.jpg";

const Banner = () => {

  return (
    <section className="relative w-full overflow-hidden min-h-[90vh] lg:min-h-[calc(100vh-68px)] bg-[#FAF8F5] flex items-center py-12 lg:py-16">
      {/* Soft Gallery Ambient Lighting (Ivory / Berry / Amber) */}
      <div className="absolute top-1/4 -left-20 w-[480px] h-[480px] rounded-full bg-[#B4136D]/6 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] rounded-full bg-amber-500/6 blur-[140px] pointer-events-none" />

      {/* Main Standard Width Container */}
      <div className="relative z-20 w-full max-w-[90%] md:max-w-[85%] lg:max-w-[80%] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Authoritative Editorial Typography & Metrics (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left items-center lg:items-start"
          >
            {/* Curated Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100/90 border border-stone-200/90 text-[11px] sm:text-xs uppercase tracking-[0.2em] text-stone-700 mb-6 font-semibold shadow-xs">
              <Sparkles size={13} className="text-[#B4136D]" />
              <span>Curated Fine Art Marketplace</span>
            </div>

            {/* Monumental Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[54px] xl:text-[62px] font-bold text-stone-950 leading-[1.12] tracking-tight">
              Where Visionary Art <br />
              Meets <span className="font-serif italic font-medium text-[#B4136D]">Curated Collectors</span>
            </h1>

            {/* Clear, Grounded Platform Description */}
            <p className="mt-6 max-w-xl text-base sm:text-lg text-stone-600 leading-relaxed font-normal">
              Discover, collect, and sell authentic original masterpieces directly from independent creators worldwide. Verified provenance, direct artist royalties, and certified acquisitions.
            </p>

            {/* High-Converting Action CTAs */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link href="/artworks">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2.5 rounded-full px-8 py-4 bg-[#B4136D] hover:bg-[#930E58] text-white text-xs sm:text-sm font-semibold shadow-[0_12px_32px_rgba(180,19,109,0.28)] transition-all cursor-pointer"
                >
                  <span>Explore Gallery</span>
                  <ArrowRight size={16} />
                </motion.button>
              </Link>

              <Link href="/artworks">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-full px-7 py-4 text-xs sm:text-sm font-medium text-stone-800 hover:text-stone-950 bg-white hover:bg-stone-50 border border-stone-200/90 shadow-xs transition-all cursor-pointer"
                >
                  <span>Featured Collections</span>
                </motion.button>
              </Link>
            </div>

            {/* Live Platform Proof & Metrics */}
            <div className="grid grid-cols-3 gap-6 sm:gap-10 mt-12 pt-8 border-t border-stone-200/80 w-full max-w-lg">
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-stone-950">2.4k+</p>
                <p className="text-xs text-stone-500 font-medium mt-0.5">Original Works</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-stone-950">500+</p>
                <p className="text-xs text-stone-500 font-medium mt-0.5">Verified Artists</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#B4136D]">100%</p>
                <p className="text-xs text-stone-500 font-medium mt-0.5">Direct Patronage</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Authentic Layered Gallery Art Showcase (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center lg:justify-end items-center"
          >
            {/* Gallery Composition Wrapper */}
            <div className="relative w-full max-w-[420px] sm:max-w-[440px] pt-4 pb-8 px-2 sm:px-4">
              
              {/* Ambient Glow behind composition */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-tr from-[#B4136D]/15 to-amber-400/15 blur-[80px] pointer-events-none" />

              {/* Floating Top Badge: Curated Exhibition */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute top-0 right-2 sm:right-0 z-30 bg-white/90 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-stone-200/90 shadow-[0_12px_30px_rgba(28,25,23,0.08)] flex items-center gap-2.5"
              >
                <div className="w-2 h-2 rounded-full bg-[#B4136D] animate-pulse" />
                <div className="text-left">
                  <p className="text-[11px] font-bold text-stone-900 tracking-wide uppercase">
                    Curated Exhibition
                  </p>
                  <p className="text-[10px] text-stone-500 font-medium">
                    Originals & Limited Editions
                  </p>
                </div>
              </motion.div>

              {/* Primary Masterpiece Frame (Museum Matting & Elevation) */}
              <motion.div
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="relative z-10 w-full aspect-[4/5] rounded-[2.2rem] bg-white p-3 sm:p-3.5 border border-stone-200/90 shadow-[0_25px_60px_-12px_rgba(28,25,23,0.15)] group transition-shadow duration-300 hover:shadow-[0_32px_75px_-12px_rgba(28,25,23,0.22)]"
              >
                <div className="relative w-full h-full rounded-[1.6rem] overflow-hidden bg-stone-100 shadow-inner">
                  <Image
                    src={Hero1}
                    alt="Fine Art Masterpiece - Celestial Architecture"
                    fill
                    sizes="(max-width: 640px) 100vw, 440px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    priority
                  />
                  {/* Subtle Museum Glass Reflection Sheen */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/10 opacity-70 pointer-events-none" />
                </div>
              </motion.div>

              {/* Secondary Overlapping Companion Art Frame (Depth & Layering) */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.05, y: -8, transition: { duration: 0.25 } }}
                className="absolute -bottom-4 -left-3 sm:-bottom-6 sm:-left-6 z-20 w-[175px] sm:w-[210px] aspect-[4/5] rounded-[1.6rem] bg-white p-2.5 border border-stone-200/90 shadow-[0_20px_45px_-8px_rgba(28,25,23,0.2)] cursor-pointer group"
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-stone-100 shadow-inner">
                  <Image
                    src={Hero2}
                    alt="Contemporary Abstract Expressionism"
                    fill
                    sizes="210px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Subtle Artwork Type Tag */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left">
                    <p className="text-[10px] uppercase font-bold text-white/90 tracking-wider">
                      Contemporary Art
                    </p>
                    <p className="text-[11px] font-semibold text-white truncate drop-shadow-sm">
                      Abstract Series
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Bottom Trust Pill: Verified Authenticity */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="absolute -bottom-2 right-1 sm:-bottom-3 sm:right-2 z-30 bg-white/95 backdrop-blur-xl px-3.5 py-2 rounded-full border border-stone-200/90 shadow-[0_10px_25px_rgba(28,25,23,0.08)] flex items-center gap-2"
              >
                <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                <span className="text-[11px] font-semibold text-stone-800">
                  Verified Provenance
                </span>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Banner;