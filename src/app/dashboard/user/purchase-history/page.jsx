"use client";

import React, { useState, useEffect } from "react";
import { purchaseHistory, getSubscriptionHistory } from "@/lib/data";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import Image from "next/image";
import { 
  CreditCard, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  Receipt,
  ShieldCheck
} from "lucide-react";

const UserDashboardPurchaseHistoryPage = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [purchaseData, setPurchaseData] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [activeTab, setActiveTab] = useState("artworks"); // 'artworks' | 'subscriptions'

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        if (!session?.user?.id) return;

        const [artData, subData] = await Promise.all([
          purchaseHistory(session.user.id),
          getSubscriptionHistory(session.user.id)
        ]);

        setPurchaseData(Array.isArray(artData) ? artData : []);
        setSubscriptionData(Array.isArray(subData) ? subData : []);
      } catch (err) {
        setPurchaseData([]);
        setSubscriptionData([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [session?.user?.id]);

  const TableSkeleton = () => {
    return Array(4).fill(0).map((_, index) => (
      <tr key={index} className="animate-pulse">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-stone-200 shrink-0" />
            <div className="space-y-1.5">
              <div className="h-4 bg-stone-200 rounded w-28" />
              <div className="h-3 bg-stone-200 rounded w-16" />
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-6 bg-stone-200 rounded-full w-20" />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 bg-stone-200 rounded w-16" />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 bg-stone-200 rounded w-24" />
        </td>
      </tr>
    ));
  };

  const getPlanPrice = (plan) => {
    switch (plan?.toLowerCase()) {
      case "pro": return "$9.99";
      case "premium": return "$19.99";
      default: return "$0.00";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 bg-[#FAF8F5] min-h-screen space-y-8 font-sans text-stone-900">
      
      {/* HEADING TITLE */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B4136D]/10 text-[#B4136D] text-xs font-semibold uppercase tracking-wider mb-2">
            <Receipt className="w-3.5 h-3.5" />
            <span>Financial Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium tracking-tight text-stone-900">
            Billing & Invoices
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm">
            Inspect verified transaction receipts for acquired masterpieces and patron memberships.
          </p>
        </div>
      </div>

      {/* TAB SELECTORS */}
      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setActiveTab("artworks")}
          className={`px-6 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "artworks"
              ? "border-[#B4136D] text-[#B4136D]"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <span>Artwork Purchases</span>
          <span className="px-2 py-0.5 text-[10px] rounded-full bg-stone-100 font-semibold text-stone-600">
            {purchaseData.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("subscriptions")}
          className={`px-6 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "subscriptions"
              ? "border-[#B4136D] text-[#B4136D]"
              : "border-transparent text-stone-500 hover:text-stone-800"
          }`}
        >
          <span>Patron Memberships</span>
          <span className="px-2 py-0.5 text-[10px] rounded-full bg-stone-100 font-semibold text-stone-600">
            {subscriptionData.length}
          </span>
        </button>
      </div>

      {/* TABLE CONTAINER */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-[2rem] border border-stone-200/90 shadow-2xs overflow-hidden"
      >
        <div className="overflow-x-auto">
          {activeTab === "artworks" ? (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-stone-200/80 bg-stone-50/80 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Artwork Item</th>
                  <th className="px-6 py-4">Artist Dossier</th>
                  <th className="px-6 py-4">Acquisition Price</th>
                  <th className="px-6 py-4">Purchase Date</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-stone-100 text-sm text-stone-700">
                {loading ? (
                  <TableSkeleton />
                ) : purchaseData.length === 0 ? (
                  <tr>
                    <td className="px-6 py-16 text-center text-stone-500" colSpan={5}>
                      <CreditCard className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                      <p className="font-serif text-lg text-stone-700">No Masterpiece Purchases</p>
                      <p className="text-xs text-stone-400 mt-1">Acquired pieces will display here with itemized receipts.</p>
                    </td>
                  </tr>
                ) : (
                  purchaseData.map((item) => (
                    <tr key={item._id || item.artworkId} className="hover:bg-stone-50/60 transition-colors">
                      
                      {/* Artwork Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center overflow-hidden border border-stone-200/80 shrink-0 relative">
                            {item.artworkImage ? (
                              <Image src={item.artworkImage} alt={item.artworkTitle || "Art"} fill className="object-cover" />
                            ) : (
                              <span className="text-lg">🎨</span>
                            )}
                          </div>
                          <div>
                            <span className="font-serif font-bold text-stone-900 block text-sm">
                              {item.artworkTitle || "Untitled"}
                            </span>
                            <span className="text-[11px] text-stone-400">Provenance Verified</span>
                          </div>
                        </div>
                      </td>

                      {/* Artist Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                          {item.artistName || "Independent Artist"}
                        </span>
                      </td>

                      {/* Price Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-stone-900 font-bold">
                        ${typeof item.price === "number" ? item.price.toFixed(2) : item.price}
                      </td>

                      {/* Date Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-stone-500 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>{new Date(item.purchasedAt).toLocaleDateString()}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Completed</span>
                        </span>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-stone-200/80 bg-stone-50/80 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Transaction Key</th>
                  <th className="px-6 py-4">Patron Tier Path</th>
                  <th className="px-6 py-4">Billed Amount</th>
                  <th className="px-6 py-4">Activation Date</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-stone-100 text-sm text-stone-700">
                {loading ? (
                  <TableSkeleton />
                ) : subscriptionData.length === 0 ? (
                  <tr>
                    <td className="px-6 py-16 text-center text-stone-500" colSpan={5}>
                      <CreditCard className="w-10 h-10 mx-auto text-stone-300 mb-2" />
                      <p className="font-serif text-lg text-stone-700">No Subscription Invoices</p>
                      <p className="text-xs text-stone-400 mt-1">Upgrade your patron membership to unlock higher gallery acquisition limits.</p>
                    </td>
                  </tr>
                ) : (
                  subscriptionData.map((item) => (
                    <tr key={item._id || item.transactionId} className="hover:bg-stone-50/60 transition-colors">
                      
                      {/* Transaction ID */}
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-stone-900 font-bold">
                        {item.transactionId || "TRX-SECURE"}
                      </td>

                      {/* Upgrade Path */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="px-2.5 py-0.5 font-semibold rounded bg-stone-100 text-stone-600 capitalize">
                            {item.previousPlan || "free"}
                          </span>
                          <span className="text-stone-400">➔</span>
                          <span className={`px-2.5 py-0.5 font-bold rounded capitalize border ${
                            item.newPlan === "premium"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200/60"
                              : "bg-[#B4136D]/10 text-[#B4136D] border-[#B4136D]/20"
                          }`}>
                            {item.newPlan}
                          </span>
                        </div>
                      </td>

                      {/* Price Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-stone-900 font-bold">
                        {getPlanPrice(item.newPlan)}
                      </td>

                      {/* Date Column */}
                      <td className="px-6 py-4 whitespace-nowrap text-stone-500 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>{new Date(item.changedAt).toLocaleDateString()}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Active</span>
                        </span>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>

    </div>
  );
};

export default UserDashboardPurchaseHistoryPage;