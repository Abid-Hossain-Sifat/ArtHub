"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Palette, ListTodo, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import UserDash from "../../../../public/Assets/UserDash.png";
import { authClient } from "@/lib/auth-client";
import { userDetails, purchaseHistory } from "@/lib/data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const UserDashboardSkeleton = () => {
  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto select-none animate-pulse">
      {/* Banner Skeleton */}
      <div className="bg-white border border-stone-200/80 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs min-h-[240px]">
        <div className="space-y-4 w-full md:max-w-xl">
          <div className="h-5 bg-stone-200/80 rounded-full w-36" />
          <div className="h-8 bg-stone-200/80 rounded-xl w-3/4" />
          <div className="h-4 bg-stone-200/70 rounded-md w-full max-w-md" />
          <div className="h-11 bg-stone-200/80 rounded-full w-40 mt-3" />
        </div>
        <div className="w-44 h-44 rounded-[2rem] bg-stone-200/70" />
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-[2rem] border border-stone-200/80 shadow-2xs space-y-5 min-h-[160px]"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 bg-stone-200/80 rounded-2xl" />
              <div className="w-20 h-5 bg-stone-200/70 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="h-3.5 bg-stone-200/70 rounded-md w-1/2" />
              <div className="h-7 bg-stone-200/80 rounded-lg w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UserDashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const session = await authClient.getSession();
        const users = await userDetails();

        const email = session?.user?.email || session?.data?.user?.email;
        const currentUser = users.find((u) => u.email === email);

        setUser(currentUser);

        if (!currentUser) {
          setIsLoading(false);
          return;
        }

        const history = await purchaseHistory(currentUser._id);
        setPurchases(history || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <UserDashboardSkeleton />;
  }

  const plan = user?.subscription?.plan;
  const limit = user?.subscription?.purchaseLimit;
  const purchased = user?.subscription?.purchasedThisMonth;
  const progress = limit === -1 ? 0 : Math.min(100, (purchased / limit) * 100);

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto selection:bg-[#B4136D]/15 selection:text-[#B4136D]">
      {/* WELCOME BANNER BOX */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white rounded-[2.5rem] p-6 sm:p-8 md:p-10 border border-stone-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden"
      >
        {/* Left Side Content */}
        <div className="space-y-3.5 md:max-w-xl text-center md:text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#B4136D]/10 border border-[#B4136D]/20 text-[#B4136D] text-[10px] font-bold uppercase tracking-widest">
            <Sparkles size={11} />
            <span>Collector Sanctuary</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
            Welcome back, {user?.name || "Collector"}!
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm md:text-base leading-relaxed max-w-md font-normal">
            Your personal fine-art collection is preserved here. Explore new premier drops from the world's leading creators.
          </p>

          {/* Action Links */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
            <Link href="/dashboard/user/bought-artworks">
              <button className="inline-flex items-center gap-2 bg-[#B4136D] hover:bg-[#930f58] text-white font-bold px-6 py-3 rounded-full text-xs transition-all shadow-md shadow-[#B4136D]/20 cursor-pointer">
                <span>View Acquired Works</span>
                <ArrowRight size={13} />
              </button>
            </Link>

            <Link href="/artworks">
              <button className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200/80 text-stone-700 font-semibold px-5 py-3 rounded-full text-xs transition-colors cursor-pointer border border-stone-200/80">
                <span>Browse Gallery</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Right Side Illustration */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 z-10 flex items-center justify-center shrink-0">
          <motion.div
            className="w-full h-full rounded-[2rem] overflow-hidden shadow-md border-4 border-white bg-stone-100"
            initial={{ rotate: 4 }}
            whileHover={{ rotate: 0, scale: 1.03 }}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
          >
            <Image
              src={UserDash}
              alt="User Dashboard Illustration"
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* 3 STATS CARDS SECTION */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {/* Card 1: Purchased Artworks */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-[2rem] border border-stone-200/90 shadow-2xs flex flex-col justify-between min-h-[160px] hover:shadow-md transition-all hover:border-stone-300"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 bg-[#B4136D]/10 rounded-2xl text-[#B4136D]">
              <Palette className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Permanent Vault
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Acquired Artworks
            </p>
            <h3 className="font-serif text-3xl font-bold text-stone-900 mt-0.5 tracking-tight">
              {purchases.length}
            </h3>
          </div>
        </motion.div>

        {/* Card 2: Remaining Limit */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-[2rem] border border-stone-200/90 shadow-2xs flex flex-col justify-between min-h-[160px] hover:shadow-md transition-all hover:border-stone-300"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
              <ListTodo className="w-5 h-5" />
            </div>
            {/* Progress Bar */}
            <div className="w-24 bg-stone-100 h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-amber-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Monthly Acquisition Quota
            </p>
            <h3 className="font-serif text-3xl font-bold text-stone-900 mt-0.5 tracking-tight">
              {purchased || 0} / {limit === -1 ? "∞" : limit || "10"}
            </h3>
          </div>
        </motion.div>

        {/* Card 3: Current Membership Plan */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-[2rem] border border-stone-200/90 shadow-2xs flex flex-col justify-between min-h-[160px] hover:shadow-md transition-all hover:border-stone-300"
        >
          <div className="flex items-start justify-between">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {plan || "Free"} Patron
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Membership Tier
            </p>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-0.5 tracking-tight">
              {plan === "free"
                ? "Collector Free"
                : plan === "pro"
                ? "Patron Pro"
                : "Curator Guild"}
            </h3>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UserDashboardPage;
