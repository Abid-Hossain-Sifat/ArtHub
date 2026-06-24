"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 22 } }
};

const GallerySkeleton = () => {
  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto p-4 md:p-6 min-h-screen">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-slate-200 rounded-md w-48 animate-pulse" />
        <div className="h-4 bg-slate-200 rounded-md w-72 animate-pulse" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div key={index} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col h-[380px]">
            <div className="relative w-full h-[240px] bg-slate-200 flex items-center justify-center animate-pulse">
              <ImageIcon className="w-10 h-10 text-slate-300" />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="h-5 bg-slate-200 rounded-md w-3/4 animate-pulse" />
                <div className="h-4 bg-slate-200 rounded-md w-1/2 animate-pulse" />
              </div>
              <div className="h-10 bg-slate-200 rounded-xl w-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserDashboardBoughtArtworkPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const purchasedArtworks = [
    { id: 1, title: "Mystic Horizons", price: "$250", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=500&auto=format&fit=cover" },
    { id: 2, title: "Abstract Serenity", price: "$420", image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=500&auto=format&fit=cover" },
    { id: 3, title: "Neon Cyberpunk City", price: "$180", image: "https://images.unsplash.com/photo-1515462277126-270d878326e5?q=80&w=500&auto=format&fit=cover" },
    { id: 4, title: "Ethereal Echoes", price: "$310", image: "https://images.unsplash.com/photo-1549887534-1541e9326642?q=80&w=500&auto=format&fit=cover" },
    { id: 5, title: "Golden Hour Bloom", price: "$500", image: "https://images.unsplash.com/photo-1494905998402-395d579af36f?q=80&w=500&auto=format&fit=cover" },
    { id: 6, title: "Oceanic Whispers", price: "$290", image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=500&auto=format&fit=cover" },
    { id: 7, title: "Cosmic Dance", price: "$350", image: "https://images.unsplash.com/photo-1547891654-e66ed7edd96c?q=80&w=500&auto=format&fit=cover" },
    { id: 8, title: "Urban Solitude", price: "$210", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=500&auto=format&fit=cover" },
    { id: 9, title: "Midnight Reflections", price: "$400", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=500&auto=format&fit=cover" },
    { id: 10, title: "Vibrant Chaos", price: "$150", image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=500&auto=format&fit=cover" },
  ];

  // পেজিনেশন লজিক
  const totalPages = Math.ceil(purchasedArtworks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = purchasedArtworks.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return <GallerySkeleton />;
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto p-4 md:p-6 min-h-screen bg-slate-50/50 flex flex-col justify-between">
      
      <div className="space-y-6 w-full">
        {/* PAGE HEADER */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight">
            Bought Artworks
          </h1>
          <p className="text-slate-500 text-sm">
            A collection of all your premium purchased masterpiece pieces.
          </p>
        </div>

        {/* RESPONSIVE GALLERY GRID */}
        <motion.div
          key={currentPage}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {currentItems.map((artwork) => (
            <motion.div
              key={artwork.id}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-lg transition-all duration-300 flex flex-col h-[380px]"
            >
              {/* Artwork Image Container */}
              <div className="relative w-full h-[240px] bg-slate-100 overflow-hidden">
                <Image
                  src={artwork.image}
                  alt={artwork.title}
                  fill
                  sizes="(max-w-640px) 100vw, (max-w-1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  unoptimized
                />
              </div>

              {/* Artwork Details Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-semibold text-slate-800 line-clamp-1 group-hover:text-[#6211cf] transition-colors duration-200">
                    {artwork.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mt-0.5">
                    Purchased Value: <span className="text-slate-600 font-semibold">{artwork.price}</span>
                  </p>
                </div>

                {/* View Details Link Action */}
                <Link 
                  href={`/dashboard/bought-artworks/${artwork.id}`}
                  className="w-full flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-[#6211cf] text-slate-600 hover:text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-all duration-200 border border-slate-200/60 hover:border-[#6211cf] shadow-sm"
                >
                  <span>View Details</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8 pb-4">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                currentPage === page
                  ? 'bg-[#6211cf] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDashboardBoughtArtworkPage;