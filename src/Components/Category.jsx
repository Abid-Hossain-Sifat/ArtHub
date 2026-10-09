"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { artworkCollection } from "@/lib/data";
import {
  Palette,
  Laptop,
  Gem,
  Camera,
  Mountain,
  Building2,
  Landmark,
  Snowflake,
  Sailboat,
  Droplets,
  Flower2,
  Leaf,
  Sunset,
  Sun,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { CategorySkeleton } from "./Skeleton";

const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case "seascape":
      return <Sailboat size={20} />;
    case "water":
      return <Droplets size={20} />;
    case "floral":
      return <Flower2 size={20} />;
    case "nature":
      return <Leaf size={20} />;
    case "landscape":
      return <Sunset size={20} />;
    case "mountain":
      return <Mountain size={20} />;
    case "cityscape":
      return <Building2 size={20} />;
    case "architecture":
      return <Landmark size={20} />;
    case "desert":
      return <Sun size={20} />;
    case "winter":
      return <Snowflake size={20} />;
    case "painting":
      return <Palette size={20} />;
    case "digital art":
      return <Laptop size={20} />;
    case "sculpture":
      return <Gem size={20} />;
    case "photography":
      return <Camera size={20} />;
    default:
      return <Palette size={20} />;
  }
};

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

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const allArtworks = await artworkCollection();
        const artworks = allArtworks.artworks || allArtworks;

        const artworksList = Array.isArray(artworks) ? artworks : [];

        const categoryCounts = artworksList.reduce((acc, art) => {
          if (art.category) {
            acc[art.category] = (acc[art.category] || 0) + 1;
          }
          return acc;
        }, {});

        const topCategories = Object.entries(categoryCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([name, count]) => {
            const artwork = artworksList.find((art) => art.category === name);

            return {
              name,
              count,
              image: artwork?.image,
              icon: getCategoryIcon(name),
            };
          });

        setCategories(topCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <CategorySkeleton />;
  }

  return (
    <section className="w-full bg-[#FAF8F5] py-16 sm:py-24 border-t border-stone-200/60 overflow-hidden">
      {/* Standard Unified Responsive Width */}
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
              <span>Artistic Disciplines</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-stone-950 tracking-tight leading-tight">
              Explore Collections
            </h2>
            <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
              Discover original works and certified editions classified by natural elements, mediums, and artistic movements.
            </p>
          </div>

          <Link
            href="/artworks"
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white hover:bg-stone-50 border border-stone-200/90 text-stone-800 hover:text-stone-950 text-xs sm:text-sm font-semibold shadow-2xs hover:border-[#B4136D]/40 transition-all duration-200 group shrink-0"
          >
            <span>Browse All Mediums</span>
            <ArrowRight
              size={15}
              className="transform group-hover:translate-x-1 transition-transform text-[#B4136D]"
            />
          </Link>
        </motion.div>

        {categories.length > 0 ? (
          /* 6-Portrait Gallery Pillars Grid */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5"
          >
            {categories.map((cat, index) => {
              const isRightSide = index >= 3;
              return (
                <motion.div
                  key={cat.name || index}
                  custom={isRightSide}
                  variants={cardVariants}
                  className="relative h-72 sm:h-80 lg:h-[370px] rounded-[2rem] overflow-hidden group shadow-[0_4px_20px_rgba(28,25,23,0.04)] hover:shadow-[0_20px_50px_rgba(28,25,23,0.12)] border border-stone-200/90 hover:border-stone-300 transition-shadow duration-300 block bg-stone-100"
                >
                <Link
                  href={`/artworks?category=${encodeURIComponent(cat.name)}`}
                  className="w-full h-full block relative"
                >
                  {/* Category Representative Artwork Image */}
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="absolute inset-0 object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-stone-900 to-stone-800" />
                  )}

                  {/* Multi-Layered Vignette Lighting for Crisp Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/35 to-stone-950/20 group-hover:from-stone-950/98 group-hover:via-stone-950/45 transition-colors duration-500" />

                  {/* Floating Glassmorphic Discipline Icon */}
                  <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-10">
                    <div className="p-2 sm:p-2.5 rounded-full bg-stone-950/50 backdrop-blur-md border border-white/20 text-white/90 group-hover:text-amber-300 group-hover:border-amber-400/50 group-hover:scale-105 transition-all duration-300 shadow-sm">
                      {cat.icon}
                    </div>
                  </div>

                  {/* Bottom Category Details & Metatags */}
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 z-10 flex flex-col justify-end text-white">
                    <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight group-hover:text-amber-200 transition-colors truncate">
                      {cat.name}
                    </h3>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/15">
                      <span className="text-[11px] font-semibold text-stone-300 uppercase tracking-wider">
                        {cat.count} {cat.count === 1 ? "Artwork" : "Artworks"}
                      </span>
                      <ArrowRight
                        size={14}
                        className="text-stone-300 group-hover:text-amber-300 group-hover:translate-x-1 transition-all duration-300 shrink-0"
                      />
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
              Curating Artistic Collections
            </h3>
            <p className="text-stone-600 text-sm sm:text-base max-w-md font-normal leading-relaxed mb-8">
              Our curatorial team is organizing fresh collections and mediums. Explore available works in the gallery in the meantime.
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

export default Category;
