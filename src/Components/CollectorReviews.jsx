"use client";

import React from "react";
import { Sparkles, Star, Quote, CheckCircle2 } from "lucide-react";
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
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const reviews = [
  {
    name: "Julian Vance",
    role: "Private Art Patron",
    location: "London, UK",
    initials: "JV",
    gradient: "from-[#B4136D] to-[#7042F4]",
    rating: 5,
    artwork: "Cerulean Coastline No. 3",
    artist: "Marcus Thorne",
    comment:
      "The certificate of authenticity and provenance records arrived flawlessly with the canvas. Experiencing the texture in person far exceeded digital previews.",
  },
  {
    name: "Sophia Chen",
    role: "Contemporary Art Enthusiast",
    location: "Singapore",
    initials: "SC",
    gradient: "from-amber-600 to-[#B4136D]",
    rating: 5,
    artwork: "Luminous Flora IV",
    artist: "Aria Montgomery",
    comment:
      "Directly supporting independent painters while receiving museum-grade delivery makes ArtHub my first choice for expanding my personal living space collection.",
  },
  {
    name: "David K. Lindqvist",
    role: "Architect & Collector",
    location: "Stockholm, Sweden",
    initials: "DL",
    gradient: "from-[#7042F4] to-emerald-600",
    rating: 5,
    artwork: "Silent Solitude in Oil",
    artist: "Elena Rostova",
    comment:
      "The transparency of creator royalties and seamless Stripe checkout sets a rare international benchmark. Highly recommended for seasoned collectors.",
  },
];

const CollectorReviews = () => {
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
            <span>Collector Reflections</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-stone-950 tracking-tight leading-tight">
            Trusted by Patrons Worldwide
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base font-normal leading-relaxed">
            Read reflections from private collectors, interior architects, and art enthusiasts who acquired original pieces through ArtHub.
          </p>
        </motion.div>

        {/* Reviews Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
        >
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="relative bg-white rounded-[2rem] p-7 sm:p-9 border border-stone-200/90 shadow-[0_4px_20px_rgba(28,25,23,0.04)] hover:shadow-[0_20px_50px_rgba(28,25,23,0.1)] hover:border-stone-300 transition-shadow duration-300 flex flex-col justify-between group overflow-hidden"
            >
              {/* Subtle Atmospheric Studio Glow at Top */}
              <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#B4136D]/6 to-transparent pointer-events-none" />

              <div>
                {/* Header Row: Stars + Watermark Quote */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <Quote size={28} className="text-stone-200 group-hover:text-[#B4136D]/20 transition-colors" />
                </div>

                {/* Testimonial Quote */}
                <p className="text-stone-700 text-sm sm:text-[15px] leading-relaxed italic font-normal">
                  "{review.comment}"
                </p>
              </div>

              {/* Bottom Section: Acquired Artwork Pill + Collector Info */}
              <div className="mt-8 pt-5 border-t border-stone-100">
                {/* Acquired Artwork Citation */}
                <div className="bg-stone-50/80 rounded-xl px-3 py-2 border border-stone-200/60 mb-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-stone-500 font-medium truncate">
                      Acquired <span className="font-semibold text-stone-800">"{review.artwork}"</span>
                    </span>
                    <span className="text-[10px] text-stone-400 shrink-0">by {review.artist}</span>
                  </div>
                </div>

                {/* Collector Profile */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-full bg-gradient-to-tr ${review.gradient} text-white font-serif font-bold text-sm flex items-center justify-center shadow-xs shrink-0 select-none`}
                    >
                      {review.initials}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-stone-900 text-sm sm:text-base group-hover:text-[#B4136D] transition-colors leading-snug">
                        {review.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 font-medium">
                        {review.role} • {review.location}
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200/60 shrink-0"
                    title="Verified Buyer Acquisition"
                  >
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CollectorReviews;
