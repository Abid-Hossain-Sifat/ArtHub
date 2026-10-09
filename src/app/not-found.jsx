"use client";
import React from "react";
import Errorimg from "../../public/Assets/Error.png";
import Image from "next/image";
import Link from "next/link";
import { Home, Palette, Sparkles, Compass } from "lucide-react";
import { motion } from "framer-motion";

const NotFoundPage = () => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const boxFloatingAnimation = {
    y: [0, -8, 0],
    transition: {
      duration: 5,
      ease: "easeInOut",
      repeat: Infinity,
    },
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-sans antialiased px-4 py-8 sm:py-12 overflow-hidden selection:bg-[#B4136D]/15 selection:text-[#B4136D]">
      {/* Background with Ambient Overlay */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src={Errorimg}
          alt="Art Gallery Background"
          fill
          priority
          style={{ objectFit: "cover" }}
          className="brightness-[0.75]"
        />
        <div className="absolute inset-0 bg-[#1C1917]/40 backdrop-blur-[4px]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileInView={boxFloatingAnimation}
        className="relative z-10 w-full max-w-[90%] sm:max-w-[540px] md:max-w-[620px] bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[0_30px_70px_rgba(0,0,0,0.25)] text-center p-8 sm:p-12 md:p-14 flex flex-col items-center justify-center mx-auto"
      >
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B4136D]/10 border border-[#B4136D]/20 text-[#B4136D] text-[10px] font-bold uppercase tracking-widest mb-3">
          <Compass size={12} className="text-[#B4136D]" />
          <span>Catalog Not Located</span>
        </div>

        {/* 404 Serif Typography */}
        <span className="font-serif font-black tracking-tight text-[72px] sm:text-[96px] md:text-[110px] leading-none text-[#B4136D] select-none block drop-shadow-sm">
          404
        </span>

        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-stone-900 leading-tight mb-3">
          An Uncharted Masterpiece
        </h1>

        <p className="text-stone-600 text-xs sm:text-sm md:text-base font-normal max-w-md mx-auto leading-relaxed mb-8">
          The digital canvas or gallery exhibit you are searching for does not exist in the ArtHub permanent archive.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-sm">
          {/* Return Home */}
          <Link href="/" className="w-full sm:w-auto flex-1">
            <button className="w-full flex items-center justify-center gap-2 bg-[#B4136D] hover:bg-[#930f58] text-white font-bold py-3.5 px-6 rounded-full text-xs shadow-md shadow-[#B4136D]/20 transition-all cursor-pointer">
              <Home size={15} />
              <span>Return Home</span>
            </button>
          </Link>

          {/* Return Artworks */}
          <Link href="/artworks" className="w-full sm:w-auto flex-1">
            <button className="w-full flex items-center justify-center gap-2 bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 font-bold py-3.5 px-6 rounded-full text-xs shadow-2xs transition-all cursor-pointer">
              <Palette size={15} className="text-[#B4136D]" />
              <span>Explore Gallery</span>
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;