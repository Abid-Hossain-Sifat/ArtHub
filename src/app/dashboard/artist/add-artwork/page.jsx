"use client";

import React, { useState } from "react";
import { Plus, List, CheckCircle2, Sparkles, UploadCloud, X } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FormSkeleton } from "@/Components/Skeleton";
import Image from "next/image";

const AddArtworkPage = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState("");
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [isCustom, setIsCustom] = useState(false);
  const [customCategory, setCustomCategory] = useState("");

  const finalCategory = isCustom ? customCategory : category;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setImageName(file.name);
      setImageFile(file);
      toast.success("Artwork image selected!");
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    const regex = /^[0-9]*\.?[0-9]{0,2}$/;
    if (regex.test(value)) {
      setPrice(value);
    }
  };

  const handleBlur = () => {
    const val = parseFloat(price);
    if (!isNaN(val)) {
      setPrice(val.toFixed(2));
    } else {
      setPrice("");
    }
  };

  const handleListArtwork = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error("Please select an artwork image first");
      return;
    }
    if (!finalCategory) {
      toast.error("Please select or enter a category");
      return;
    }
    if (!price) {
      toast.error("Please set an acquisition price");
      return;
    }

    setSubmitting(true);
    let uploadedUrl = "";

    try {
      // Upload to ImgBB
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        },
      );
      const imgData = await response.json();
      if (imgData.success) {
        uploadedUrl = imgData.data.url;
      } else {
        toast.error("Image upload to ImgBB failed.");
        setSubmitting(false);
        return;
      }

      // Post to backend
      const payload = {
        title,
        category: finalCategory,
        description,
        price: parseFloat(price),
        image: uploadedUrl,
        artistName: session?.user?.name,
        artistEmail: session?.user?.email,
        artistId: session?.user?.id,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/artworks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Masterpiece exhibited successfully!");
        router.push("/artworks");
      } else {
        toast.error(data.error || "Failed to exhibit artwork");
      }
    } catch (error) {
      console.error("Error listing artwork:", error);
      toast.error("An error occurred while publishing artwork.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-stone-200 rounded-xl p-3 outline-none transition focus:ring-3 focus:ring-[#B4136D]/10 focus:border-[#B4136D] bg-[#FAF8F5] text-stone-900 text-sm font-medium placeholder:text-stone-400";

  if (isPending) {
    return (
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <FormSkeleton />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto selection:bg-[#B4136D]/15 selection:text-[#B4136D] space-y-6"
    >
      {/* Page Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#B4136D]/10 border border-[#B4136D]/20 text-[#B4136D] text-[10px] font-bold uppercase tracking-widest mb-1.5">
          <Sparkles size={11} />
          <span>Gallery Exhibition Intake</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
          Exhibit New Masterpiece
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Catalog and publish your original artwork into the ArtHub permanent archive.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[2.5rem] border border-stone-200/90 shadow-2xs">
        <form className="space-y-7" onSubmit={handleListArtwork}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Artist Name
              </label>
              <input
                type="text"
                value={session?.user?.name || ""}
                disabled
                className="w-full bg-stone-100 text-stone-700 border border-stone-200 rounded-xl p-3 text-sm font-semibold cursor-not-allowed"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Studio Email
              </label>
              <input
                type="email"
                value={session?.user?.email || ""}
                disabled
                className="w-full bg-stone-100 text-stone-700 border border-stone-200 rounded-xl p-3 text-sm font-semibold cursor-not-allowed"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Artwork Title
              </label>
              <input
                type="text"
                placeholder="e.g., Whispers of the Mediterranean Horizon"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Curatorial Category
              </label>

              {isCustom ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter custom medium / category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className={inputClass}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setIsCustom(false);
                      setCustomCategory("");
                    }}
                    className="p-3 text-stone-400 hover:text-stone-700 transition"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <select
                  className={inputClass}
                  value={category}
                  onChange={(e) => {
                    if (e.target.value === "other") {
                      setIsCustom(true);
                    } else {
                      setCategory(e.target.value);
                    }
                  }}
                  required
                >
                  <option value="">Select medium / category</option>
                  <option value="Painting">Painting</option>
                  <option value="Digital Art">Digital Art</option>
                  <option value="Sculpture">Sculpture</option>
                  <option value="Nature">Nature</option>
                  <option value="Landscape">Landscape</option>
                  <option value="Photography">Photography</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="other">+ Add Custom Category</option>
                </select>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Curatorial Statement & Story
            </label>
            <textarea
              placeholder="Describe the philosophy, medium, physical dimensions, or creative story behind this work..."
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Acquisition Value (USD)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-stone-400 font-bold text-sm">
                  $
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  required
                  value={price}
                  onChange={handlePriceChange}
                  onBlur={handleBlur}
                  className={`${inputClass} pl-9 font-serif text-lg font-bold`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                High-Resolution Image
              </label>
              <label className="border-2 border-dashed border-stone-200 hover:border-[#B4136D] rounded-[2rem] p-6 text-center cursor-pointer block hover:bg-[#B4136D]/5 transition duration-200 bg-[#FAF8F5]">
                {submitting ? (
                  <div className="flex justify-center items-center gap-2 text-[#B4136D] text-xs font-bold py-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#B4136D] border-t-transparent" />
                    <span>Processing & Uploading Exhibition File...</span>
                  </div>
                ) : imagePreview ? (
                  <div className="flex flex-col items-center gap-2.5">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    <div className="relative w-28 h-20 rounded-xl overflow-hidden shadow-xs border border-stone-200">
                      <Image
                        src={imagePreview}
                        alt="Uploaded Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <span className="text-xs text-stone-600 font-medium max-w-[200px] truncate">
                      {imageName}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <div className="w-12 h-12 rounded-2xl bg-[#B4136D]/10 text-[#B4136D] flex items-center justify-center">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-stone-800">
                      Click to upload high-res artwork file
                    </p>
                    <p className="text-[11px] text-stone-400">
                      PNG, JPG, or WebP format supported
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={submitting}
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-stone-100">
            <button
              type="submit"
              disabled={!imageFile || submitting}
              className={`px-8 py-3.5 rounded-full flex items-center gap-2 text-xs font-bold transition-all shadow-md ${
                imageFile && !submitting
                  ? "bg-[#B4136D] hover:bg-[#930f58] text-white shadow-[#B4136D]/20 cursor-pointer"
                  : "bg-stone-200 text-stone-400 cursor-not-allowed"
              }`}
            >
              {submitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <List size={16} />
              )}
              <span>{submitting ? "Publishing to Gallery..." : "Exhibit Masterpiece"}</span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddArtworkPage;
