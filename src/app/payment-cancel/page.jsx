"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] text-stone-900 antialiased flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md mx-auto bg-white border border-stone-200/90 rounded-[2.5rem] p-8 md:p-10 shadow-2xl text-center relative overflow-hidden"
      >
        {/* Subtle decorative aura */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-300/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-300/10 rounded-full blur-3xl pointer-events-none" />

        {/* Cancel Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 160 }}
          className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-rose-100"
        >
          <XCircle className="w-10 h-10" />
        </motion.div>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight mb-2">
          Acquisition Discontinued
        </h1>
        <p className="text-stone-500 font-normal text-xs sm:text-sm mb-8 px-2 leading-relaxed">
          Your checkout session was concluded without charge. The masterpiece remains reserved in the public salon whenever you are ready.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.back()}
            className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm py-4 rounded-xl shadow-md transition-all duration-200 active:scale-98 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Artwork</span>
          </button>
          <Link
            href="/artworks"
            className="w-full text-stone-500 hover:text-stone-800 font-bold text-xs py-2 transition cursor-pointer"
          >
            Explore Public Salons
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
