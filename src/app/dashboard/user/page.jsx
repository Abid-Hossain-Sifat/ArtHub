"use client";

import React from 'react';
import { useSession } from "@/lib/auth-client";
import { Sparkles, Heart, CreditCard, Compass, Clock, Star } from 'lucide-react';
import Link from 'next/link';

const UserDashboardPage = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const stats = [
    { name: 'Collected Artworks', value: '12', icon: <Compass className="w-6 h-6 text-purple-600" />, desc: 'Owned digital assets' },
    { name: 'Favorite Artists', value: '5', icon: <Heart className="w-6 h-6 text-pink-600" />, desc: 'Creators you follow' },
    { name: 'Total Invested', value: '$1,420.00', icon: <CreditCard className="w-6 h-6 text-emerald-600" />, desc: 'Lifetime transactions' }
  ];

  const recentActivities = [
    { id: 1, type: 'purchase', title: 'Purchased "Ethereal Whispers"', artist: 'Elena Rostova', date: '2 days ago', price: '$450.00' },
    { id: 2, type: 'like', title: 'Favorited "Midnight Neon"', artist: 'Marcus Chen', date: '3 days ago', price: null },
    { id: 3, type: 'purchase', title: 'Purchased "Abstract Genesis"', artist: 'Sarah Jenkins', date: '1 week ago', price: '$970.00' },
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Welcome Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] rounded-3xl p-8 text-white shadow-xl shadow-purple-500/10">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Collector Hub
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            Welcome back, {user?.name || "Art Enthusiast"}!
          </h1>
          <p className="text-white/80 font-medium leading-relaxed max-w-lg text-[15px]">
            Discover new creators, manage your premium art collection, and trace your transaction histories with ease.
          </p>
        </div>
        {/* Background decorative circles */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-48 h-48 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute left-1/2 bottom-0 w-64 h-64 rounded-full bg-white/5 blur-3xl"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-slate-500">{stat.name}</span>
              <div className="p-3 bg-slate-50 rounded-xl">
                {stat.icon}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
              <p className="text-xs text-slate-400 font-medium">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Purchases & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Activity List */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#7C3AED]" />
              <h2 className="text-lg font-bold text-slate-900">Recent Collection Activity</h2>
            </div>
            <span className="text-xs font-semibold text-[#7C3AED] hover:underline cursor-pointer">View All</span>
          </div>

          <div className="space-y-4 flex-1">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-lg ${act.type === 'purchase' ? 'bg-emerald-50 text-emerald-600' : 'bg-pink-50 text-pink-600'}`}>
                    {act.type === 'purchase' ? <Star className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{act.title}</h4>
                    <p className="text-xs text-slate-400 font-medium">by {act.artist} • {act.date}</p>
                  </div>
                </div>
                {act.price && (
                  <span className="text-sm font-extrabold text-slate-900">{act.price}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Explore Card banner */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-6 shadow-sm text-white flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4 relative z-10">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl w-fit">
              <Compass className="w-6 h-6 text-purple-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight">Explore Artworks</h3>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                Unlock hundreds of new original creations uploaded daily by top digital artists worldwide.
              </p>
            </div>
          </div>

          <Link href="/artworks" className="mt-8 relative z-10">
            <button className="w-full py-3 bg-white text-slate-950 font-bold text-xs rounded-xl shadow-lg hover:bg-slate-100 transition-colors">
              Browse Gallery
            </button>
          </Link>

          {/* Decorative background shapes */}
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboardPage;
