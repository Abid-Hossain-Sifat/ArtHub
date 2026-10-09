"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex items-center justify-center p-4 selection:bg-[#B4136D]/15 selection:text-[#B4136D]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] p-8 sm:p-10 text-center border border-stone-200/90"
      >
        {/* Animated Icon Container */}
        <div className="w-20 h-20 bg-[#B4136D]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#B4136D] border border-[#B4136D]/20 shadow-inner">
          <ShieldAlert className="w-10 h-10" />
        </div>

        {/* Error Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-[10px] font-bold uppercase tracking-widest mb-3">
          <span>Error 403 • Restricted Area</span>
        </div>

        {/* Headings */}
        <h1 className="font-serif text-3xl font-bold text-stone-900 mb-2.5 tracking-tight">
          Curatorial Access Denied
        </h1>

        <p className="text-stone-500 text-xs sm:text-sm mb-8 leading-relaxed">
          Your current account does not have authorized credentials to access this private studio or administrative dashboard.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-stone-100 hover:bg-stone-200/80 text-stone-700 font-semibold transition-all cursor-pointer text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          <Link href="/" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#B4136D] hover:bg-[#930f58] text-white font-bold transition-all shadow-md shadow-[#B4136D]/20 cursor-pointer text-xs">
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default UnauthorizedPage;