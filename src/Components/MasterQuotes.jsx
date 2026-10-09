"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Quote } from "lucide-react";
import { motion } from "framer-motion";

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

const masters = [
  {
    name: "Vincent van Gogh",
    movement: "Post-Impressionism",
    years: "1853 – 1890",
    theme: "On Creative Vision",
    image: "/Assets/van_gogh.jpg",
    quote:
      "I dream my painting, and then I paint my dream.",
    context:
      "A testament to raw emotional intuition guiding every brushstroke against the canvas.",
  },
  {
    name: "Pablo Picasso",
    movement: "Cubism & Modernism",
    years: "1881 – 1973",
    theme: "On the Purpose of Art",
    image: "/Assets/picasso.jpg",
    quote:
      "Art washes away from the soul the dust of everyday life.",
    context:
      "A timeless reminder that creative expression is essential to the human spirit and consciousness.",
  },
  {
    name: "Claude Monet",
    movement: "Impressionism",
    years: "1840 – 1926",
    theme: "On Light & Color",
    image: "/Assets/monet.jpg",
    quote:
      "Color is my day-long obsession, joy, and torment.",
    context:
      "Capturing fleeting atmospheric light and the living essence of natural landscapes.",
  },
];

const MasterQuotes = () => {
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
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100/90 border border-stone-200/90 text-[11px] font-semibold text-stone-700 uppercase tracking-[0.2em] mb-3 shadow-2xs">
            <Sparkles size={12} className="text-[#B4136D]" />
            <span>Timeless Philosophies</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-stone-950 tracking-tight leading-tight">
            Voices of the Masters
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base font-normal leading-relaxed">
            Enduring wisdom from legendary visionaries whose strokes redefined the history of human perception and artistic expression.
          </p>
        </motion.div>

        {/* 3 Master Quotes Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
        >
          {masters.map((master, index) => {
            const direction = index === 0 ? "left" : index === 2 ? "right" : "center";
            return (
              <motion.div
                key={index}
                custom={direction}
                variants={cardVariants}
                className="relative bg-white rounded-[2rem] p-7 sm:p-9 border border-stone-200/90 shadow-[0_4px_20px_rgba(28,25,23,0.04)] hover:shadow-[0_20px_50px_rgba(28,25,23,0.1)] hover:border-stone-300 transition-shadow duration-300 flex flex-col justify-between group overflow-hidden"
              >
              {/* Subtle Atmospheric Studio Glow at Top */}
              <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#B4136D]/6 to-transparent pointer-events-none" />

              <div>
                {/* Header Row: Philosophy Tag + Watermark Quote Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 rounded-full bg-stone-100/90 border border-stone-200/80 text-[10px] font-semibold text-stone-600 uppercase tracking-wider">
                    {master.theme}
                  </span>
                  <Quote
                    size={28}
                    className="text-stone-200 group-hover:text-[#B4136D]/30 transition-colors"
                  />
                </div>

                {/* Primary Master Quote in Fraunces Serif */}
                <blockquote className="font-serif text-xl sm:text-2xl font-bold text-stone-900 group-hover:text-[#B4136D] transition-colors leading-snug tracking-tight">
                  “{master.quote}”
                </blockquote>

                {/* Curatorial Annotation */}
                <p className="mt-3.5 text-stone-500 text-xs sm:text-sm font-normal leading-relaxed">
                  {master.context}
                </p>
              </div>

              {/* Bottom Museum Plaque: Master Portrait Image + Metadata */}
              <div className="mt-8 pt-5 border-t border-stone-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  {/* Master Portrait Thumbnail */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-stone-200/80 shrink-0 group-hover:scale-105 transition-transform duration-300 bg-stone-100">
                    <Image
                      src={master.image}
                      alt={master.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-stone-950 text-base sm:text-lg leading-snug group-hover:text-[#B4136D] transition-colors">
                      {master.name}
                    </h3>
                    <p className="text-xs text-stone-500 font-medium mt-0.5">
                      {master.movement}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-stone-400 bg-stone-50 px-2.5 py-1 rounded-full border border-stone-200/60 shrink-0">
                  {master.years}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      </div>
    </section>
  );
};

export default MasterQuotes;
