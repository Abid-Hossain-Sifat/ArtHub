"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, ArrowRight, ChevronLeft, ChevronRight, Calendar, Sparkles } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getUserComments } from "@/lib/data";

const UserDashboardCommentPage = () => {
  const { data: session } = useSession();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComments = async () => {
      if (!session?.user?.id) return;

      try {
        const data = await getUserComments(session.user.id);
        setComments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load comments:", error);
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [session]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComments = comments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(comments.length / itemsPerPage));

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 bg-[#FAF8F5] min-h-screen font-sans text-stone-900 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B4136D]/10 text-[#B4136D] text-xs font-semibold uppercase tracking-wider mb-2">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Curator Guestbook</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium tracking-tight text-stone-900">
          My Comments & Reviews
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm">
          Review your curatorial feedback, appreciation notes, and public impressions across the exhibition salon.
        </p>
      </div>

      {/* Comments List */}
      <div className="grid grid-cols-1 gap-5">
        {loading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-white rounded-[2rem] p-6 border border-stone-200/90 shadow-2xs flex gap-6 items-center animate-pulse">
              <div className="w-20 h-20 rounded-2xl bg-stone-200 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-stone-200 rounded w-48" />
                <div className="h-4 bg-stone-200 rounded w-full max-w-md" />
                <div className="h-4 bg-stone-200 rounded w-28" />
              </div>
            </div>
          ))
        ) : currentComments.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center border border-stone-200/90 shadow-2xs space-y-3">
            <MessageSquare className="w-12 h-12 mx-auto text-stone-300" />
            <h3 className="font-serif text-xl font-bold text-stone-800">No Guestbook Notes Yet</h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
              Whenever you share impressions or critiques on exhibition pieces, your guestbook notes will be archived here.
            </p>
            <Link
              href="/artworks"
              className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-xl bg-[#B4136D] hover:bg-[#930f58] text-white text-xs font-bold transition-all shadow-md shadow-[#B4136D]/20 cursor-pointer"
            >
              <span>Explore Gallery Salons</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          currentComments.map((comment) => (
            <div
              key={comment._id}
              className="bg-white p-6 rounded-[2rem] border border-stone-200/90 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start"
            >
              {/* Artwork Preview Thumbnail */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 shadow-inner">
                {comment.artworkImage ? (
                  <Image
                    src={comment.artworkImage}
                    alt={comment.artworkTitle || "Artwork"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-stone-200 text-xs">🎨</div>
                )}
              </div>

              {/* Comment Content */}
              <div className="flex flex-col w-full min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 truncate">
                    {comment.artworkTitle || "Curated Artwork"}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-stone-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-stone-50/70 rounded-xl border border-stone-200/70 text-stone-700 text-xs sm:text-sm leading-relaxed my-2 italic">
                  "{comment.comment}"
                </div>

                <div className="pt-1">
                  <Link
                    href={`/artworks/${comment.artworkId}`}
                    className="inline-flex items-center gap-1.5 text-[#B4136D] hover:text-[#930f58] text-xs font-bold group cursor-pointer"
                  >
                    <span>View Artwork</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="p-2.5 bg-white rounded-xl shadow-2xs border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs font-semibold text-stone-600 px-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="p-2.5 bg-white rounded-xl shadow-2xs border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDashboardCommentPage;
