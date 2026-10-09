"use client";

import React from "react";
import { Award, HeartHandshake, Globe, Sparkles, CheckCircle2 } from "lucide-react";
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

const WhyArtHub = () => {
  const pillars = [
    {
      icon: <Award className="w-7 h-7" />,
      tag: "Verified Provenance",
      title: "Certificate of Authenticity",
      description:
        "Every artwork includes verified creator provenance and an authenticity record, protecting long-term collector value and originality.",
      highlights: [
        "Creator-signed authenticity record",
        "Documented origin and edition history",
      ],
    },
    {
      icon: <HeartHandshake className="w-7 h-7" />,
      tag: "Fair Creator Economy",
      title: "Direct Artist Patronage",
      description:
        "Over 85% of acquisition proceeds flow directly to living artists, fostering sustainable independent creativity worldwide.",
      highlights: [
        "Direct payouts with zero hidden gallery fees",
        "Fair creator royalties on every work",
      ],
    },
    {
      icon: <Globe className="w-7 h-7" />,
      tag: "Collector Trust",
      title: "Global Curated Exchange",
      description:
        "Bank-grade Stripe encrypted checkout, insured worldwide handling, and a vetted international community of contemporary art lovers.",
      highlights: [
        "Encrypted Stripe transaction security",
        "Dispute protection & collector support",
      ],
    },
  ];

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
            <span>The ArtHub Standard</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-stone-950 tracking-tight leading-tight">
            Built for Creators & Collectors
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base font-normal leading-relaxed">
            We bridge independent contemporary artists and international art patrons through transparency, verified provenance, and fair patronage.
          </p>
        </motion.div>

        {/* 3 Pillars Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
        >
          {pillars.map((item, index) => {
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
                {/* Header Row: Icon + Tag */}
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-[#B4136D] group-hover:bg-[#B4136D] group-hover:text-white transition-all duration-300 border border-stone-200/80 shadow-2xs group-hover:scale-105">
                    {item.icon}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-stone-100/90 border border-stone-200/80 text-[10px] font-semibold text-stone-600 uppercase tracking-wider">
                    {item.tag}
                  </span>
                </div>

                {/* Title & Body */}
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-950 group-hover:text-[#B4136D] transition-colors tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-stone-600 text-sm sm:text-[15px] font-normal leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Highlights Micro-list */}
              <div className="mt-8 pt-5 border-t border-stone-100 space-y-2.5">
                {item.highlights.map((point, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-stone-600">
                    <CheckCircle2
                      size={15}
                      className="text-emerald-600 shrink-0 mt-0.5"
                    />
                    <span className="font-medium">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      </div>
    </section>
  );
};

export default WhyArtHub;