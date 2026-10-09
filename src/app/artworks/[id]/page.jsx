"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Edit3,
  Trash2,
  MessageSquare,
  AlertCircle,
  Calendar,
  X,
  Mail,
  Palette,
  Award,
  ArrowLeft,
  ExternalLink,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Lock,
  Truck,
  FileCheck,
  ArrowRight,
  Share2,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import {
  artworkCollection,
  getArtworkComments,
  addComment,
  updateArtwork,
  deleteArtwork,
} from "../../../lib/data";
import { DetailsSkeleton } from "@/Components/Skeleton";
import Image from "next/image";
import toast from "react-hot-toast";

const ArtWorkDetailsPage = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const [artwork, setArtwork] = useState(null);
  const [relatedArtworks, setRelatedArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showArtistModal, setShowArtistModal] = useState(false);
  const [artistStats, setArtistStats] = useState(null);
  const [loadingArtistStats, setLoadingArtistStats] = useState(false);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    price: "",
  });

  const handleOpenArtistModal = (e) => {
    e.preventDefault();
    if (!artwork?.artistId) {
      toast.error("Artist profile details not currently cataloged");
      return;
    }
    setShowArtistModal(true);
  };

  useEffect(() => {
    if (!id) return;
    let isCancelled = false;

    const fetchArtwork = async () => {
      try {
        setLoading(true);
        const artworks = await artworkCollection();
        const found = artworks.find(
          (art) => art._id === id || encodeURIComponent(art.title) === id,
        );
        if (!isCancelled) {
          if (found) {
            setArtwork(found);
            // Curate related artworks (same category or others, up to 4 items)
            const related = artworks
              .filter(
                (art) =>
                  art._id !== found._id &&
                  (art.category === found.category || !found.category),
              )
              .slice(0, 4);
            setRelatedArtworks(
              related.length > 0
                ? related
                : artworks.filter((a) => a._id !== found._id).slice(0, 4),
            );
          } else {
            setError(true);
          }
        }
      } catch (err) {
        console.error("Failed to load artwork detail:", err);
        if (!isCancelled) {
          setError(true);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchArtwork();
    return () => {
      isCancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!artwork?.artistId) return;

    const fetchArtistStats = async () => {
      try {
        setLoadingArtistStats(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/artist/${artwork.artistId}/stats`,
        );
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setArtistStats(data.artist);
          }
        }
      } catch (err) {
        console.error("Failed to load artist details:", err);
      } finally {
        setLoadingArtistStats(false);
      }
    };

    fetchArtistStats();
  }, [artwork]);

  useEffect(() => {
    if (!id) return;

    const loadComments = async () => {
      try {
        const data = await getArtworkComments(id);
        setComments(data || []);
      } catch (error) {
        console.error(error);
      }
    };

    loadComments();
  }, [id]);

  if (loading || sessionLoading) {
    return <DetailsSkeleton />;
  }

  if (error || !artwork) {
    notFound();
  }

  const user = {
    isLoggedIn: !!session?.user,
    id: session?.user?.id || null,
    role: session?.user?.role || "user",
  };

  const isArtistOwner = user.isLoggedIn && user.id === artwork.artistId;
  const isArtist = user.role === "artist";
  const isSold = artwork?.isSold;
  const isAvailable = artwork?.status?.toLowerCase() === "available";
  const isPurchaseDisabled = isArtistOwner || isArtist || isSold;

  const handleComment = async () => {
    if (!session?.user) {
      toast.error("Please sign in first to leave a comment");
      return;
    }

    if (session.user.role !== "user") {
      toast.error("Only users can comment");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      setPostingComment(true);

      const res = await addComment({
        artworkId: artwork._id,
        userId: session.user.id,
        userName: session.user.name,
        userImage: session.user.image,
        comment,
      });

      if (!res.success) {
        throw new Error(res.error || "Failed to post comment");
      }

      setComments((prev) => [res.comment, ...prev]);
      setComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPostingComment(false);
    }
  };

  const openEditModal = () => {
    setEditForm({
      title: artwork.title,
      description: artwork.description,
      price: artwork.price,
    });
    setShowEditModal(true);
  };

  const handleUpdateArtwork = async () => {
    if (
      !editForm.title.trim() ||
      !editForm.description.trim() ||
      !editForm.price
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      setSaving(true);
      const res = await updateArtwork(artwork._id, {
        title: editForm.title,
        description: editForm.description,
        price: Number(editForm.price),
      });

      if (!res.success) {
        throw new Error("Failed to update artwork");
      }

      setArtwork((prev) => ({
        ...prev,
        title: editForm.title,
        description: editForm.description,
        price: Number(editForm.price),
      }));

      toast.success("Artwork updated successfully");
      setShowEditModal(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteArtwork = async () => {
    try {
      setDeleting(true);
      const res = await deleteArtwork(artwork._id);

      if (!res.success) {
        throw new Error("Failed to delete artwork");
      }

      toast.success("Artwork deleted successfully");
      router.push("/artworks");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handlePurchase = async () => {
    try {
      if (!session?.user) {
        toast.error("Please sign in to proceed with purchase");
        router.push(
          `/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`,
        );
        return;
      }

      setPurchasing(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/create-checkout/artwork/${artwork._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            buyerId: session.user.id,
            buyerName: session.user.name,
            buyerEmail: session.user.email,
            buyerImage: session.user.image || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Purchase failed");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Stripe checkout gateway link unavailable");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setPurchasing(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: artwork.title,
          text: `Explore "${artwork.title}" by ${artwork.artistName} on ArtHub`,
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Exhibition link copied to clipboard");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] text-stone-900 antialiased selection:bg-[#B4136D]/15 selection:text-[#B4136D]">
      <div className="w-full max-w-[90%] md:max-w-[85%] lg:max-w-[80%] mx-auto py-10 sm:py-16">
        {/* Navigation Breadcrumb Bar */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between gap-4 mb-8"
        >
          <Link
            href="/artworks"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:text-[#B4136D] hover:border-[#B4136D]/30 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Back to Collection</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              aria-label="Share this artwork"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:border-stone-300 shadow-2xs transition-all cursor-pointer"
            >
              <Share2 size={13} />
              <span className="hidden sm:inline">Share</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-stone-400">
              <Link href="/" className="hover:text-stone-700 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/artworks"
                className="hover:text-stone-700 transition-colors"
              >
                Artworks
              </Link>
              <span>/</span>
              <span className="text-stone-700 font-semibold max-w-[180px] truncate">
                {artwork.title}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Exhibition Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Museum Display Frame */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 w-full space-y-5"
          >
            <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-[2.5rem] bg-white border border-stone-200/90 p-3.5 sm:p-4 shadow-sm group overflow-hidden">
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-stone-100 shadow-inner">
                <Image
                  src={artwork.image}
                  alt={
                    artwork.title
                      ? `${artwork.title} - Artwork by ${
                          artwork.artistName || "Artist"
                        }`
                      : "Artwork image"
                  }
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  priority
                />

                {/* Floating Museum Badges */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between gap-2 pointer-events-none">
                  {artwork.category && (
                    <span className="bg-stone-900/85 backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg border border-white/10 shadow-sm">
                      {artwork.category}
                    </span>
                  )}

                  {artwork.status && (
                    <span
                      className={`text-[9px] font-extrabold tracking-widest uppercase px-3 py-1.5 rounded-lg shadow-sm border ${
                        isAvailable
                          ? "bg-emerald-500/90 backdrop-blur-sm text-white border-emerald-400/60"
                          : "bg-stone-900/85 backdrop-blur-sm text-stone-200 border-stone-700/60"
                      }`}
                    >
                      {artwork.status}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Museum Provenance Credentials */}
            <div className="bg-white border border-stone-200/90 rounded-[2rem] p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                  <FileCheck size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-800">
                    Certificate Included
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                    Signed provenance document with encrypted identity seal.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-800">
                    Authenticity Assured
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                    Verified original directly from creator workshop.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 shrink-0">
                  <Truck size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-800">
                    White-Glove Logistics
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                    Fully insured global shipping & fine-art packaging.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Curation Dossier & Acquisition Panel */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.65,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="lg:col-span-5 w-full flex flex-col justify-between space-y-6"
          >
            <div>
              {/* Category & Date Eyebrow */}
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B4136D] mb-2">
                <Sparkles size={13} />
                <span>{artwork.category || "Fine Art Collection"}</span>
                <span className="text-stone-300">•</span>
                <span className="text-stone-400 font-medium">
                  {artwork.createdAt || "Archived"}
                </span>
              </div>

              {/* Masterpiece Title */}
              <h1 className="font-serif text-3xl sm:text-4xl md:text-[44px] font-bold text-stone-900 tracking-tight leading-[1.15] mb-5">
                {artwork.title || "Untitled Masterpiece"}
              </h1>

              {/* Artist Plaque */}
              <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200/90 shadow-2xs mb-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center relative shrink-0">
                    {artistStats?.image || artwork.artistImage ? (
                      <Image
                        src={artistStats?.image || artwork.artistImage}
                        alt={artwork.artistName || "Artist"}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#B4136D] flex items-center justify-center text-white font-bold text-lg font-serif">
                        {(artwork.artistName || "A").charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Curated Creator
                    </span>
                    <h3 className="font-serif font-bold text-stone-900 text-base">
                      {artwork.artistName || "Independent Artist"}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={handleOpenArtistModal}
                  aria-label="View artist profile and statistics"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-700 transition cursor-pointer"
                >
                  <span>Dossier</span>
                  <ExternalLink size={12} className="text-stone-400" />
                </button>
              </div>

              {/* Curatorial Statement & Story */}
              <div className="bg-white border border-stone-200/90 rounded-[2rem] p-6 shadow-2xs mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#B4136D] mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-[#B4136D] rounded-full" />
                  Curatorial Statement
                </h3>
                <p className="text-stone-700 text-sm sm:text-[15px] leading-relaxed font-normal">
                  {artwork.description ||
                    "This work represents a key exploration of form, light, and aesthetic discipline within the artist's body of work, preserved for the ArtHub permanent archive."}
                </p>
              </div>
            </div>

            {/* Acquisition Card */}
            <div>
              <div className="bg-white border border-stone-200/90 rounded-[2rem] p-6 sm:p-7 shadow-xs">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-stone-400 block mb-1">
                      Acquisition Value
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
                        ${artwork.price?.toLocaleString() || "0"}
                      </span>
                      <span className="text-xs font-bold text-stone-400 uppercase">
                        USD
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    Available to Acquire
                  </span>
                </div>

                {isSold ? (
                  <div className="space-y-3">
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-stone-100 text-stone-400 font-bold text-sm cursor-not-allowed border border-stone-200"
                    >
                      <Lock size={16} />
                      <span>Already Sold</span>
                    </button>
                    {artwork.purchasedBy && (
                      <p className="text-center text-xs text-stone-500">
                        Acquired by {artwork.purchasedBy}
                      </p>
                    )}
                  </div>
                ) : isArtistOwner || isArtist ? (
                  <div className="space-y-3">
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-stone-100 text-stone-400 font-bold text-sm cursor-not-allowed border border-stone-200"
                    >
                      <ShoppingCart size={16} />
                      <span>Acquisition Ineligible</span>
                    </button>
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-3.5 py-2.5 rounded-xl text-xs font-medium">
                      <AlertCircle
                        size={15}
                        className="shrink-0 text-amber-700"
                      />
                      <span>
                        {isArtistOwner
                          ? "You are cataloged as the primary creator of this work."
                          : "Artists are restricted from acquiring works through their creator portal."}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        if (!session?.user) {
                          router.push(
                            `/sign-in?redirect=${encodeURIComponent(
                              window.location.pathname,
                            )}`,
                          );
                          return;
                        }
                        handlePurchase();
                      }}
                      disabled={purchasing}
                      className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#B4136D] hover:bg-[#930f58] text-white font-bold text-sm transition-all duration-200 shadow-md shadow-[#B4136D]/20 active:scale-[0.99] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {purchasing ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Connecting to Stripe...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={18} />
                          <span>Purchase Artworks</span>
                        </>
                      )}
                    </button>

                    <p className="text-center text-[11px] text-stone-400 flex items-center justify-center gap-1.5">
                      <Lock size={12} />
                      <span>
                        Secure checkout via Stripe • Authenticity Guarantee • Fully insured
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Creator Management Strip */}
              {isArtistOwner && (
                <div className="bg-[#B4136D]/5 border border-[#B4136D]/20 rounded-2xl p-4 mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#B4136D]">
                    <span className="w-2 h-2 rounded-full bg-[#B4136D] animate-pulse" />
                    <span>Creator Controls Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={openEditModal}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 hover:border-stone-300 transition shadow-2xs cursor-pointer"
                    >
                      <Edit3 size={13} />
                      <span>Edit Dossier</span>
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-700 bg-white border border-rose-200 rounded-xl hover:bg-rose-50 transition shadow-2xs cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>De-list</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Related Curations Gallery */}
        {relatedArtworks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20 pt-12 border-t border-stone-200/90"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#B4136D] block mb-1">
                  From The Same Collection
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                  Related Masterpieces
                </h2>
              </div>
              <Link
                href="/artworks"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B4136D] hover:text-[#930f58] transition group"
              >
                <span>View Full Catalog</span>
                <ArrowRight
                  size={13}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedArtworks.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={`/artworks/${item._id}`}
                    className="group bg-white rounded-[2rem] p-3 border border-stone-200/90 shadow-2xs hover:shadow-lg hover:border-stone-300 transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-[4/5] rounded-[1.4rem] overflow-hidden bg-stone-100 mb-3">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </div>
                    <div className="px-2 pb-2">
                      <h3 className="font-serif font-bold text-stone-900 text-base line-clamp-1 group-hover:text-[#B4136D] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs italic text-stone-500 mt-0.5">
                        by {item.artistName}
                      </p>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-100">
                        <span className="font-serif font-bold text-sm text-stone-900">
                          ${item.price?.toLocaleString()}
                        </span>
                        <span className="text-[11px] font-semibold text-[#B4136D]">
                          Details ➔
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Collector Commentary & Guestbook */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 pt-12 border-t border-stone-200/90 max-w-3xl"
        >
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B4136D] block mb-1">
              Provenance & Dialog
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight flex items-center gap-2.5">
              <MessageSquare size={24} className="text-[#B4136D]" />
              <span>Collector Guestbook</span>
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              Leave your appreciation, provenance queries, or critical impressions.
            </p>
          </div>

          {!user.isLoggedIn ? (
            <div className="bg-white border border-stone-200/90 rounded-[2rem] p-6 text-center shadow-2xs mb-8">
              <p className="text-stone-600 text-sm font-medium mb-3">
                🔒 Sign in as an ArtHub collector to sign this masterpiece's guestbook.
              </p>
              <Link
                href={`/sign-in?redirect=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.pathname : "",
                )}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B4136D] hover:bg-[#930f58] text-white text-xs font-bold transition shadow-xs"
              >
                Sign In to Comment
              </Link>
            </div>
          ) : user.role === "artist" ? (
            <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-4 text-center text-xs font-semibold text-amber-800 mb-8">
              Creator accounts are excluded from collector guestbook submissions.
            </div>
          ) : (
            <div className="bg-white border border-stone-200/90 rounded-[2rem] p-5 shadow-2xs mb-8">
              <div className="flex gap-3.5">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-700 shrink-0">
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    session?.user?.name?.charAt(0).toUpperCase()
                  )}
                </div>

                <div className="w-full">
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your appreciation or thoughts about this masterpiece..."
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-3.5 text-sm font-medium outline-none focus:border-[#B4136D]/60 focus:bg-white focus:ring-3 focus:ring-[#B4136D]/10 transition resize-none placeholder:text-stone-400"
                  />

                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleComment}
                      disabled={postingComment}
                      className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#B4136D] hover:bg-[#930f58] rounded-xl transition shadow-xs cursor-pointer disabled:opacity-60"
                    >
                      {postingComment ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          <span>Posting...</span>
                        </>
                      ) : (
                        <span>Post Comment</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="text-center text-stone-400 text-sm py-10 border border-dashed border-stone-300 rounded-[2rem] bg-white">
                No collector impressions recorded yet. Be the first to leave a note.
              </div>
            ) : (
              comments.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.4 }}
                  className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-2xs"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-xs text-stone-700 shrink-0">
                      {item.userImage ? (
                        <Image
                          src={item.userImage}
                          alt={item.userName}
                          width={36}
                          height={36}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        item.userName?.charAt(0).toUpperCase()
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-serif font-bold text-stone-900 text-sm">
                          {item.userName}
                        </h4>

                        <span className="text-[11px] font-medium text-stone-400">
                          {new Date(item.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">
                        {item.comment}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-[2.5rem] bg-white shadow-2xl border border-stone-200 p-8 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-6">
              Edit Artwork Dossier
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 block">
                  Artwork Title
                </label>
                <input
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-[#B4136D]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 block">
                  Curatorial Statement
                </label>
                <textarea
                  rows={4}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none resize-none focus:border-[#B4136D]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 block">
                  Price (USD)
                </label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: e.target.value })
                  }
                  className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none focus:border-[#B4136D]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-5 py-2.5 rounded-full border border-stone-200 text-xs font-semibold hover:bg-stone-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateArtwork}
                disabled={saving}
                className="px-6 py-2.5 rounded-full bg-[#B4136D] hover:bg-[#930f58] text-white text-xs font-bold transition cursor-pointer disabled:opacity-60"
              >
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[2.5rem] bg-white shadow-2xl border border-stone-200 p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-4 text-rose-700">
              <Trash2 size={26} />
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">
              De-list Artwork?
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm leading-relaxed mb-6">
              This will permanently remove the piece from the ArtHub public registry. This action cannot be reversed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-full border border-stone-200 text-xs font-semibold hover:bg-stone-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteArtwork}
                disabled={deleting}
                className="flex-1 py-3 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition cursor-pointer disabled:opacity-60"
              >
                {deleting ? "De-listing..." : "De-list Artwork"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Artist Profile Dossier Modal */}
      <AnimatePresence>
        {showArtistModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-md rounded-[2.5rem] bg-white shadow-2xl border border-stone-200/90 p-7 relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowArtistModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>

              {loadingArtistStats ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-9 h-9 border-3 border-[#B4136D] border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                    Consulting Artist Archive...
                  </p>
                </div>
              ) : artistStats ? (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex flex-col items-center text-center mt-2">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 p-1 shadow-sm mb-4">
                      {artistStats.image ? (
                        <Image
                          src={artistStats.image}
                          alt={artistStats.name}
                          fill
                          className="object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#B4136D] text-white text-3xl font-bold font-serif rounded-xl">
                          {artistStats.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
                      {artistStats.name}
                    </h3>

                    <span className="inline-flex items-center gap-1 mt-1.5 px-3 py-0.5 text-[10px] font-bold rounded-full bg-[#B4136D]/10 text-[#B4136D] border border-[#B4136D]/20 uppercase tracking-wider">
                      Verified ArtHub Creator
                    </span>
                  </div>

                  {/* Details List */}
                  <div className="space-y-3 bg-[#FAF8F5] border border-stone-200/80 rounded-2xl p-4">
                    <div className="flex items-center gap-3 text-stone-600">
                      <Mail size={16} className="text-stone-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-0.5">
                          Studio Dispatch
                        </p>
                        <p className="text-xs font-semibold text-stone-700 truncate">
                          {artistStats.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-stone-600">
                      <Calendar size={16} className="text-stone-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-0.5">
                          Active Since
                        </p>
                        <p className="text-xs font-semibold text-stone-700">
                          {artistStats.createdAt
                            ? new Date(artistStats.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )
                            : "Creative Partner"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white border border-stone-200 rounded-2xl p-4 text-center shadow-2xs">
                      <Palette className="w-5 h-5 text-[#B4136D] mx-auto mb-1.5" />
                      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                        Total Artworks
                      </p>
                      <p className="font-serif text-2xl font-bold text-stone-900">
                        {artistStats.totalArtworks}
                      </p>
                    </div>

                    <div className="bg-white border border-stone-200 rounded-2xl p-4 text-center shadow-2xs">
                      <Award className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
                      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                        Acquired Works
                      </p>
                      <p className="font-serif text-2xl font-bold text-stone-900">
                        {artistStats.soldArtworks}
                      </p>
                    </div>
                  </div>

                  {/* Action Link */}
                  <button
                    onClick={() => {
                      sessionStorage.setItem("artistSearch", artistStats.name);
                      setShowArtistModal(false);
                      router.push("/artworks");
                    }}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#B4136D] hover:bg-[#930f58] text-white font-bold text-xs transition-all shadow-md shadow-[#B4136D]/15 cursor-pointer"
                  >
                    <span>Explore Artist's Catalog</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ) : (
                <div className="text-center py-6 text-stone-500 font-medium text-sm">
                  Failed to load artist dossier.
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArtWorkDetailsPage;