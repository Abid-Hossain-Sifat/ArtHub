"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DollarSign, ShoppingBag, Palette, BarChart3, Sparkles } from "lucide-react";
import {
  artworkCollection,
  getDailyTransactions,
  getTransactions,
} from "../../../lib/data";

import { DashboardSkeleton } from "../../../Components/Skeleton";

// Curated Fine Art Category Palette
const CATEGORY_COLORS = [
  "#B4136D", // Velvet Berry
  "#D97706", // Amber / Gold
  "#059669", // Emerald
  "#4F46E5", // Indigo
  "#E11D48", // Rose
  "#0D9488", // Teal
  "#7C3AED", // Violet
  "#EA580C", // Warm Orange
  "#2563EB", // Cobalt
  "#65A30D", // Lime
  "#9333EA", // Purple
  "#0284C7", // Sky
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { y: 16, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Stat Card Component
const StatCard = ({ Icon, label, value, badge, badgeColor }) => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-[2rem] border border-stone-200/90 p-5 sm:p-6 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-stone-300 transition-all min-h-[150px]"
    >
      <div className="flex justify-between items-center">
        <div className="w-10 h-10 rounded-2xl bg-[#B4136D]/10 flex items-center justify-center text-[#B4136D]">
          <Icon size={19} strokeWidth={2.2} />
        </div>
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60 uppercase tracking-wider">
          {badge}
        </span>
      </div>
      <div className="mt-3">
        <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-0.5">
          {label}
        </div>
        <div className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          {value}
        </div>
      </div>
    </motion.div>
  );
};

// ─── Custom Tooltip Component
const CustomTooltip = ({ active, payload, label, activeTab }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-stone-200 rounded-2xl p-3 shadow-lg text-xs">
        <div className="text-stone-400 font-medium mb-1">{label}</div>
        <div className="font-serif font-bold text-sm text-[#B4136D]">
          {activeTab === "artwork"
            ? `$${payload[0].value.toLocaleString()} Artwork Volume`
            : `$${payload[0].value.toLocaleString()} Patron Subscriptions`}
        </div>
      </div>
    );
  }
  return null;
};

// ─── Main Admin Dashboard Component
const AdminDashboardPage = () => {
  const [artworks, setArtworks] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [avgOrderValue, setAvgOrderValue] = useState(0);
  const [activeTab, setActiveTab] = useState("artwork");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artworkData, dailyTx, allTransactions] = await Promise.all([
          artworkCollection(),
          getDailyTransactions(),
          getTransactions(),
        ]);

        setArtworks(artworkData || []);
        setDailyData(dailyTx || []);

        // Revenue calculation
        const revenue = allTransactions.reduce((sum, tx) => {
          const amount = parseFloat(tx.amount.replace("$", "")) || 0;
          return sum + amount;
        }, 0);

        const orders = allTransactions.filter(
          (tx) => tx.type === "Purchase",
        ).length;

        setTotalRevenue(revenue);
        setTotalOrders(orders);
        setAvgOrderValue(orders > 0 ? revenue / orders : 0);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryCounts = artworks.reduce((acc, art) => {
    const cat = art.category || "Others";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const totalArtworks = artworks.length;

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto selection:bg-[#B4136D]/15 selection:text-[#B4136D]">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-2"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#B4136D]/10 border border-[#B4136D]/20 text-[#B4136D] text-[10px] font-bold uppercase tracking-widest mb-1.5">
          <Sparkles size={11} />
          <span>Executive Intelligence</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
          Platform Overview
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Real-time curatorial transactions, inventory distribution, and network metrics.
        </p>
      </motion.div>

      {/* Stats Cards Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          Icon={DollarSign}
          label="Total Gross Volume"
          value={`$${totalRevenue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          badge="Live"
        />
        <StatCard
          Icon={ShoppingBag}
          label="Collector Acquisitions"
          value={totalOrders.toLocaleString()}
          badge="Live"
        />
        <StatCard
          Icon={Palette}
          label="Permanent Catalog"
          value={totalArtworks}
          badge="Catalog"
        />
        <StatCard
          Icon={BarChart3}
          label="Average Acquisition"
          value={`$${avgOrderValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          badge="Est."
        />
      </motion.div>

      {/* Charts Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-5"
      >
        {/* Area Chart Component */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white rounded-[2rem] border border-stone-200/90 p-6 flex flex-col justify-between shadow-2xs"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Acquisition & Sales Volume
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Daily transaction progression across payment gateways
              </p>
            </div>
            <div className="flex gap-1 bg-[#FAF8F5] p-1 rounded-full border border-stone-200">
              {["artwork", "subscription"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs px-4 py-1.5 rounded-full cursor-pointer transition-all capitalize font-semibold ${
                    activeTab === tab
                      ? "bg-[#B4136D] text-white shadow-xs"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  {tab === "artwork" ? "Artworks" : "Patron Subscriptions"}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full h-[240px] pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dailyData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="artColorFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B4136D" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#B4136D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0,0,0,0.04)"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#888" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#888" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) =>
                    v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
                  }
                />
                <Tooltip content={<CustomTooltip activeTab={activeTab} />} />
                <Area
                  type="monotone"
                  dataKey={activeTab}
                  stroke="#B4136D"
                  strokeWidth={2.5}
                  fill="url(#artColorFill)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#B4136D", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Donut / Pie Chart Component */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-[2rem] border border-stone-200/90 p-6 flex flex-col justify-between shadow-2xs"
        >
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Inventory by Medium
            </h3>
            <p className="text-xs text-stone-400 mt-0.5 mb-2">
              Catalog distribution by curatorial category
            </p>
          </div>

          <div className="relative w-full flex justify-center py-2">
            {categoryData.length > 0 ? (
              <>
                <PieChart width={190} height={190}>
                  <Pie
                    data={categoryData}
                    cx={95}
                    cy={95}
                    innerRadius={62}
                    outerRadius={88}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {categoryData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <div className="font-serif text-2xl font-bold text-stone-900">
                    {totalArtworks >= 1000
                      ? `${(totalArtworks / 1000).toFixed(1)}k`
                      : totalArtworks}
                  </div>
                  <div className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                    TOTAL PIECES
                  </div>
                </div>
              </>
            ) : (
              <div className="h-[190px] flex items-center text-xs text-stone-400">
                No catalog items recorded
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-2 pt-3 border-t border-stone-100 max-h-28 overflow-y-auto">
            {categoryData.map((cat, i) => (
              <div key={cat.name} className="flex items-center gap-1.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    background: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                  }}
                />
                <span className="text-[11px] font-medium text-stone-600 truncate">
                  {cat.name} ({cat.value})
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminDashboardPage;
