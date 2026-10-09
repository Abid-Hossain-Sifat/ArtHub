"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { purchaseHistory } from "@/lib/data";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  PackageSearch,
  Sparkles,
  ShieldCheck,
  Calendar,
  CheckCircle2
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const GallerySkeleton = () => {
  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto p-4 md:p-8 min-h-screen">
      <div className="space-y-2">
        <div className="h-8 bg-stone-200 rounded-lg w-52 animate-pulse" />
        <div className="h-4 bg-stone-200 rounded-lg w-80 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div key={index} className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-2xs flex flex-col h-[400px]">
            <div className="relative w-full h-[240px] bg-stone-200 flex items-center justify-center animate-pulse">
              <ImageIcon className="w-10 h-10 text-stone-300" />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="h-5 bg-stone-200 rounded-md w-3/4 animate-pulse" />
                <div className="h-4 bg-stone-200 rounded-md w-1/2 animate-pulse" />
              </div>
              <div className="h-11 bg-stone-200 rounded-xl w-full animate-pulse" />
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

  const { data: session } = useSession();
  const [purchasedArtworks, setPurchasedArtworks] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        if (!session?.user?.id) return;

        const data = await purchaseHistory(session.user.id);
        const list = Array.isArray(data) ? data : data?.data || [];
        setPurchasedArtworks(list);
      } catch (err) {
        setPurchasedArtworks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [session?.user?.id]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(purchasedArtworks.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = purchasedArtworks.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return <GallerySkeleton />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 min-h-screen bg-[#FAF8F5] flex flex-col justify-between font-sans text-stone-900">
      
      <div className="space-y-8 w-full">
        {/* PAGE HEADER */}
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B4136D]/10 text-[#B4136D] text-xs font-semibold uppercase tracking-wider w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Collection</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium tracking-tight text-stone-900">
            Acquired Masterpieces
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm">
            Your permanent exhibition archive. Every masterpiece includes lifetime provenance certificates.
          </p>
        </div>

        {/* RESPONSIVE GALLERY GRID */}
        {purchasedArtworks.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[420px] border-2 border-dashed border-stone-200 rounded-[2.5rem] bg-white p-8 md:p-12 text-center shadow-2xs">
            <div className="bg-stone-50 p-4 rounded-2xl mb-4 border border-stone-100">
              <PackageSearch className="w-10 h-10 text-stone-400" />
            </div>
            <h3 className="text-xl font-serif font-bold text-stone-800">Your Private Vault is Empty</h3>
            <p className="text-stone-500 text-xs sm:text-sm mt-2 max-w-sm leading-relaxed">
              You haven't acquired any curated masterpieces yet. Discover captivating pieces in the public salon to begin your private collection.
            </p>
            <Link 
              href="/artworks" 
              className="mt-6 px-6 py-3 bg-[#B4136D] hover:bg-[#930f58] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#B4136D]/20 cursor-pointer"
            >
              Explore Gallery Salon
            </Link>
          </div>
        ) : (
          <motion.div
            key={currentPage}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {currentItems.map((artwork, index) => (
              <motion.div
                key={`${artwork.artworkId}-${index}`}
                variants={itemVariants}
                className="group bg-white rounded-[2rem] overflow-hidden border border-stone-200/90 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Artwork Canvas Frame */}
                <div>
                  <div className="relative w-full h-[240px] bg-stone-100 overflow-hidden">
                    {artwork.artworkImage ? (
                      <Image
                        src={artwork.artworkImage}
                        alt={artwork.artworkTitle || "Acquired Artwork"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-stone-200 text-2xl">🎨</div>
                    )}
                    
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-stone-200/80 shadow-2xs flex items-center gap-1.5 text-[10px] font-bold text-emerald-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Certified Provenance</span>
                    </div>
                  </div>

                  {/* Artwork Metadata Details */}
                  <div className="p-6 space-y-3">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-stone-900 line-clamp-1 group-hover:text-[#B4136D] transition-colors">
                        {artwork.artworkTitle || "Masterpiece"}
                      </h3>
                      <p className="text-xs text-stone-500 mt-1">
                        By <span className="font-semibold text-stone-700">{artwork.artistName || "Curated Artist"}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-3 border-t border-stone-100">
                      <span className="text-stone-400">Acquired Value</span>
                      <span className="text-base font-bold text-stone-900">
                        ${typeof artwork.price === "number" ? artwork.price.toLocaleString() : artwork.price}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details Button with user convention "Details" */}
                <div className="p-6 pt-0">
                  <Link 
                    href={`/artworks/${artwork.artworkId}`}
                    className="w-full flex items-center justify-center gap-2 bg-stone-50 hover:bg-[#B4136D] text-stone-700 hover:text-white font-bold py-3 px-4 rounded-xl text-xs transition-all duration-200 border border-stone-200 hover:border-[#B4136D] shadow-2xs group-hover:shadow-sm"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-10 pb-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2.5 rounded-xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentPage === page
                  ? "bg-[#B4136D] text-white shadow-sm"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2.5 rounded-xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDashboardBoughtArtworkPage;