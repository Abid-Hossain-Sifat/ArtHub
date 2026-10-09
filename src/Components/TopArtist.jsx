"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { topArtists } from "@/lib/data";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Users } from "lucide-react";
import { TopArtistSkeleton } from "./Skeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: (direction) => {
    if (direction === "left") return { opacity: 0, x: -30 };
    if (direction === "right") return { opacity: 0, x: 30 };
    return { opacity: 0, y: 24, scale: 0.97 };
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const getInitials = (name) => {
  if (!name) return "A";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const ArtistAvatar = ({ image, name }) => {
  const [error, setError] = useState(false);

  return (
    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-white border-2 border-stone-200/90 shadow-sm transition-transform duration-500 group-hover:scale-105 shrink-0">
      <div className="w-full h-full rounded-full overflow-hidden bg-stone-100 relative">
        {!error && image ? (
          <Image
            src={image}
            alt={name || "Featured Artist"}
            fill
            sizes="112px"
            className="object-cover"
            priority
            onError={() => setError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#7042F4] to-[#B4136D] text-white text-lg font-serif font-bold select-none">
            {getInitials(name)}
          </div>
        )}
      </div>

      {/* Verified Creator Badge */}
      <div
        className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-xs"
        title="Verified Master Artist"
      >
        <ShieldCheck size={13} />
      </div>
    </div>
  );
};

const TopArtist = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const topArtistsData = await topArtists();
        setArtists(Array.isArray(topArtistsData) ? topArtistsData : []);
      } catch (err) {
        console.error("Error fetching artists:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  if (loading) {
    return <TopArtistSkeleton />;
  }

  return (
    <section className="w-full bg-[#FAF8F5] py-16 sm:py-24 border-t border-stone-200/60 overflow-hidden">
      {/* Unified Standard Responsive Width */}
      <div className="w-full max-w-[90%] md:max-w-[85%] lg:max-w-[80%] mx-auto">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 sm:mb-12 gap-5"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100/90 border border-stone-200/90 text-[11px] font-semibold text-stone-700 uppercase tracking-[0.2em] mb-3 shadow-2xs">
              <Sparkles size={12} className="text-[#B4136D]" />
              <span>Visionary Creators</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-stone-950 tracking-tight leading-tight">
              Top Artists
            </h2>
            <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
              Meet the celebrated creators shaping the contemporary fine art scene worldwide.
            </p>
          </div>

          <Link
            href="/artworks"
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white hover:bg-stone-50 border border-stone-200/90 text-stone-800 hover:text-stone-950 text-xs sm:text-sm font-semibold shadow-2xs hover:border-[#B4136D]/40 transition-all duration-200 group shrink-0"
          >
            <span>Explore All Creators</span>
            <ArrowRight
              size={15}
              className="transform group-hover:translate-x-1 transition-transform text-[#B4136D]"
            />
          </Link>
        </motion.div>

        {artists.length > 0 ? (
          /* Artist Grid */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8"
          >
            {artists.map((artist, index) => {
              const direction = index === 0 ? "left" : index === 2 ? "right" : "center";
              return (
                <motion.div
                  key={artist.id || index}
                  custom={direction}
                  variants={cardVariants}
                  className="relative bg-white rounded-[2rem] p-6 sm:p-7 border border-stone-200/90 shadow-[0_4px_20px_rgba(28,25,23,0.04)] hover:shadow-[0_20px_50px_rgba(28,25,23,0.1)] hover:border-stone-300 transition-shadow duration-300 flex flex-col items-center text-center group overflow-hidden"
                >
                  {/* Subtle Atmospheric Studio Backdrop Accent */}
                  <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#B4136D]/8 to-transparent pointer-events-none" />

                  {/* Avatar with Instant Loading & Fallback */}
                  <ArtistAvatar image={artist.image} name={artist.name} />

                  {/* Artist Name & Studio Tag */}
                  <div className="mt-4 w-full">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-950 group-hover:text-[#B4136D] transition-colors truncate">
                      {artist.name}
                    </h3>
                    <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mt-1">
                      Verified Resident Artist
                    </p>
                  </div>

                  {/* Metrics Pills */}
                  <div className="grid grid-cols-2 gap-2 w-full mt-5 pt-4 border-t border-stone-100">
                    <div className="bg-stone-50/80 rounded-xl py-2 px-3 border border-stone-200/60">
                      <p className="font-serif text-base sm:text-lg font-bold text-stone-900">
                        {artist.artworks}
                      </p>
                      <p className="text-[10px] uppercase font-semibold text-stone-500 mt-0.5">
                        Artworks
                      </p>
                    </div>
                    <div className="bg-stone-50/80 rounded-xl py-2 px-3 border border-stone-200/60">
                      <p className="font-serif text-base sm:text-lg font-bold text-[#B4136D]">
                        {artist.sales}
                      </p>
                      <p className="text-[10px] uppercase font-semibold text-stone-500 mt-0.5">
                        Sold
                      </p>
                    </div>
                  </div>

                  {/* Portfolio Link Button */}
                  <Link
                    href={`/artworks?search=${encodeURIComponent(artist.name || "")}`}
                    className="mt-6 w-full py-3 rounded-full bg-stone-100 hover:bg-[#B4136D] text-stone-800 hover:text-white text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 group/btn cursor-pointer shadow-2xs"
                  >
                    <span>View All Artworks</span>
                    <ArrowRight
                      size={14}
                      className="transform group-hover/btn:translate-x-1 transition-transform"
                    />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          /* Fine Art Museum Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full bg-white rounded-[2rem] border border-dashed border-stone-300/90 py-16 px-6 sm:px-12 text-center flex flex-col items-center justify-center shadow-xs"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-stone-100 flex items-center justify-center text-[#B4136D] mb-5 border border-stone-200/80 shadow-2xs">
              <Users size={32} className="stroke-[1.5]" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-[11px] font-semibold text-stone-600 uppercase tracking-widest mb-3">
              <span>Roster Updating</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
              Featured Artists Roster Updating
            </h3>
            <p className="text-stone-600 text-sm sm:text-base max-w-md font-normal leading-relaxed mb-8">
              We are currently vetting and onboarding visionary creators and master painters. Discover artworks from our full community in the meantime.
            </p>
            <Link
              href="/artworks"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-stone-900 hover:bg-[#B4136D] text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm group"
            >
              <span>Explore All Artworks</span>
              <ArrowRight
                size={14}
                className="transform group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TopArtist;