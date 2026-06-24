"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const UserDashboardPurchaseHistoryPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const purchaseData = [
    {
      id: 1,
      artworkName: "Mystic Sunset",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=100&auto=format&fit=crop&q=60", 
      artist: "Alex Morgan",
      price: 120.00,
      purchaseDate: "June 15, 2026",
    },
    {
      id: 2,
      artworkName: "Abstract Echoes",
      image: "", 
      artist: "Sophia الراعي",
      price: 250.00,
      purchaseDate: "May 28, 2026",
    },
    {
      id: 3,
      artworkName: "Ocean Breeze",
      image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=100&auto=format&fit=crop&q=60",
      artist: "Liam Chen",
      price: 85.50,
      purchaseDate: "April 12, 2026",
    },
    {
      id: 4,
      artworkName: "Golden Hour",
      image: "https://images.unsplash.com/photo-1579783928621-7a13d66a6211?w=100&auto=format&fit=crop&q=60",
      artist: "Emma Watson",
      price: 450.00,
      purchaseDate: "March 05, 2026",
    },
  ];

  const TableSkeleton = () => {
    return Array(4).fill(0).map((_, index) => (
      <tr key={index} className="animate-pulse">
        {/* Artwork Name Skeleton */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-200 flex-shrink-0" />
            <div className="h-4 bg-slate-200 rounded w-28" />
          </div>
        </td>
        {/* Artist Badge Skeleton */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-6 bg-slate-200 rounded-full w-20" />
        </td>
        {/* Price Skeleton */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 bg-slate-200 rounded w-14" />
        </td>
        {/* Purchase Date Skeleton */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 bg-slate-200 rounded w-24" />
        </td>
      </tr>
    ));
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 bg-slate-50/50 min-h-screen space-y-6">
      
      {/* HEADING TITLE */}
      <div className="space-y-1">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight">
          Purchase History
        </h1>
        <p className="text-slate-500 text-xs md:text-sm">
          Review and manage your previously purchased masterpieces.
        </p>
      </div>

      {/* TABLE CONTAINER */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Artwork Name</th>
                <th className="px-6 py-4">Artist</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Purchase Date</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {loading ? (
                <TableSkeleton />
              ) : purchaseData.length === 0 ? (
                <tr>
                  <td className="px-6 py-10 text-center text-slate-500" colSpan={4}>
                    You have not purchased any artworks yet.
                  </td>
                </tr>
              ) : (
                purchaseData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                    
                    {/* Artwork Column with Image */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.artworkName} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg">🎨</span>
                          )}
                        </div>
                        <span className="font-semibold text-slate-900">{item.artworkName || 'Untitled'}</span>
                      </div>
                    </td>

                    {/* Artist Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-600 capitalize">
                        {item.artist}
                      </span>
                    </td>

                    {/* Price Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-slate-900 font-bold">
                      ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                    </td>

                    {/* Purchase Date Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {item.purchaseDate}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
};

export default UserDashboardPurchaseHistoryPage;