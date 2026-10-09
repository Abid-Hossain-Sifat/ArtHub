"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { artworkCollection } from "@/lib/data";
import { ArrowRight, Sparkles, Palette } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { TopArtSkeleton } from "./Skeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: (isRightSide) => ({
    opacity: 0,
    x: isRightSide ? 30 : -30,
  }),
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const TopArt = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArt = async () => {
      try {
        const topArtworks = await artworkCollection({
          status: "available",
          limit: 6,
        });
        const list = Array.isArray(topArtworks)
          ? topArtworks
          : topArtworks?.artworks || [];
        setArtworks(list);
      } catch (err) {
        console.error("Error fetching top artworks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArt();
  }, []);

  const getGridClass = (index) => {
    switch (index) {
      case 0:
        // Top-Left Large Showcase (2 cols x 2 rows: Col 1-2, Row 1-2)
        return "col-span-1 sm:col-span-2 lg:col-span-2 lg:row-span-2";
      case 5:
        // Bottom-Right Large Showcase (2 cols x 2 rows: Col 3-4, Row 2-3)
        return "col-span-1 sm:col-span-2 lg:col-span-2 lg:row-span-2 lg:col-start-3 lg:row-start-2";
      default:
        return "col-span-1";
    }
  };

  if (loading) {
    return <TopArtSkeleton />;
  }

  return (
    <section className="w-full bg-[#FAF8F5] py-16 sm:py-24 border-t border-stone-200/60 overflow-hidden">
      {/* Standard Unified Container Width */}
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
              <span>Weekly Curation</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-stone-950 tracking-tight leading-tight">
              Featured Masterpieces
            </h2>
            <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
              Explore our curated selection of high-potential original works and certified digital editions.
            </p>
          </div>

          <Link
            href="/artworks"
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white hover:bg-stone-50 border border-stone-200/90 text-stone-800 hover:text-stone-950 text-xs sm:text-sm font-semibold shadow-2xs hover:border-[#B4136D]/40 transition-all duration-200 group shrink-0"
          >
            <span>View Full Gallery</span>
            <ArrowRight
              size={15}
              className="transform group-hover:translate-x-1 transition-transform text-[#B4136D]"
            />
          </Link>
        </motion.div>

        {artworks.length > 0 ? (
          /* Curated Symmetrical Diagonal Bento Grid */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 auto-rows-[270px] sm:auto-rows-[280px] grid-flow-dense"
          >
            {artworks.map((art, index) => {
              const isSpotlight = index === 0 || index === 5;
              const isRightSide = index === 1 || index === 2 || index === 5;
              return (
                <motion.div
                  key={art._id}
                  custom={isRightSide}
                  variants={cardVariants}
                  className={`relative bg-white p-2.5 sm:p-3 border border-stone-200/90 rounded-[2rem] overflow-hidden group shadow-[0_4px_20px_rgba(28,25,23,0.04)] hover:shadow-[0_18px_45px_rgba(28,25,23,0.1)] hover:border-stone-300 transition-shadow duration-300 ${getGridClass(
                    index
                  )}`}
                >
                  <Link
                    href={`/artworks/${art._id}`}
                    className="block w-full h-full relative overflow-hidden rounded-[1.4rem] bg-stone-100"
                  >
                    {/* Artwork High-Res Image */}
                    <Image
                      src={art.image}
                      alt={
                        art.title
                          ? `${art.title} - Artwork by ${art.artistName || "Artist"}`
                          : "Featured Masterpiece"
                      }
                      fill
                      sizes={
                        isSpotlight
                          ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                          : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      }
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      priority={isSpotlight}
                    />

                    {/* Subtle Inner Sheen & Gradient for Text Contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/25 to-transparent transition-opacity duration-300" />

                    {/* Top Badges */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
                      {/* Category / Medium Badge */}
                      <span className="bg-stone-950/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-[10px] font-semibold text-stone-200 uppercase tracking-wider">
                        {art.category || "Original Art"}
                      </span>

                      {/* Spotlight Badges for Top-Left and Bottom-Right Showcase Cards */}
                      {index === 0 && (
                        <span className="bg-[#B4136D]/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5 shadow-sm">
                          <Sparkles size={11} />
                          <span>Curator's Choice</span>
                        </span>
                      )}

                      {index === 5 && (
                        <span className="bg-amber-600/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5 shadow-sm">
                          <Sparkles size={11} className="text-amber-200" />
                          <span>Exhibition Spotlight</span>
                        </span>
                      )}
                    </div>

                    {/* Bottom Artwork Card Metadata */}
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end text-white">
                      <h3
                        className={`font-serif font-bold truncate group-hover:text-[#f472b6] transition-colors ${
                          isSpotlight ? "text-lg sm:text-xl" : "text-base"
                        }`}
                      >
                        {art.title}
                      </h3>

                      <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-white/15">
                        <span className="text-xs text-stone-300 truncate max-w-[140px] font-medium">
                          by {art.artistName}
                        </span>
                        <span className="font-serif text-sm sm:text-base font-bold text-amber-300 shrink-0">
                          ${art.price?.toLocaleString()}
                        </span>
                      </div>
                    </div>
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
              <Palette size={32} className="stroke-[1.5]" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-[11px] font-semibold text-stone-600 uppercase tracking-widest mb-3">
              <span>Catalog Updating</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
              Curating New Masterpieces
            </h3>
            <p className="text-stone-600 text-sm sm:text-base max-w-md font-normal leading-relaxed mb-8">
              Our curatorial team is currently selecting fresh original works and certified editions. Discover the full collection in the meantime.
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

export default TopArt;