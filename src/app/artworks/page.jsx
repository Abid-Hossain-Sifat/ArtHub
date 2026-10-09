"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List as ListIcon,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { artworkCollection, artworkFilters } from "../../lib/data";
import { CardSkeleton, ListCardSkeleton } from "@/Components/Skeleton";
import Image from "next/image";

// Elegant subtle fade & reveal animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.97,
    transition: { duration: 0.12, ease: "easeIn" },
  },
};

const ArtworksPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [artworks, setArtworks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // View mode toggle: "grid" or "list"
  const [viewMode, setViewMode] = useState("grid");

  // Read current filters from URL searchParams
  const selectedCategory = searchParams.get("category") || "";
  const selectedStatus = searchParams.get("status") || "";
  const selectedSort = searchParams.get("sort") || "";
  const currentPage = parseInt(searchParams.get("page"), 10) || 1;
  const currentSearch = searchParams.get("search") || "";

  // Local state for the search input element
  const [searchQuery, setSearchQuery] = useState(currentSearch);

  // Dropdown States
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Helper to update URL parameters
  const updateQueryParams = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`/artworks?${params.toString()}`, { scroll: false });
  };

  // 1. Debounce and sync search input to URL parameters
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery !== currentSearch) {
        updateQueryParams({ search: searchQuery, page: 1 });
      }
    }, 450);
    return () => clearTimeout(handler);
  }, [searchQuery, currentSearch]);

  // 2. Sync search input with URL search param changes
  useEffect(() => {
    setSearchQuery(currentSearch);
  }, [currentSearch]);

  // 3. Handle sessionSearch (artist statistics page click redirects) on mount
  useEffect(() => {
    const sessionSearch = sessionStorage.getItem("artistSearch");
    if (sessionSearch) {
      sessionStorage.removeItem("artistSearch");
      updateQueryParams({ search: sessionSearch, page: 1 });
    }
  }, []);

  // 4. Fetch filters on mount
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const data = await artworkFilters();
        if (data?.categories) setCategories(data.categories);
        if (data?.statuses) setStatuses(data.statuses);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    loadFilters();
  }, []);

  // 5. Fetch artworks when URL search parameters change
  useEffect(() => {
    const loadArtworks = async () => {
      setLoading(true);
      try {
        const data = await artworkCollection({
          search: currentSearch,
          category: selectedCategory,
          status: selectedStatus,
          sort: selectedSort,
          page: currentPage,
          limit: 12,
        });
        if (data && data.artworks) {
          setArtworks(data.artworks || []);
          setTotalPages(data.totalPages || 1);
          setTotalCount(data.totalCount || data.artworks.length);
        } else {
          setArtworks(data || []);
          setTotalPages(1);
          setTotalCount(Array.isArray(data) ? data.length : 0);
        }
      } catch (error) {
        console.error("Error fetching artworks:", error);
      } finally {
        setLoading(false);
      }
    };
    loadArtworks();
  }, [currentSearch, selectedCategory, selectedStatus, selectedSort, currentPage]);

  const hasActiveFilters =
    Boolean(selectedCategory) ||
    Boolean(selectedStatus) ||
    Boolean(selectedSort) ||
    Boolean(currentSearch);

  const clearAllFilters = () => {
    setSearchQuery("");
    router.push("/artworks", { scroll: false });
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] text-stone-900 antialiased selection:bg-[#B4136D]/15 selection:text-[#B4136D]">
      <div className="w-full max-w-[90%] md:max-w-[85%] lg:max-w-[80%] mx-auto py-10 sm:py-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B4136D]/10 border border-[#B4136D]/20 text-[#B4136D] text-[11px] font-bold uppercase tracking-widest mb-3">
              <Sparkles size={12} className="text-[#B4136D]" />
              <span>The Permanent Collection</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-[1.15]">
              Explore Masterpieces
            </h1>
            <p className="text-stone-500 mt-2.5 text-sm sm:text-base font-normal leading-relaxed max-w-xl">
              Curated original creations from international masters and vanguard creators. Available for direct collector acquisition.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 hidden sm:inline mr-1">
              View
            </span>
            <div className="inline-flex items-center p-1 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#B4136D] text-white shadow-xs"
                    : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
                }`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="List view"
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-[#B4136D] text-white shadow-xs"
                    : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
                }`}
              >
                <ListIcon size={16} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white border border-stone-200/90 rounded-[2rem] p-3.5 sm:p-4 mb-6 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row items-center justify-between gap-3.5"
        >
          {/* Search Box */}
          <div className="relative w-full lg:max-w-md flex items-center bg-[#FAF8F5] border border-stone-200 rounded-2xl px-4 py-2.5 focus-within:border-[#B4136D]/60 focus-within:bg-white focus-within:ring-3 focus-within:ring-[#B4136D]/10 transition-all duration-200">
            <Search size={17} className="text-stone-400 mr-2.5 shrink-0" />
            <input
              type="text"
              aria-label="Search artworks by title or artist"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, medium, or artist name..."
              className="bg-transparent outline-none w-full text-sm font-medium text-stone-800 placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  updateQueryParams({ search: "", page: 1 });
                }}
                aria-label="Clear search input"
                className="text-stone-400 hover:text-stone-700 p-0.5 rounded-full hover:bg-stone-200/60 transition cursor-pointer shrink-0"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Filters & Sort Controls */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 w-full lg:w-auto justify-stretch sm:justify-end overflow-visible">
            {/* Category Filter */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                  setIsStatusOpen(false);
                  setIsSortOpen(false);
                }}
                aria-haspopup="listbox"
                aria-expanded={isCategoryOpen}
                aria-label="Filter by Category"
                className={`flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all duration-150 cursor-pointer shrink-0 shadow-2xs ${
                  selectedCategory
                    ? "bg-[#B4136D]/10 text-[#B4136D] border-[#B4136D]/30"
                    : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50 hover:border-stone-300"
                }`}
              >
                <span className="truncate">{selectedCategory || "All Categories"}</span>
                <ChevronDown
                  size={14}
                  className={`shrink-0 transition-transform duration-200 ${
                    isCategoryOpen ? "rotate-180" : ""
                  } ${selectedCategory ? "text-[#B4136D]" : "text-stone-400"}`}
                />
              </button>
              <AnimatePresence>
                {isCategoryOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsCategoryOpen(false)}
                    />
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-full sm:w-52 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 py-1.5 origin-top-right overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          updateQueryParams({ category: "", page: 1 });
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-stone-50 cursor-pointer ${
                          !selectedCategory
                            ? "text-[#B4136D] bg-[#B4136D]/5 font-bold"
                            : "text-stone-700"
                        }`}
                      >
                        All Categories
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            updateQueryParams({ category: cat, page: 1 });
                            setIsCategoryOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-stone-50 cursor-pointer truncate ${
                            selectedCategory === cat
                              ? "text-[#B4136D] bg-[#B4136D]/5 font-bold"
                              : "text-stone-700"
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
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => {
                  setIsStatusOpen(!isStatusOpen);
                  setIsCategoryOpen(false);
                  setIsSortOpen(false);
                }}
                aria-haspopup="listbox"
                aria-expanded={isStatusOpen}
                aria-label="Filter by Status"
                className={`flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all duration-150 cursor-pointer shrink-0 shadow-2xs ${
                  selectedStatus
                    ? "bg-[#B4136D]/10 text-[#B4136D] border-[#B4136D]/30"
                    : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50 hover:border-stone-300"
                }`}
              >
                <span className="capitalize truncate">
                  {selectedStatus || "All Statuses"}
                </span>
                <ChevronDown
                  size={14}
                  className={`shrink-0 transition-transform duration-200 ${
                    isStatusOpen ? "rotate-180" : ""
                  } ${selectedStatus ? "text-[#B4136D]" : "text-stone-400"}`}
                />
              </button>
              <AnimatePresence>
                {isStatusOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsStatusOpen(false)}
                    />
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-2 w-full sm:w-48 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 py-1.5 origin-top-right overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          updateQueryParams({ status: "", page: 1 });
                          setIsStatusOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-stone-50 cursor-pointer ${
                          !selectedStatus
                            ? "text-[#B4136D] bg-[#B4136D]/5 font-bold"
                            : "text-stone-700"
                        }`}
                      >
                        All Statuses
                      </button>
                      {statuses.map((stat) => (
                        <button
                          key={stat}
                          onClick={() => {
                            updateQueryParams({ status: stat, page: 1 });
                            setIsStatusOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-stone-50 cursor-pointer capitalize truncate ${
                            selectedStatus === stat
                              ? "text-[#B4136D] bg-[#B4136D]/5 font-bold"
                              : "text-stone-700"
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
            <div className="relative col-span-2 sm:col-span-1 w-full sm:w-auto">
              <button
                onClick={() => {
                  setIsSortOpen(!isSortOpen);
                  setIsCategoryOpen(false);
                  setIsStatusOpen(false);
                }}
                aria-haspopup="listbox"
                aria-expanded={isSortOpen}
                aria-label="Sort artworks"
                className={`flex items-center justify-between sm:justify-start gap-2.5 w-full sm:w-auto px-4 py-2.5 text-xs font-bold rounded-xl border transition-all duration-150 cursor-pointer shrink-0 shadow-2xs ${
                  selectedSort
                    ? "bg-[#B4136D]/10 text-[#B4136D] border-[#B4136D]/30"
                    : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50 hover:border-stone-300"
                }`}
              >
                <span className="truncate">
                  Sort:{" "}
                  {selectedSort === "a-z"
                    ? "A to Z"
                    : selectedSort === "z-a"
                    ? "Z to A"
                    : selectedSort === "low-to-high"
                    ? "Price: Low to High"
                    : selectedSort === "high-to-low"
                    ? "Price: High to Low"
                    : "Curated / Newest"}
                </span>
                <SlidersHorizontal
                  size={14}
                  className={`shrink-0 ${
                    selectedSort ? "text-[#B4136D]" : "text-stone-400"
                  }`}
                />
              </button>
              <AnimatePresence>
                {isSortOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsSortOpen(false)}
                    />
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-2 w-full sm:w-52 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 py-1.5 origin-top-right overflow-hidden"
                    >
                      {[
                        { label: "Curated / Newest", value: "" },
                        { label: "Title: A to Z", value: "a-z" },
                        { label: "Title: Z to A", value: "z-a" },
                        { label: "Price: Low to High", value: "low-to-high" },
                        { label: "Price: High to Low", value: "high-to-low" },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => {
                            updateQueryParams({ sort: item.value, page: 1 });
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-stone-50 cursor-pointer ${
                            selectedSort === item.value
                              ? "text-[#B4136D] bg-[#B4136D]/5 font-bold"
                              : "text-stone-700"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Active Filter Chips & Result Counter */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-between gap-3 mb-6 px-1"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Filters:
              </span>

              {currentSearch && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-stone-800 text-xs font-medium rounded-full border border-stone-200 shadow-2xs">
                  Keyword: <span className="font-bold">"{currentSearch}"</span>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      updateQueryParams({ search: "", page: 1 });
                    }}
                    aria-label="Remove search filter"
                    className="hover:text-[#B4136D] transition cursor-pointer ml-0.5"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {selectedCategory && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#B4136D]/10 text-[#B4136D] text-xs font-semibold rounded-full border border-[#B4136D]/20 shadow-2xs">
                  Category: {selectedCategory}
                  <button
                    onClick={() => updateQueryParams({ category: "", page: 1 })}
                    aria-label="Remove category filter"
                    className="hover:text-[#930f58] transition cursor-pointer ml-0.5"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {selectedStatus && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200 capitalize shadow-2xs">
                  Status: {selectedStatus}
                  <button
                    onClick={() => updateQueryParams({ status: "", page: 1 })}
                    aria-label="Remove status filter"
                    className="hover:text-emerald-950 transition cursor-pointer ml-0.5"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              {selectedSort && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-stone-700 text-xs font-semibold rounded-full border border-stone-200 shadow-2xs">
                  Sort:{" "}
                  {selectedSort === "a-z"
                    ? "A to Z"
                    : selectedSort === "z-a"
                    ? "Z to A"
                    : selectedSort === "low-to-high"
                    ? "Low to High"
                    : selectedSort === "high-to-low"
                    ? "High to Low"
                    : selectedSort}
                  <button
                    onClick={() => updateQueryParams({ sort: "", page: 1 })}
                    aria-label="Reset sort"
                    className="hover:text-stone-900 transition cursor-pointer ml-0.5"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}

              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#B4136D] hover:text-[#930f58] hover:underline ml-1 cursor-pointer transition"
              >
                <RotateCcw size={12} />
                <span>Reset all</span>
              </button>
            </div>

            {!loading && (
              <span className="text-xs font-medium text-stone-500">
                Showing {artworks.length} of {totalCount || artworks.length} piece
                {(totalCount || artworks.length) === 1 ? "" : "s"}
              </span>
            )}
          </motion.div>
        )}

        {/* Gallery Catalog Layout */}
        <AnimatePresence mode="wait">
          {loading ? (
            viewMode === "grid" ? (
              <motion.div
                key="skeleton-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7"
              >
                {[...Array(8)].map((_, idx) => (
                  <CardSkeleton key={idx} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="skeleton-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {[...Array(5)].map((_, idx) => (
                  <ListCardSkeleton key={idx} />
                ))}
              </motion.div>
            )
          ) : artworks.length === 0 ? (
            /* Museum-Grade Empty State */
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 px-6 bg-white rounded-[2.5rem] border border-dashed border-stone-300 shadow-xs flex flex-col items-center justify-center max-w-lg mx-auto"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#B4136D]/10 flex items-center justify-center text-[#B4136D] mb-5 shadow-inner">
                <Search size={28} />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-2">
                No Masterpieces Found
              </h3>
              <p className="text-stone-500 text-sm max-w-sm mb-6 leading-relaxed">
                We couldn't locate any works matching your specific curation criteria. Try adjusting or clearing your filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B4136D] hover:bg-[#930f58] text-white text-xs font-bold rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Reset All Filters</span>
              </button>
            </motion.div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <motion.div
              key="artworks-grid"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7"
            >
              {artworks.map((artwork) => {
                const isAvailable =
                  artwork.status?.toLowerCase() === "available";
                const artworkId =
                  artwork._id || encodeURIComponent(artwork.title);

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    key={artwork._id || artwork.title}
                    className="group bg-white rounded-[2rem] overflow-hidden border border-stone-200/90 shadow-2xs hover:shadow-xl hover:border-stone-300 transition-all duration-500 flex flex-col p-3"
                  >
                    {/* Museum Matting Image Container */}
                    <Link
                      href={`/artworks/${artworkId}`}
                      className="relative aspect-[4/5] w-full rounded-[1.4rem] bg-stone-100 overflow-hidden shrink-0 shadow-inner cursor-pointer group"
                    >
                      <Image
                        src={artwork.image}
                        alt={
                          artwork.title
                            ? `${artwork.title} - Artwork by ${
                                artwork.artistName || "Artist"
                              }`
                            : "Artwork image"
                        }
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
                        {artwork.category && (
                          <span className="bg-stone-900/80 backdrop-blur-md text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md border border-white/10 shadow-sm">
                            {artwork.category}
                          </span>
                        )}

                        {artwork.status && (
                          <span
                            className={`text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-md shadow-sm border ${
                              isAvailable
                                ? "bg-emerald-500/90 backdrop-blur-sm text-white border-emerald-400/60"
                                : "bg-stone-800/85 backdrop-blur-sm text-stone-200 border-stone-600/50"
                            }`}
                          >
                            {artwork.status}
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Artwork Information */}
                    <div className="p-3 pt-3.5 flex flex-col flex-grow justify-between">
                      <div>
                        <Link href={`/artworks/${artworkId}`}>
                          <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg tracking-tight line-clamp-1 group-hover:text-[#B4136D] transition-colors duration-200 cursor-pointer">
                            {artwork.title || "Untitled Masterpiece"}
                          </h3>
                        </Link>
                        <p className="text-xs italic font-medium text-stone-500 mt-1">
                          by {artwork.artistName || "Unknown Artist"}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block -mb-0.5">
                            Estimate
                          </span>
                          <span className="text-base sm:text-lg font-bold text-stone-900 font-serif tracking-tight">
                            ${artwork.price?.toLocaleString() || "0"}
                          </span>
                        </div>

                        <Link
                          href={`/artworks/${artworkId}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-[#B4136D] text-stone-700 hover:text-white border border-stone-200/80 hover:border-[#B4136D] text-xs font-bold transition-all duration-200 cursor-pointer group/btn"
                        >
                          <span>Details</span>
                          <ArrowRight
                            size={12}
                            className="group-hover/btn:translate-x-0.5 transition-transform"
                          />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* List View */
            <motion.div
              key="artworks-list"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {artworks.map((artwork) => {
                const isAvailable =
                  artwork.status?.toLowerCase() === "available";
                const artworkId =
                  artwork._id || encodeURIComponent(artwork.title);

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    key={artwork._id || artwork.title}
                    className="group bg-white rounded-[2rem] p-4 sm:p-5 border border-stone-200/90 shadow-2xs hover:shadow-xl hover:border-stone-300 transition-all duration-500 grid grid-cols-1 md:grid-cols-12 gap-5 items-center"
                  >
                    {/* Thumbnail Image */}
                    <Link
                      href={`/artworks/${artworkId}`}
                      className="md:col-span-4 lg:col-span-3 aspect-[4/3] w-full rounded-[1.4rem] bg-stone-100 overflow-hidden relative shadow-inner cursor-pointer"
                    >
                      <Image
                        src={artwork.image}
                        alt={
                          artwork.title
                            ? `${artwork.title} - Artwork by ${
                                artwork.artistName || "Artist"
                              }`
                            : "Artwork image"
                        }
                        fill
                        sizes="(max-width: 768px) 100vw, 30vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />

                      <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
                        {artwork.category && (
                          <span className="bg-stone-900/80 backdrop-blur-md text-white text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border border-white/10 shadow-sm">
                            {artwork.category}
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Metadata & Description */}
                    <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-between h-full py-1">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <Link href={`/artworks/${artworkId}`}>
                            <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 group-hover:text-[#B4136D] transition-colors duration-200 cursor-pointer">
                              {artwork.title || "Untitled Masterpiece"}
                            </h3>
                          </Link>
                          {artwork.status && (
                            <span
                              className={`text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-md border ${
                                isAvailable
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : "bg-stone-100 text-stone-600 border-stone-200"
                              }`}
                            >
                              {artwork.status}
                            </span>
                          )}
                        </div>

                        <p className="text-xs italic font-medium text-stone-500 mb-2">
                          Created by{" "}
                          <span className="text-stone-700 font-semibold not-italic">
                            {artwork.artistName || "Unknown Artist"}
                          </span>
                        </p>

                        <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
                          {artwork.description ||
                            "A notable composition preserved in the permanent digital archive of ArtHub's curated international collection."}
                        </p>
                      </div>

                      {/* Footer Info & Action */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-3 border-t border-stone-100">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs uppercase font-bold tracking-wider text-stone-400">
                            Acquisition:
                          </span>
                          <span className="text-xl font-bold text-stone-900 font-serif">
                            ${artwork.price?.toLocaleString() || "0"}
                          </span>
                          <span className="text-[11px] font-semibold text-stone-400">
                            USD
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 rounded-lg">
                            <ShieldCheck size={13} className="text-emerald-600" />
                            Provenance Guaranteed
                          </span>

                          <Link
                            href={`/artworks/${artworkId}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B4136D] hover:bg-[#930f58] text-white text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer group/link"
                          >
                            <span>Details</span>
                            <ArrowRight
                              size={13}
                              className="group-link:translate-x-0.5 transition-transform"
                            />
                          </Link>
                        </div>
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
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-2.5 mt-12 sm:mt-16"
          >
            <button
              onClick={() => {
                updateQueryParams({ page: Math.max(currentPage - 1, 1) });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={currentPage === 1}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-stone-200 bg-white text-xs font-bold text-stone-700 transition-all shadow-2xs hover:bg-stone-50 hover:border-stone-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>←</span>
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-1.5">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                const isActive = pageNumber === currentPage;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => {
                      updateQueryParams({ page: pageNumber });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`w-9 h-9 flex items-center justify-center rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#B4136D] text-white shadow-md shadow-[#B4136D]/20"
                        : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-stone-300"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                updateQueryParams({
                  page: Math.min(currentPage + 1, totalPages),
                });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-stone-200 bg-white text-xs font-bold text-stone-700 transition-all shadow-2xs hover:bg-stone-50 hover:border-stone-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="hidden sm:inline">Next</span>
              <span>→</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const ArtworksPage = () => {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center bg-[#FAF8F5]">
          <div className="w-10 h-10 border-3 border-[#B4136D] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ArtworksPageContent />
    </Suspense>
  );
};

export default ArtworksPage;