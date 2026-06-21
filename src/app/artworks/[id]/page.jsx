import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShoppingCart, Edit3, Trash2, MessageSquare, AlertCircle, Calendar } from 'lucide-react';
import { headers } from 'next/headers';
import { artworkCollection } from '../../../lib/data';

const ArtWorkDetailsPage = async ({ params }) => {
  const { id } = await params;
  const artworks = await artworkCollection();
  const artwork = artworks.find(art => (art._id === id || encodeURIComponent(art.title) === id));

  if (!artwork) {
    notFound();
  }

  // Get active session from backend
  const reqHeaders = await headers();
  const sessionRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}`, {
    headers: reqHeaders,
    cache: 'no-store'
  });
  
  const sessionData = sessionRes.ok ? await sessionRes.json() : null;
  
  const user = {
    isLoggedIn: !!sessionData?.user,
    id: sessionData?.user?.id || null,
    role: sessionData?.user?.role || 'user'
  };

  const isArtistOwner = user.isLoggedIn && user.id === artwork.artistId;
  const isPurchaseDisabled = isArtistOwner;

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] text-slate-900 antialiased selection:bg-violet-100 selection:text-violet-900">
      <div className="w-full max-w-[90%] md:max-w-[85%] lg:max-w-[80%] mx-auto py-12 md:py-20">
        
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-8">
          <Link href="/artworks" className="hover:text-slate-600 cursor-pointer">Artworks</Link>
          <span>/</span>
          <span className="hover:text-slate-600 cursor-pointer">{artwork.category}</span>
          <span>/</span>
          <span className="text-violet-600 font-semibold line-clamp-1">{artwork.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
          
          <div className="lg:col-span-6 w-full">
            <div className="relative aspect-square w-full rounded-[32px] bg-white border border-slate-100 p-3 shadow-[0_8px_30px_rgb(0,0,0,0.02)] group overflow-hidden">
              <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-slate-50 shadow-inner">
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-full object-cover transition-transform duration-750 ease-out group-hover:scale-[1.02]"
                />
                {artwork.category && (
                  <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg border border-white/10 shadow-sm">
                    {artwork.category}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 w-full flex flex-col justify-between h-full">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-[#0f172a] tracking-tight leading-tight mb-4">
                {artwork.title}
              </h1>

              <div className="flex items-center bg-white px-4 py-3 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] max-w-fit mb-4 border border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md shadow-violet-200">
                    {(artwork.artistName || "U").charAt(0)}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Artist</p>
                    <Link href={`/artist/${artwork.artistId || 'unknown'}`} className="text-sm font-extrabold text-slate-800 hover:text-violet-600 transition-colors flex items-center gap-1.5 group">
                      <span>{artwork.artistName || "Unknown Artist"}</span>
                      <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-all duration-200">🔗</span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-5 pl-1">
                <Calendar size={14} className="text-slate-400" />
                <span>Uploaded: <span className="text-slate-600">{artwork.createdAt || "Recently"}</span></span>
              </div>

              <div className="bg-violet-50/30 border border-violet-100/80 rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(139,92,246,0.03)] mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-violet-600 mb-2.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-violet-500 rounded-full"></span>
                  The Story Behind The Piece
                </h3>
                <p className="text-slate-600 text-[14px] md:text-[15px] leading-relaxed font-medium">
                  {artwork.description || "No description provided for this artwork."}
                </p>
              </div>
            </div>

            <div className="mt-auto">
              <div className="bg-white border border-slate-200/60 rounded-[28px] p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)] mb-4">
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Current Price</p>
                  <span className="text-3xl font-black text-violet-600 tracking-tight">
                    ${artwork.price?.toLocaleString() || "0"}
                  </span>
                </div>

                {isPurchaseDisabled ? (
                  <div className="space-y-3">
                    <button 
                      disabled
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-100 text-slate-400 font-bold text-sm cursor-not-allowed border border-slate-200/50"
                    >
                      <ShoppingCart size={18} />
                      <span>Purchase Artwork</span>
                    </button>
                    <div className="flex items-center gap-1.5 bg-amber-50/70 border border-amber-200/50 text-amber-700 px-3 py-2 rounded-lg text-xs font-semibold">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>Artists are not allowed to buy their own masterpieces.</span>
                    </div>
                  </div>
                ) : (
                  <button 
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm transition-all duration-150 shadow-md shadow-purple-500/10 active:scale-[0.99] cursor-pointer"
                  >
                    <ShoppingCart size={18} />
                    <span>Purchase Artwork</span>
                  </button>
                )}
              </div>

              {isArtistOwner && (
                <div className="bg-violet-50/40 border border-violet-100 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-inner">
                  <div className="flex items-center gap-2 text-xs font-bold text-violet-800">
                    <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
                    <span>You own this artwork</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/artworks/${id}/edit`} className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-violet-600 transition shadow-sm cursor-pointer">
                      <Edit3 size={13} />
                      <span>Edit</span>
                    </Link>
                    <button 
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-red-600 bg-white border border-red-100 rounded-xl hover:bg-red-50 transition shadow-sm cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-slate-200/60 max-w-3xl">
          <h2 className="text-xl font-extrabold text-[#0f172a] tracking-tight mb-6 flex items-center gap-2">
            <MessageSquare size={20} className="text-violet-600" />
            <span>Discussion & Reviews</span>
          </h2>

          {!user.isLoggedIn ? (
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-center text-sm font-semibold text-slate-500 mb-6">
              🔒 Please <span className="text-violet-600 hover:underline cursor-pointer">Login</span> to unlock purchasing options and leave comments.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0 shadow-sm">
                  U
                </div>
                <div className="w-full">
                  <textarea 
                    rows={3}
                    placeholder="Share your thoughts about this masterpiece..." 
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-medium outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-50 transition"
                  ></textarea>
                  <button className="mt-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition shadow-sm cursor-pointer">
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ArtWorkDetailsPage;