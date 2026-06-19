"use client";
import React from 'react';
import Errorimg from "../../public/Assets/Error.png"; // আপনার ফোল্ডার স্ট্রাকচার অনুযায়ী পাথ
import Image from 'next/image';
import Link from 'next/link';
import { Home, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  // ১. পেজ লোড হওয়ার সময় ইন্ট্রো অ্যানিমেশন
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // ২. বক্সটির চিরস্থায়ী ভাসমান অ্যানিমেশন
  const boxFloatingAnimation = {
    y: [0, -12, 0], 
    transition: {
      duration: 5,        
      ease: "easeInOut",  
      repeat: Infinity,   
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-sans antialiased px-4 py-8 sm:py-12 overflow-hidden">
      
      {/* ১. ব্যাকগ্রাউন্ড ইমেজ সেকশন */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image 
          src={Errorimg} 
          alt="Art Gallery Background" 
          fill
          priority
          style={{ objectFit: "cover" }}
          className="brightness-[0.85]"
        />
        <div className="absolute inset-0 bg-black/15 backdrop-blur-[3px]" />
      </div>

      {/* ২. ফুললি রেসপন্সিভ গ্লাস মরফিজম বক্স */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileInView={boxFloatingAnimation}
        className="relative z-10 w-full max-w-[90%] sm:max-w-[540px] md:max-w-[640px] bg-white/80 backdrop-blur-xl rounded-[24px] sm:rounded-[32px] border border-white/40 shadow-[0_30px_70px_rgba(0,0,0,0.18)] text-center p-6 sm:p-10 md:p-16 flex flex-col items-center justify-center mx-auto"
      >
        
        {/* ৪MD গ্লোয়িং টেক্সট (মোবাইল থেকে ডেস্কটপে রেসপন্সিভ সাইজিং) */}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7042F4] via-[#FF47A6] to-[#7042F4] font-black tracking-tight text-[64px] sm:text-[96px] md:text-[110px] leading-none mb-1 sm:mb-2 select-none block drop-shadow-[0_0_25px_rgba(112,66,244,0.55)] filter">
          404
        </span>

        {/* হেডিং সেকশন (Responsive Text Size) */}
        <h1 className="text-[20px] sm:text-[30px] md:text-[36px] lg:text-[38px] font-black tracking-tight text-[#0F172A] leading-[1.25] sm:leading-[1.2] mb-3 sm:mb-4 px-2">
          An Uncharted Masterpiece
        </h1>

        {/* ডেসক্রিপশন (Responsive Max-Width & Text Size) */}
        <p className="text-slate-600 text-xs sm:text-sm md:text-base font-medium max-w-[280px] sm:max-w-[420px] md:max-w-[480px] mx-auto leading-relaxed mb-6 sm:mb-8">
          The digital canvas or gallery exhibit you are searching for has never been created or exists outside of this collection.
        </p>

        {/* অ্যাকশন বাটনসমূহ (মোবাইলে উপর-নিচে এবং ট্যাবলেটে/পিসিতে পাশাপাশি বসবে) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-[280px] sm:max-w-[400px] md:max-w-[440px]">
          {/* Return Home */}
          <Link href="/" className="w-full sm:w-auto flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#7042F4] to-[#FF47A6] hover:opacity-[0.95] text-white font-bold py-3 sm:py-3.5 px-5 sm:px-6 rounded-full text-xs sm:text-sm shadow-md shadow-purple-500/10 transition-all"
            >
              <Home size={16} />
              Return Home
            </motion.button>
          </Link>

          {/* Return ArtWorks */}
          <Link href="/artworks" className="w-full sm:w-auto flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 bg-transparent border-2 border-slate-300 text-slate-800 hover:bg-slate-900/5 font-bold py-3 px-5 sm:px-6 rounded-full text-xs sm:text-sm transition-all"
            >
              <Palette size={16} className="text-[#7042F4]" />
              Return ArtWorks
            </motion.button>
          </Link>
        </div>

      </motion.div>
    </div>
  );
};

export default NotFoundPage;