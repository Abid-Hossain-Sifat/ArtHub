"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // Framer motion import kora hoyeche
import { artworkCollection, artworkFilters } from '../../lib/data';
import { CardSkeleton } from '@/Components/Skeleton';

// Animation variants definitions
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.15, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.12, ease: "easeIn" } }
};

const ArtworksPage = () => {
  const [artworks, setArtworks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSort, setSelectedSort] = useState('');

  // Dropdown States
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 450);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const data = await artworkFilters();
        if (data.categories) setCategories(data.categories);
        if (data.statuses) setStatuses(data.statuses);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    loadFilters();
  }, []);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory, selectedStatus, selectedSort]);

  useEffect(() => {
    const loadArtworks = async () => {
      setLoading(true);
      try {
        const data = await artworkCollection({
          search: debouncedSearch,
          category: selectedCategory,
          status: selectedStatus,
          sort: selectedSort,
          page: currentPage,
          limit: 12
        });
        if (data && data.artworks) {
          setArtworks(data.artworks || []);
          setTotalPages(data.totalPages || 1);
        } else {
          setArtworks(data || []);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching artworks:", error);
      } finally {
        setLoading(false);
      }
    };
    loadArtworks();
  }, [debouncedSearch, selectedCategory, selectedStatus, selectedSort, currentPage]);

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-900 antialiased selection:bg-violet-100 selection:text-violet-900">
      <div className="w-full max-w-[90%] md:max-w-[85%] lg:max-w-[80%] mx-auto py-14">

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 max-w-2xl"
        >
          <h1 className="text-4xl md:text-[42px] font-extrabold text-[#0f172a] tracking-tight leading-tight">
            Explore Masterpieces
          </h1>
          <p className="text-slate-500 mt-3 text-[15px] md:text-base font-medium leading-relaxed max-w-xl">
            Discover unique creations from the world's leading artists. Curated for the discerning collector.
          </p>
        </motion.div>

        {/* Search, Filter & sorting  */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white border border-slate-200/60 rounded-2xl p-4 mb-12 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="relative w-full md:w-85 flex items-center bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 focus-within:border-violet-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-50 transition-all duration-200">
            <Search size={18} className="text-slate-400 mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or artist..."
              className="bg-transparent outline-none w-full text-sm font-medium text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end overflow-visible">
            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all duration-150 cursor-pointer shrink-0 shadow-sm ${
                  selectedCategory ? 'bg-violet-50 text-violet-700 border-violet-200' : 'bg-white text-slate-600'
                }`}
              >
                <span>{selectedCategory || "Category"}</span>
                <ChevronDown size={14} className={selectedCategory ? "text-violet-500" : "text-slate-400"} />
              </button>
              <AnimatePresence>
                {isCategoryOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsCategoryOpen(false)} />
                    <motion.div 
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute right-0 mt-2 w-48 bg-white border border-slate-200/85 rounded-xl shadow-lg z-50 py-1.5 border-slate-100 origin-top-right"
                    >
                      <button
                        onClick={() => { setSelectedCategory(''); setIsCategoryOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 hover:text-slate-900 cursor-pointer ${
                          !selectedCategory ? 'text-violet-600 bg-violet-50/50' : 'text-slate-600'
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => { setSelectedCategory(cat); setIsCategoryOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 hover:text-slate-900 cursor-pointer ${
                            selectedCategory === cat ? 'text-violet-600 bg-violet-50/50' : 'text-slate-600'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all duration-150 cursor-pointer shrink-0 shadow-sm ${
                  selectedStatus ? 'bg-violet-50 text-violet-700 border-violet-200' : 'bg-white text-slate-600'
                }`}
              >
                <span className="capitalize">{selectedStatus || "Status"}</span>
                <ChevronDown size={14} className={selectedStatus ? "text-violet-500" : "text-slate-400"} />
              </button>
              <AnimatePresence>
                {isStatusOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsStatusOpen(false)} />
                    <motion.div 
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute right-0 mt-2 w-48 bg-white border border-slate-200/85 rounded-xl shadow-lg z-50 py-1.5 border-slate-100 origin-top-right"
                    >
                      <button
                        onClick={() => { setSelectedStatus(''); setIsStatusOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 hover:text-slate-900 cursor-pointer ${
                          !selectedStatus ? 'text-violet-600 bg-violet-50/50' : 'text-slate-600'
                        }`}
                      >
                        All Statuses
                      </button>
                      {statuses.map((stat) => (
                        <button
                          key={stat}
                          onClick={() => { setSelectedStatus(stat); setIsStatusOpen(false); }}
                          className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 hover:text-slate-900 cursor-pointer capitalize ${
                            selectedStatus === stat ? 'text-violet-600 bg-violet-50/50' : 'text-slate-600'
                          }`}
                        >
                          {stat}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Sorting */}
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-violet-600 transition-all duration-150 cursor-pointer shrink-0 shadow-sm ${
                  selectedSort ? 'bg-violet-50 text-violet-700 border-violet-300' : 'bg-white text-slate-700'
                }`}
              >
                <span>
                  Sort By: {
                    selectedSort === 'a-z' ? 'A to Z' :
                    selectedSort === 'z-a' ? 'Z to A' :
                    selectedSort === 'low-to-high' ? 'Price: Low to High' :
                    selectedSort === 'high-to-low' ? 'Price: High to Low' :
                    'Newest'
                  }
                </span>
                <SlidersHorizontal size={14} className={selectedSort ? "text-violet-600" : "text-slate-500"} />
              </button>
              <AnimatePresence>
                {isSortOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                    <motion.div 
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute right-0 mt-2 w-48 bg-white border border-slate-200/85 rounded-xl shadow-lg z-50 py-1.5 border-slate-100 origin-top-right"
                    >
                      <button
                        onClick={() => { setSelectedSort(''); setIsSortOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 hover:text-slate-900 cursor-pointer ${
                          !selectedSort ? 'text-violet-600 bg-violet-50/50' : 'text-slate-600'
                        }`}
                      >
                        Newest
                      </button>
                      <button
                        onClick={() => { setSelectedSort('a-z'); setIsSortOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 hover:text-slate-900 cursor-pointer ${
                          selectedSort === 'a-z' ? 'text-violet-600 bg-violet-50/50' : 'text-slate-600'
                        }`}
                      >
                        A to Z
                      </button>
                      <button
                        onClick={() => { setSelectedSort('z-a'); setIsSortOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 hover:text-slate-900 cursor-pointer ${
                          selectedSort === 'z-a' ? 'text-violet-600 bg-violet-50/50' : 'text-slate-600'
                        }`}
                      >
                        Z to A
                      </button>
                      <button
                        onClick={() => { setSelectedSort('low-to-high'); setIsSortOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 hover:text-slate-900 cursor-pointer ${
                          selectedSort === 'low-to-high' ? 'text-violet-600 bg-violet-50/50' : 'text-slate-600'
                        }`}
                      >
                        Price: Low to High
                      </button>
                      <button
                        onClick={() => { setSelectedSort('high-to-low'); setIsSortOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 hover:text-slate-900 cursor-pointer ${
                          selectedSort === 'high-to-low' ? 'text-violet-600 bg-violet-50/50' : 'text-slate-600'
                        }`}
                      >
                        Price: High to Low
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Responsive Grid Layout */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="skeleton-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
            >
              {[...Array(4)].map((_, idx) => (
                <CardSkeleton key={idx} />
              ))}
            </motion.div>
          ) : artworks.length === 0 ? (
            <motion.div 
              key="empty-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24 text-slate-400 font-medium bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm"
            >
              No artworks found matching your search.
            </motion.div>
          ) : (
            <motion.div 
              key="artworks-grid"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
            >
              {artworks.map((artwork) => {
                const isAvailable = artwork.status?.toLowerCase() === 'available';
                const artworkId = artwork._id || encodeURIComponent(artwork.title);

                return (
                  <motion.div
                    layout 
                    variants={cardVariants}
                    key={artwork._id || artwork.title}
                    whileHover={{ y: -6 }}
                    className="group bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_30px_-8px_rgba(124,58,237,0.14)] hover:border-violet-400/60 transition-colors duration-300 flex flex-col p-2"
                  >
                    {/* Image Container */}
                    <Link href={`/artworks/${artworkId}`} className="relative aspect-square w-full rounded-[18px] bg-slate-50 overflow-hidden shrink-0 shadow-inner cursor-pointer">
                      <img
                        src={artwork.image}
                        alt={artwork.title}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                      {artwork.status && (
                        <span className={`absolute top-3 left-3 text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-md shadow-sm border ${
                          isAvailable
                            ? 'bg-[#e2f9f0]/90 backdrop-blur-sm text-[#10b981] border-[#bbf7d0]/60'
                            : 'bg-[#f1f5f9]/90 backdrop-blur-sm text-[#64748b] border-[#e2e8f0]/60'
                        }`}>
                          {artwork.status}
                        </span>
                      )}
                    </Link>

                    {/* Text Content Area */}
                    <div className="p-3.5 pt-4 flex flex-col flex-grow justify-between">
                      <div>
                        <Link href={`/artworks/${artworkId}`}>
                          <h3 className="font-bold text-[#0f172a] text-[16px] md:text-[17px] tracking-tight line-clamp-1 group-hover:text-violet-600 transition-colors duration-200 cursor-pointer">
                            {artwork.title || "Untitled"}
                          </h3>
                        </Link>
                        <p className="text-xs italic font-medium text-slate-400 mt-0.5">
                          by {artwork.artistName}
                        </p>
                      </div>

                      <div className="mt-4 pt-1 flex items-center justify-between">
                        <span className="text-[17px] md:text-[18px] font-extrabold text-violet-600 tracking-tight">
                          ${artwork.price?.toLocaleString()}
                        </span>

                        <Link href={`/artworks/${artworkId}`} className="flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors duration-150 cursor-pointer">
                          <span>Details</span>
                          <span className="text-[10px] transform group-hover:translate-x-1 transition-transform duration-200">➔</span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center gap-2.5 mt-14"
          >
            <motion.button
              whileHover={currentPage > 1 ? { scale: 1.05 } : {}}
              whileTap={currentPage > 1 ? { scale: 0.95 } : {}}
              onClick={() => {
                setCurrentPage(prev => Math.max(prev - 1, 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 transition-all shadow-sm hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>🡐</span> Previous
            </motion.button>

            <div className="flex items-center gap-1.5">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                const isActive = pageNumber === currentPage;
                return (
                  <motion.button
                    key={pageNumber}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setCurrentPage(pageNumber);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#7042F4] to-[#FF47A6] text-white' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    {pageNumber}
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              whileHover={currentPage < totalPages ? { scale: 1.05 } : {}}
              whileTap={currentPage < totalPages ? { scale: 0.95 } : {}}
              onClick={() => {
                setCurrentPage(prev => Math.min(prev + 1, totalPages));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 transition-all shadow-sm hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Next <span>🡒</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ArtworksPage;