"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { getInitials, isRemote } from "@/lib/avatar";
import { LayoutGrid, ShoppingBag, DollarSign, Sparkles, TrendingUp, Palette } from "lucide-react";
import { motion } from "framer-motion";
import { DashboardSkeleton } from "@/Components/Skeleton";
import { purchaseHistory } from "@/lib/data";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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

const ArtistDashboardpage = () => {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [stats, setStats] = useState({
    total: 0,
    sold: 0,
    available: 0,
    ready: false,
  });
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    if (!user?.id) return;

    let isCancelled = false;

    const loadStats = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/artworks?artistId=${encodeURIComponent(user.id)}`,
        );
        const data = await res.json();
        const artworks = Array.isArray(data) ? data : data.artworks || [];

        const total = artworks.length;
        const sold = artworks.filter(
          (art) => art.isSold || art.status?.toLowerCase() === "sold",
        ).length;
        const available = Math.max(0, total - sold);

        // Revenue calculation
        const sales = await purchaseHistory(undefined, user.id);
        const salesData = Array.isArray(sales) ? sales : [];
        const totalRevenue = salesData.reduce(
          (sum, item) => sum + (item.price || 0),
          0,
        );

        if (!isCancelled) {
          setStats({ total, sold, available, ready: true });
          setRevenue(totalRevenue);
        }
      } catch (error) {
        console.error("Failed to load artist stats:", error);
        if (!isCancelled) {
          setStats({ total: 0, sold: 0, available: 0, ready: true });
        }
      }
    };

    loadStats();
    return () => {
      isCancelled = true;
    };
  }, [user?.id]);

  const dashboardData = {
    artistName: user?.name || "Artist",
    subtitle: user
      ? `Welcome back to your studio, ${
          user.name.split(" ")[0] || "Artist"
        }. Manage your gallery exhibitions and track collector acquisitions.`
      : "Where fine vision meets execution. Manage your portfolio and track collector sales.",
    profileImg: user?.image || null,
    stats: [
      {
        id: 1,
        label: "LIFETIME REPOSITORY",
        title: "Cataloged Artworks",
        value: stats.total,
        icon: <LayoutGrid className="w-5 h-5 text-[#B4136D]" />,
        iconBg: "bg-[#B4136D]/10",
        barColor: "bg-[#B4136D]",
        progress: stats.ready ? 100 : 0,
      },
      {
        id: 2,
        label: "AVAILABLE IN GALLERY",
        title: "Active Curations",
        value: stats.available,
        icon: <ShoppingBag className="w-5 h-5 text-amber-600" />,
        iconBg: "bg-amber-50",
        barColor: "bg-amber-600",
        progress:
          stats.ready && stats.total > 0
            ? Math.round((stats.available / stats.total) * 100)
            : 0,
      },
      {
        id: 3,
        label: "LIFETIME ACQUISITIONS",
        title: "Total Revenue Generated",
        value: `$${revenue.toLocaleString()}`,
        icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
        iconBg: "bg-emerald-50",
        barColor: "bg-emerald-600",
        progress: 100,
      },
    ],
  };

  if (isPending || !stats.ready) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-6xl mx-auto selection:bg-[#B4136D]/15 selection:text-[#B4136D]"
    >
      {/* --- Studio Header Banner --- */}
      <motion.div
        variants={itemVariants}
        className="bg-white border border-stone-200/90 rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-2xs flex flex-col md:flex-row items-center gap-6 text-center md:text-left justify-between"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="p-1 rounded-2xl border-2 border-[#B4136D]/20 shadow-xs bg-[#FAF8F5] shrink-0">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-stone-100">
              {dashboardData.profileImg ? (
                <Image
                  src={dashboardData.profileImg}
                  alt={dashboardData.artistName}
                  fill
                  sizes="96px"
                  unoptimized={isRemote(dashboardData.profileImg)}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#B4136D] text-white font-serif text-3xl font-bold select-none">
                  {getInitials(dashboardData.artistName)}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#B4136D]/10 border border-[#B4136D]/20 text-[#B4136D] text-[10px] font-bold uppercase tracking-widest mb-1">
              <Sparkles size={11} />
              <span>Studio Workspace</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
              Welcome Back, {dashboardData.artistName}!
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-normal">
              {dashboardData.subtitle}
            </p>
          </div>
        </div>

        <div className="hidden lg:flex flex-col items-end gap-1 shrink-0 px-6 py-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Creator Status
          </span>
          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Exhibition Portal
          </span>
        </div>
      </motion.div>

      {/* --- Performance Metric Cards --- */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {dashboardData.stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white p-6 rounded-[2rem] border border-stone-200/90 shadow-2xs flex flex-col justify-between min-h-[190px] transition-all hover:shadow-md hover:border-stone-300"
          >
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl ${stat.iconBg}`}>
                {stat.icon}
              </div>

              <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase">
                {stat.label}
              </span>
            </div>

            <div className="mt-4 space-y-1">
              <span className="font-serif text-3xl font-bold text-stone-900 tracking-tight">
                {stat.value}
              </span>
              <p className="text-xs text-stone-500 font-medium">
                {stat.title}
              </p>
            </div>

            <div className="mt-4 w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
              <div
                className={`${stat.barColor} h-full rounded-full transition-all duration-700`}
                style={{ width: `${stat.progress}%` }}
              />
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ArtistDashboardpage;