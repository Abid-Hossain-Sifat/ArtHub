"use client";

import React, { useState, useEffect } from "react";
import { getTransactions } from "@/lib/data";
import { ChevronLeft, ChevronRight, Receipt, Sparkles, Calendar, CheckCircle2 } from "lucide-react";

const AdminDashboardTransaction = () => {
  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const filteredData =
    filter === "All"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (type) => {
    setFilter(type);
    setCurrentPage(1);
  };

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await getTransactions();
        setTransactions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load transactions", error);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#FAF8F5] flex justify-center items-center p-10 text-stone-500 font-sans text-sm">
        Loading financial transactions...
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-[#FAF8F5] min-h-screen font-sans text-stone-900 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B4136D]/10 text-[#B4136D] text-xs font-semibold uppercase tracking-wider mb-2">
            <Receipt className="w-3.5 h-3.5" />
            <span>Platform Treasury</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium tracking-tight text-stone-900">
            Marketplace Ledger
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Audit and verify all platform purchases, Stripe checkouts, and patron memberships.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 bg-white p-1.5 rounded-2xl border border-stone-200/90 shadow-2xs self-start md:self-auto">
          {["All", "Subscription", "Purchase"].map((item) => (
            <button
              key={item}
              onClick={() => handleFilterChange(item)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === item
                  ? "bg-[#B4136D] text-white shadow-sm"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl md:rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[650px] border-collapse">
            <thead>
              <tr className="border-b border-stone-200/80 bg-stone-50/80 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                <th className="py-4 px-6">Transaction ID</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6">Customer Email</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm text-stone-700">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400">
                    No transactions found for this filter.
                  </td>
                </tr>
              ) : (
                currentData.map((tx) => (
                  <tr key={tx.transactionId} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-stone-900">
                      {tx.transactionId}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                          tx.type === "Purchase"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200/60"
                            : "bg-[#B4136D]/10 text-[#B4136D] border-[#B4136D]/20"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            tx.type === "Purchase" ? "bg-emerald-600" : "bg-[#B4136D]"
                          }`}
                        />
                        <span>{tx.type}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-stone-600 text-xs font-medium truncate max-w-[220px]">
                      {tx.email}
                    </td>
                    <td className="py-4 px-6 font-bold text-stone-900">
                      {tx.amount}
                    </td>
                    <td className="py-4 px-6 text-stone-400 text-xs text-right">
                      {tx.date}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200/80 bg-stone-50/50">
            <span className="text-xs text-stone-500">
              Page {currentPage} of {totalPages}
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardTransaction;