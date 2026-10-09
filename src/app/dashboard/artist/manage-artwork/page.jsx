"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Pencil, Trash2, ChevronLeft, ChevronRight, X, Sparkles, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { TableSkeleton } from "@/Components/Skeleton";
import Image from "next/image";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const ArtistArtworkManage = () => {
  const { data: session, isPending } = useSession();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [deleteArtwork, setDeleteArtwork] = useState(null);
  const [formState, setFormState] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const ITEMS_PER_PAGE = 7;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchArtworks = async () => {
    if (!session?.user?.id) return;
    setLoading(true);

    try {
      const res = await fetch(
        `${backendUrl}/artworks?artistId=${encodeURIComponent(session.user.id)}`,
      );
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to load artworks");
        return;
      }

      setArtworks(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load your artworks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchArtworks();
    }
  }, [session?.user?.id]);

  const stats = useMemo(() => {
    const total = artworks.length;
    const sold = artworks.filter(
      (art) => art.isSold || art.status?.toLowerCase() === "sold",
    ).length;
    const available = total - sold;
    return { total, sold, available };
  }, [artworks]);

  const totalPages = Math.ceil(artworks.length / ITEMS_PER_PAGE);

  const paginatedArtworks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return artworks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [artworks, currentPage]);

  const openEditModal = (artwork) => {
    setSelectedArtwork(artwork);
    setFormState({
      title: artwork.title || "",
      category: artwork.category || "",
      description: artwork.description || "",
      price: artwork.price?.toString() || "",
    });
  };

  const closeEditModal = () => {
    setSelectedArtwork(null);
    setFormState({ title: "", category: "", description: "", price: "" });
  };

  const openDeleteModal = (artwork) => {
    setDeleteArtwork(artwork);
  };

  const closeDeleteModal = () => {
    setDeleteArtwork(null);
  };

  const handleFormChange = (key, value) => {
    if (key === "price") {
      const regex = /^[0-9]*\.?[0-9]{0,2}$/;
      if (value !== "" && !regex.test(value)) return;
    }
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!selectedArtwork) return;
    if (
      !formState.title.trim() ||
      !formState.category.trim() ||
      !formState.price.trim()
    ) {
      toast.error("Title, category, and price are required.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(
        `${backendUrl}/artworks/${selectedArtwork._id || selectedArtwork.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formState.title,
            category: formState.category,
            description: formState.description,
            price: parseFloat(formState.price),
          }),
        },
      );
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update artwork");
        return;
      }

      setArtworks((prev) =>
        prev.map((item) =>
          item._id === selectedArtwork._id || item.id === selectedArtwork.id
            ? { ...item, ...formState, price: parseFloat(formState.price) }
            : item,
        ),
      );

      toast.success("Artwork dossier updated");
      closeEditModal();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating artwork.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteArtwork) return;
    setDeleting(true);

    try {
      const res = await fetch(
        `${backendUrl}/artworks/${deleteArtwork._id || deleteArtwork.id}`,
        {
          method: "DELETE",
        },
      );
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to delete artwork");
        return;
      }

      const deleteId = deleteArtwork._id || deleteArtwork.id;
      const updatedArtworks = artworks.filter(
        (item) => (item._id || item.id) !== deleteId,
      );

      setArtworks(updatedArtworks);

      const newTotalPages = Math.ceil(updatedArtworks.length / ITEMS_PER_PAGE);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
      toast.success("Artwork withdrawn from gallery");
      closeDeleteModal();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting artwork.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto selection:bg-[#B4136D]/15 selection:text-[#B4136D] space-y-8">
      {/* Page Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#B4136D]/10 border border-[#B4136D]/20 text-[#B4136D] text-[10px] font-bold uppercase tracking-widest mb-1.5">
          <Sparkles size={11} />
          <span>Catalog Inventory</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-stone-900">
          Manage Your Masterpieces
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm mt-1">
          Curate, edit pricing, or de-list pieces in your active digital collection.
        </p>
      </div>

      {/* 3 Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-[2rem] border border-stone-200/90 shadow-2xs hover:shadow-md transition-all">
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            Total Cataloged
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-serif text-3xl font-bold text-stone-900">
              {stats.total}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-stone-200/90 shadow-2xs hover:shadow-md transition-all">
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            Available For Sale
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-serif text-3xl font-bold text-stone-900">
              {stats.available}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-stone-200/90 shadow-2xs hover:shadow-md transition-all">
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            Acquired & Sold
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-serif text-3xl font-bold text-stone-900">
              {stats.sold}
            </span>
          </div>
        </div>
      </div>

      {/* Artworks Table Card */}
      <div className="bg-white rounded-[2.5rem] border border-stone-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-stone-100 bg-[#FAF8F5] text-xs font-bold text-stone-400 uppercase tracking-wider">
                <th className="px-6 py-4">Masterpiece</th>
                <th className="px-6 py-4">Medium</th>
                <th className="px-6 py-4">Price (USD)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm font-medium text-stone-700">
              {loading ? (
                <TableSkeleton rows={4} />
              ) : artworks.length === 0 ? (
                <tr>
                  <td
                    className="px-6 py-12 text-center text-stone-400 font-normal"
                    colSpan={5}
                  >
                    You have not cataloged any artworks in your studio yet.
                  </td>
                </tr>
              ) : (
                paginatedArtworks.map((artwork) => {
                  const isItemSold =
                    artwork.isSold ||
                    artwork.status?.toLowerCase() === "sold";
                  const statusText = isItemSold
                    ? "Sold"
                    : artwork.status || "Available";

                  return (
                    <tr
                      key={artwork._id || artwork.id}
                      className="hover:bg-stone-50/70 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center overflow-hidden border border-stone-200 relative shadow-2xs">
                            {artwork.image ? (
                              <Image
                                src={artwork.image}
                                alt={artwork.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-lg">🎨</span>
                            )}
                          </div>
                          <span className="font-serif font-bold text-stone-900">
                            {artwork.title || "Untitled"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-stone-100 text-stone-700 border border-stone-200 capitalize">
                          {artwork.category || "General"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-stone-900 font-serif font-bold text-base">
                        $
                        {typeof artwork.price === "number"
                          ? artwork.price.toLocaleString()
                          : artwork.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                            isItemSold
                              ? "bg-stone-100 text-stone-500 border border-stone-200"
                              : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          } capitalize`}
                        >
                          {statusText}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(artwork)}
                            className="text-stone-500 hover:text-[#B4136D] p-2 rounded-xl hover:bg-[#B4136D]/10 transition-colors cursor-pointer"
                            title="Edit Masterpiece"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(artwork)}
                            className="text-stone-500 hover:text-rose-700 p-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                            title="De-list Masterpiece"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between bg-[#FAF8F5]">
          <p className="text-xs text-stone-500">
            Showing{" "}
            <span className="font-bold text-stone-800">
              {artworks.length === 0
                ? 0
                : (currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            -{" "}
            <span className="font-bold text-stone-800">
              {Math.min(currentPage * ITEMS_PER_PAGE, artworks.length)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-stone-800">
              {artworks.length}
            </span>{" "}
            masterpieces
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currentPage === index + 1
                    ? "bg-[#B4136D] text-white shadow-xs"
                    : "border border-stone-200 bg-white hover:bg-stone-50 text-stone-700"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {selectedArtwork && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-xl rounded-[2.5rem] bg-white p-7 shadow-2xl border border-stone-200"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-stone-900">
                    Edit Artwork Dossier
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Update catalog title, medium, statement, or acquisition price.
                  </p>
                </div>
                <button
                  onClick={closeEditModal}
                  className="text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="space-y-1 text-xs font-bold uppercase tracking-wider text-stone-500">
                  <span>Title</span>
                  <input
                    value={formState.title}
                    onChange={(e) => handleFormChange("title", e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-4 py-2.5 text-sm font-medium text-stone-900 outline-none focus:border-[#B4136D]"
                  />
                </label>
                <label className="space-y-1 text-xs font-bold uppercase tracking-wider text-stone-500">
                  <span>Category</span>
                  <input
                    value={formState.category}
                    onChange={(e) =>
                      handleFormChange("category", e.target.value)
                    }
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-4 py-2.5 text-sm font-medium text-stone-900 outline-none focus:border-[#B4136D]"
                  />
                </label>
              </div>

              <div className="space-y-1 mt-4 text-xs font-bold uppercase tracking-wider text-stone-500">
                <label>Curatorial Statement</label>
                <textarea
                  rows={4}
                  value={formState.description}
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                  className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-4 py-2.5 text-sm font-medium text-stone-900 outline-none resize-none focus:border-[#B4136D]"
                />
              </div>

              <div className="w-full max-w-xs mt-4 text-xs font-bold uppercase tracking-wider text-stone-500">
                <label className="space-y-1">
                  <span>Price (USD)</span>
                  <input
                    value={formState.price}
                    onChange={(e) => handleFormChange("price", e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-[#FAF8F5] px-4 py-2.5 text-sm font-medium text-stone-900 outline-none focus:border-[#B4136D]"
                  />
                </label>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-full border border-stone-200 bg-white px-5 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-full bg-[#B4136D] hover:bg-[#930f58] px-6 py-2.5 text-xs font-bold text-white transition shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Modal */}
        {deleteArtwork && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-md rounded-[2.5rem] bg-white p-7 shadow-2xl border border-stone-200 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-4 text-rose-700">
                <Trash2 size={26} />
              </div>

              <h2 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                De-list Artwork?
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed mb-6">
                Are you sure you want to permanently withdraw{" "}
                <span className="font-bold text-stone-800">
                  {deleteArtwork.title}
                </span>{" "}
                from the public gallery? This cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="flex-1 rounded-full border border-stone-200 bg-white py-3 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 rounded-full bg-rose-700 hover:bg-rose-800 py-3 text-xs font-bold text-white transition shadow-sm cursor-pointer disabled:opacity-60"
                >
                  {deleting ? "De-listing..." : "De-list Artwork"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArtistArtworkManage;
