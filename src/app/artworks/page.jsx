"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { artworkCollection, artworkFilters } from '../../lib/data';

const ArtworksPage = () => {
  const [artworks, setArtworks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const loadArtworks = async () => {
      setLoading(true);
      try {
        const data = await artworkCollection({
          search: debouncedSearch,
          category: selectedCategory,
          status: selectedStatus,
          sort: selectedSort
        });
        setArtworks(data || []);
      } catch (error) {
        console.error("Error fetching artworks:", error);
      } finally {
        setLoading(false);
      }
    };
    loadArtworks();
  }, [debouncedSearch, selectedCategory, selectedStatus, selectedSort]);

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-900 antialiased selection:bg-violet-100 selection:text-violet-900">
      <div className="w-full max-w-[90%] md:max-w-[85%] lg:max-w-[80%] mx-auto py-14">

        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <h1 className="text-4xl md:text-[42px] font-extrabold text-[#0f172a] tracking-tight leading-tight">
            Explore Masterpieces
          </h1>
          <p className="text-slate-500 mt-3 text-[15px] md:text-base font-medium leading-relaxed max-w-xl">
            Discover unique creations from the world's leading artists. Curated for the discerning collector.
          </p>
        </div>

        {/* Search, Filter & shorting */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 mb-12 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-4">
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
              {isCategoryOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsCategoryOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200/85 rounded-xl shadow-lg z-50 py-1.5 border-slate-100">
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
                  </div>
                </>
              )}
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
              {isStatusOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsStatusOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200/85 rounded-xl shadow-lg z-50 py-1.5 border-slate-100">
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
                  </div>
                </>
              )}
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
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200/85 rounded-xl shadow-lg z-50 py-1.5 border-slate-100">
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
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Responsive Grid Layout */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-[24px] overflow-hidden border border-slate-100 p-2 animate-pulse shadow-sm">
                <div className="aspect-square w-full rounded-[18px] bg-slate-200" />
                <div className="p-3.5 pt-4 space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse" />
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-6 bg-slate-200 rounded w-1/3 animate-pulse" />
                    <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-24 text-slate-400 font-medium bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
            No artworks found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {artworks.map((artwork) => {
              const isAvailable = artwork.status?.toLowerCase() === 'available';
              const artworkId = artwork._id || encodeURIComponent(artwork.title);

              return (
                <div
                  key={artwork._id || artwork.title}
                  className="group bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_-10px_rgba(124,58,237,0.12)] hover:border-violet-500/50 transition-all duration-300 flex flex-col p-2"
                >
                  {/* Image Container */}
                  <Link href={`/artworks/${artworkId}`} className="relative aspect-square w-full rounded-[18px] bg-slate-50 overflow-hidden shrink-0 shadow-inner cursor-pointer">
                    <img
                      src={artwork.image}
                      alt={artwork.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
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
                        <span className="text-[10px] transform group-hover:translate-x-0.5 transition-transform duration-200">➔</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtworksPage;