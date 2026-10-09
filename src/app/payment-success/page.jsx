"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Loader2, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found in the acquisition parameters.");
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/verify-payment/${sessionId}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to verify acquisition certificate");
        }

        setMetadata(data.metadata);
        await authClient.getSession();
      } catch (err) {
        console.error("Verification error:", err);
        setError(err.message || "Failed to verify transaction.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-[#B4136D] animate-spin mb-4" />
        <p className="text-stone-500 font-medium text-sm animate-pulse">
          Authenticating acquisition & generating provenance seal...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center max-w-md mx-auto p-8 bg-white border border-rose-200 rounded-[2.5rem] shadow-xl animate-in fade-in duration-200">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <RefreshCw className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Verification Notice</h2>
        <p className="text-stone-500 mb-6 font-normal text-xs sm:text-sm leading-relaxed">{error}</p>
        <Link
          href="/artworks"
          className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition cursor-pointer"
        >
          Return to Gallery
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-lg mx-auto bg-white border border-stone-200/90 rounded-[2.5rem] p-8 md:p-10 shadow-2xl text-center relative overflow-hidden"
    >
      {/* Decorative ambient aura */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#B4136D]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Provenance Seal */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 160 }}
        className="w-20 h-20 bg-emerald-50 text-emerald-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-200/70"
      >
        <ShieldCheck className="w-10 h-10 text-emerald-600" />
      </motion.div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-200/60">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        <span>Provenance Certified</span>
      </div>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-tight mb-2">
        Acquisition Confirmed
      </h1>
      <p className="text-stone-500 text-xs sm:text-sm mb-6 px-4 leading-relaxed">
        Your acquisition has been completed and cryptographically logged in the gallery ledger.
      </p>

      {/* Transaction Details Plaque */}
      {metadata && (
        <div className="bg-[#FAF8F5] border border-stone-200 rounded-2xl p-5 mb-8 text-left space-y-2.5">
          <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            Certificate Credentials
          </h3>
          {metadata.type === "artwork" ? (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Acquired Masterpiece</span>
                <span className="text-stone-900 font-serif font-bold truncate max-w-[200px]">Original Artwork</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Authenticated Collector</span>
                <span className="text-stone-900 font-bold">{metadata.buyerName || "Art Patron"}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Guild Membership Tier</span>
                <span className="text-stone-900 font-bold capitalize">{metadata.plan} Patron</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Privilege Status</span>
                <span className="text-emerald-700 font-bold">Instantly Active</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => {
            window.location.href = "/dashboard";
          }}
          className="w-full flex items-center justify-center gap-2 bg-[#B4136D] hover:bg-[#930f58] text-white font-bold text-xs sm:text-sm py-4 rounded-xl shadow-lg shadow-[#B4136D]/20 transition-all duration-200 active:scale-98 cursor-pointer"
        >
          <span>View in Collector Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <Link
          href="/artworks"
          className="w-full text-stone-500 hover:text-stone-800 font-bold text-xs py-2 transition cursor-pointer"
        >
          Explore More Salons
        </Link>
      </div>
    </motion.div>
  );
};

export default function PaymentSuccessPage() {
  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] text-stone-900 antialiased flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-[#B4136D] animate-spin mb-4" />
            <p className="text-stone-500 font-medium text-sm animate-pulse">Loading transaction certificate...</p>
          </div>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
