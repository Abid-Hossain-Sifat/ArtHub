"use client";

import React, { useState } from "react";
import { Sparkles, ChevronDown, HelpCircle, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const faqs = [
  {
    question: "How does ArtHub verify the authenticity and provenance of artworks?",
    answer:
      "Every original work curated on ArtHub undergoes verification by our curatorial team. Upon acquisition, buyers receive a formal Certificate of Authenticity (COA) specifying the medium, creation date, dimensions, verified artist signature, and edition provenance.",
  },
  {
    question: "How are acquisitions processed and payments secured?",
    answer:
      "All acquisitions are securely handled via Stripe's bank-grade encrypted checkout. We support major international debit/credit cards, and proceeds are protected through escrow until the artwork safely arrives at your delivery destination.",
  },
  {
    question: "How does the direct creator royalty model work?",
    answer:
      "Unlike traditional brick-and-mortar galleries that take 50% or more in consignment commissions, ArtHub delivers over 85% of primary acquisition proceeds directly to the living artist's studio. This ensures independent creators earn sustainable livelihoods.",
  },
  {
    question: "What is the global packaging and insured delivery process?",
    answer:
      "Each canvas and framed piece is packaged using museum-grade archival materials, acid-free glassine paper, and reinforced custom crating. Every shipment includes end-to-end global tracking and full transit insurance.",
  },
  {
    question: "How can independent visual artists exhibit and sell their work on ArtHub?",
    answer:
      "Artists can register directly on our platform. Once registered, you unlock your personal studio dashboard where you can publish original pieces, manage inventory, view live sales analytics, and receive direct payments upon acquisition.",
  },
];

const faqContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const faqItemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

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
            <span>Got Questions?</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-stone-950 tracking-tight leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base font-normal leading-relaxed">
            Everything you need to know about acquiring fine art, verified provenance, international delivery, and artist patronage.
          </p>
        </motion.div>

        {/* Accordion Container */}
        <motion.div
          variants={faqContainerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="max-w-3xl mx-auto space-y-4"
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                variants={faqItemVariants}
                className={`rounded-[1.75rem] border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-white border-stone-300 shadow-[0_10px_35px_rgba(28,25,23,0.06)]"
                    : "bg-white/80 hover:bg-white border-stone-200/90 shadow-2xs"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full py-5 px-6 sm:px-7 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-base sm:text-lg font-bold text-stone-900 leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                      isOpen
                        ? "bg-[#B4136D] text-white border-[#B4136D] rotate-180"
                        : "bg-stone-100 text-stone-600 border-stone-200/80 rotate-0"
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 sm:px-7 pb-6 pt-1 text-stone-600 text-sm sm:text-[15px] font-normal leading-relaxed border-t border-stone-100">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Curatorial Inquiries Support Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto mt-12 bg-white rounded-2xl p-6 sm:p-7 border border-stone-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-[#B4136D] shrink-0 border border-stone-200/80 shadow-2xs">
              <MessageSquare size={22} />
            </div>
            <div>
              <h4 className="font-serif font-bold text-stone-900 text-base">
                Have an inquiry about a specific piece?
              </h4>
              <p className="text-xs sm:text-sm text-stone-500 font-normal mt-0.5">
                Our curatorial advisors are available to assist collectors with provenance and shipping.
              </p>
            </div>
          </div>
          <Link
            href="/artworks"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-900 hover:bg-[#B4136D] text-white text-xs sm:text-sm font-semibold transition-all duration-200 shadow-xs shrink-0"
          >
            <span>Explore Catalog</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Faq;
