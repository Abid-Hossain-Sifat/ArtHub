"use client";

import React, { useState, useEffect } from "react";
import {
  Trash2,
  Palette,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  Sparkles
} from "lucide-react";
import { artworkCollection, deleteArtwork } from "../../../../lib/data";
import Image from "next/image";

const AdminDashboardArtworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    averagePrice: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [loading, setLoading] = useState(true);

  // Toast state
  const [toast, setToast] = useState({ show: false, message: "" });

  // Pagination & filter
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const itemsPerPage = 6;

  // Data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allArtworks = await artworkCollection();
        setArtworks(allArtworks);

        const totalArtworks = allArtworks.length;
        const availableArtworks = allArtworks.filter(
          (art) => art.status?.toLowerCase() === "available",
        ).length;

        const totalPrice = allArtworks.reduce((sum, art) => {
          const priceNum =
            typeof art.price === "string"
              ? parseFloat(art.price.replace(/[^0-9.-]+/g, ""))
              : art.price;
          return sum + (priceNum || 0);
        }, 0);
        const averagePrice =
          totalArtworks > 0 ? Math.round(totalPrice / totalArtworks) : 0;

        setStats({
          total: totalArtworks,
          available: availableArtworks,
          averagePrice: averagePrice,
        });
      } catch (error) {
        console.error("Error fetching artworks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter calculation
  const filteredArtworks = artworks.filter((art) => {
    if (filterStatus === "all") return true;
    return art.status?.toLowerCase() === filterStatus;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredArtworks.length / itemsPerPage),
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArtworks = filteredArtworks.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handleDeleteClick = (artwork) => {
    setSelectedArtwork(artwork);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedArtwork) return;

    try {
      const result = await deleteArtwork(selectedArtwork._id);
      if (!result.success) return;

      const updatedArtworks = artworks.filter(
        (art) => art._id !== selectedArtwork._id,
      );

      setArtworks(updatedArtworks);
      const newTotalPages = Math.ceil(
        updatedArtworks.filter((art) => {
          if (filterStatus === "all") return true;
          return art.status?.toLowerCase() === filterStatus;
        }).length / itemsPerPage,
      );

      const safePage =
        newTotalPages === 0 ? 1 : Math.min(currentPage, newTotalPages);
      setCurrentPage(safePage);

      const totalArtworks = updatedArtworks.length;
      const availableArtworks = updatedArtworks.filter(
        (art) => art.status?.toLowerCase() === "available",
      ).length;

      const parsePrice = (price) => {
        if (typeof price === "number") return price;
        if (!price) return 0;
        return parseFloat(String(price).replace(/[^0-9.-]+/g, "")) || 0;
      };

      const totalPrice = updatedArtworks.reduce(
        (sum, art) => sum + parsePrice(art.price),
        0,
      );

      const averagePrice =
        totalArtworks > 0 ? Math.round(totalPrice / totalArtworks) : 0;

      setStats({
        total: totalArtworks,
        available: availableArtworks,
        averagePrice,
      });
      setToast({
        show: true,
        message: `"${selectedArtwork.title}" successfully delisted.`,
      });
      setTimeout(() => setToast({ show: false, message: "" }), 4000);
    } catch (error) {
      console.log(error);
    } finally {
      setIsModalOpen(false);
      setSelectedArtwork(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center font-sans text-sm text-stone-500">
        Loading artworks catalogue...
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] p-4 sm:p-6 lg:p-8 font-sans min-h-screen text-stone-900 relative space-y-8">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-stone-900 text-white px-5 py-3.5 rounded-2xl shadow-xl max-w-sm border border-stone-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <p className="text-xs sm:text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => setToast({ show: false, message: "" })}
            className="ml-auto p-1 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B4136D]/10 text-[#B4136D] text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Exhibition Catalog</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium tracking-tight text-stone-900">
          Curated Artworks Catalogue
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm">
          Supervise global gallery submissions, inspect inventory availability, and remove obsolete pieces.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-2xl md:rounded-3xl shadow-2xs border border-stone-200/90 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Total Masterpieces
              </p>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-2 text-stone-900">
                {stats.total.toLocaleString()}
              </h2>
            </div>
            <div className="bg-[#B4136D]/10 text-[#B4136D] p-2.5 rounded-xl">
              <Palette className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[11px] text-stone-400 font-medium mt-4">
            Total studio collection
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl md:rounded-3xl shadow-2xs border border-stone-200/90 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Available Pieces
              </p>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-2 text-emerald-800">
                {stats.available}
              </h2>
            </div>
            <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded-xl">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-4">
            Active in gallery salons
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl md:rounded-3xl shadow-2xs border border-stone-200/90 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                Average Value
              </p>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-2 text-stone-900">
                ${stats.averagePrice.toLocaleString()}
              </h2>
            </div>
            <div className="bg-amber-50 text-amber-700 p-2.5 rounded-xl">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-4">
            Per piece valuation
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-stone-200/90 shadow-2xs w-fit">
        <div className="flex items-center gap-2 px-3 text-stone-500">
          <Filter className="h-3.5 w-3.5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Status
          </span>
        </div>
        <div className="flex gap-1">
          {["all", "available", "sold"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilterStatus(status);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all duration-200 cursor-pointer ${
                filterStatus === status
                  ? "bg-[#B4136D] text-white shadow-sm"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl md:rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto w-full block">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-stone-200/80 text-[11px] font-semibold tracking-wider text-stone-500 uppercase bg-stone-50/80">
                <th className="py-4 px-6">Canvas</th>
                <th className="py-4 px-6">Title & Category</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Inventory Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm text-stone-700">
              {currentArtworks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-stone-400">
                    No artworks found matching this filter.
                  </td>
                </tr>
              ) : (
                currentArtworks.map((artwork) => (
                  <tr
                    key={artwork._id}
                    className="hover:bg-stone-50/60 transition-colors"
                  >
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-2xs border border-stone-200">
                        <Image
                          src={artwork.image || "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=200&auto=format&fit=crop&q=80"}
                          alt={artwork.title || "Artwork"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-serif font-bold text-stone-900 text-sm">
                        {artwork.title}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        {artwork.category || artwork.type || "Fine Art"}
                      </div>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap font-bold text-stone-900">
                      {typeof artwork.price === "number"
                        ? `$${artwork.price.toLocaleString()}`
                        : artwork.price}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize border ${
                          artwork.status?.toLowerCase() === "available"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200/60"
                            : "bg-rose-50 text-rose-700 border-rose-200/60"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            artwork.status?.toLowerCase() === "available"
                              ? "bg-emerald-500"
                              : "bg-rose-500"
                          }`}
                        />
                        {artwork.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDeleteClick(artwork)}
                        className="text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 p-2.5 rounded-xl transition-all inline-flex items-center justify-center border border-rose-100 cursor-pointer shadow-2xs"
                        title="Delist Artwork"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-stone-200/80 bg-stone-50/50 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <p className="text-xs text-stone-500 order-2 sm:order-1">
              Showing Page{" "}
              <span className="font-semibold text-stone-900">{currentPage}</span>{" "}
              of{" "}
              <span className="font-semibold text-stone-900">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-semibold text-stone-800 px-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900">
                Delist Artwork
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-stone-900">
                "{selectedArtwork?.title}"
              </span>
              ? This action removes the piece and its digital records from the global marketplace.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedArtwork(null);
                }}
                className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-sm transition-colors cursor-pointer"
              >
                Delete Artwork
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardArtworks;
