"use client";
import React, { useState, useEffect } from "react";
import { purchaseHistory } from "@/lib/data";
import { useSession } from "@/lib/auth-client";
import { getInitials, isRemote } from "@/lib/avatar";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Calendar,
  CheckCircle2
} from "lucide-react";

const SalesHistoryPage = () => {
  const { data: session } = useSession();

  const [salesData, setSalesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 8;

  useEffect(() => {
    const loadSales = async () => {
      if (!session?.user?.id) return;

      try {
        setIsLoading(true);
        const data = await purchaseHistory(undefined, session.user.id);
        setSalesData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load sales history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSales();
  }, [session]);

  // Aggregate stats
  const totalRevenue = salesData.reduce(
    (sum, row) => sum + (Number(row.price) || 0), 
    0
  );
  const totalSales = salesData.length;
  const avgSale = totalSales > 0 ? Math.round(totalRevenue / totalSales) : 0;

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = salesData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(salesData.length / itemsPerPage));

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-6 px-4 sm:px-6 md:py-10 md:px-10 font-sans text-stone-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B4136D]/10 text-[#B4136D] text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studio Ledger</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium tracking-tight text-stone-900">
              Sales History
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm leading-relaxed max-w-2xl mt-1">
              Review verified collector transactions, monitor studio payouts, and inspect real-time sales volume.
            </p>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 border border-stone-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mt-1">
                ${totalRevenue.toLocaleString()}
              </h3>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">Verified payouts</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 border border-stone-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Sold Masterpieces</p>
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mt-1">
                {totalSales}
              </h3>
              <p className="text-[11px] text-[#B4136D] font-medium mt-1">Acquired by patrons</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#B4136D]/10 text-[#B4136D] flex items-center justify-center border border-[#B4136D]/20">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 border border-stone-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Average Acquisition</p>
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mt-1">
                ${avgSale.toLocaleString()}
              </h3>
              <p className="text-[11px] text-amber-700 font-medium mt-1">Per artwork</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Main Table Container */}
        <div className="bg-white rounded-2xl md:rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200/80 text-[11px] font-semibold tracking-wider text-stone-500 uppercase bg-stone-50/80">
                  <th className="py-4 px-6 w-[36%]">Artwork Details</th>
                  <th className="py-4 px-6 w-[22%]">Collector</th>
                  <th className="py-4 px-6 w-[16%]">Date</th>
                  <th className="py-4 px-6 w-[14%]">Amount</th>
                  <th className="py-4 px-6 w-[12%] text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-stone-200 shrink-0" />
                          <div className="space-y-2">
                            <div className="h-4 w-32 bg-stone-200 rounded" />
                            <div className="h-3 w-20 bg-stone-200 rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-stone-200" />
                          <div className="h-4 w-24 bg-stone-200 rounded" />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 w-20 bg-stone-200 rounded" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 w-16 bg-stone-200 rounded" />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="h-6 w-20 bg-stone-200 rounded-full ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-stone-500">
                      <ShoppingBag className="w-12 h-12 mx-auto text-stone-300 mb-3" />
                      <p className="font-serif text-lg text-stone-700">No Sales Recorded Yet</p>
                      <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                        Once art patrons acquire your pieces, transaction certificates will appear in this ledger.
                      </p>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((row) => (
                    <tr
                      key={row._id}
                      className="hover:bg-stone-50/70 transition-colors duration-150"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/80">
                            {row.artworkImage ? (
                              <Image
                                src={row.artworkImage}
                                alt={row.artworkTitle || "Artwork"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-stone-200 text-xs">🎨</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-stone-900 text-sm truncate">
                              {row.artworkTitle}
                            </h4>
                            <p className="text-xs text-stone-500 mt-0.5 truncate">
                              {row.artistName || "Original Curation"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-stone-200 shadow-2xs shrink-0 flex items-center justify-center">
                            {isRemote(row.buyerImage) ? (
                              <Image
                                src={row.buyerImage}
                                alt={row.buyerName || "Buyer"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#B4136D] to-[#800d4d] text-white text-[10px] font-extrabold tracking-wider select-none">
                                {getInitials(row.buyerName)}
                              </div>
                            )}
                          </div>
                          <span className="text-stone-800 text-sm font-medium truncate">
                            {row.buyerName || "Art Patron"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-stone-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>{new Date(row.purchasedAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-stone-900">
                        ${typeof row.price === "number" ? row.price.toLocaleString() : row.price}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-full border border-emerald-200/60">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Settled</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="block md:hidden divide-y divide-stone-100">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="p-4 space-y-3 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-stone-200" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-32 bg-stone-200 rounded" />
                      <div className="h-3 w-20 bg-stone-200 rounded" />
                    </div>
                  </div>
                </div>
              ))
            ) : currentItems.length === 0 ? (
              <div className="p-8 text-center text-stone-500">
                <ShoppingBag className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                <p className="font-serif text-base text-stone-700">No Sales Recorded Yet</p>
              </div>
            ) : (
              currentItems.map((row) => (
                <div key={row._id} className="p-4 space-y-3 bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                        {row.artworkImage ? (
                          <Image
                            src={row.artworkImage}
                            alt={row.artworkTitle}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-stone-200 text-xs">🎨</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-stone-900 text-sm truncate">
                          {row.artworkTitle}
                        </h4>
                        <p className="text-xs text-stone-500 truncate">
                          {row.artistName || "Original"}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800 bg-emerald-50 rounded-full border border-emerald-200 shrink-0">
                      Settled
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2.5 border-t border-dashed border-stone-200">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative w-6 h-6 rounded-full overflow-hidden border border-stone-200 shadow-2xs shrink-0 flex items-center justify-center">
                        {isRemote(row.buyerImage) ? (
                          <Image
                            src={row.buyerImage}
                            alt={row.buyerName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#B4136D] to-[#800d4d] text-white text-[8px] font-extrabold tracking-wider select-none">
                            {getInitials(row.buyerName)}
                          </div>
                        )}
                      </div>
                      <span className="text-stone-700 font-medium truncate">
                        {row.buyerName}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-stone-400 block text-[10px]">
                        {new Date(row.purchasedAt).toLocaleDateString()}
                      </span>
                      <span className="font-bold text-stone-900 text-sm">
                        ${row.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="py-4 px-4 sm:px-6 border-t border-stone-200/80 bg-stone-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-medium text-stone-500 order-2 sm:order-1 text-center sm:text-left">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, salesData.length)} of {salesData.length} records
              </span>

              <div className="flex items-center gap-1.5 order-1 sm:order-2 justify-center w-full sm:w-auto">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 transition-colors hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNum = index + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? "bg-[#B4136D] text-white shadow-sm"
                          : "text-stone-600 hover:bg-white border border-transparent hover:border-stone-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 transition-colors hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SalesHistoryPage;
