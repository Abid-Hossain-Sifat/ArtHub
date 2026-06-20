"use client";
import React, { useState } from "react";
import { Plus, List, CheckCircle2 } from "lucide-react";

const currentUser = {
  name: "Julian Rossi",
  email: "julian.r@artistry.com",
};

const AddArtworkPage = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [price, setPrice] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await response.json();
      if (data.success) {
        setImageUrl(data.data.url);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setLoading(false);
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

  const handleListArtwork = (e) => {
    e.preventDefault();
    console.log("Listing artwork with price:", price);
  };

  
  const inputClass =
    "w-full border border-gray-200 rounded-lg p-3 outline-none transition focus:ring-1 focus:ring-[#7C3AED] focus:border-[#7C3AED]";

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Add New Masterpiece
          </h1>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm">
          <form className="space-y-8" onSubmit={handleListArtwork}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="font-medium text-gray-700">Artist Name</label>
                <input
                  type="text"
                  value={currentUser.name}
                  disabled
                  className="w-full bg-gray-100 text-gray-900 border border-gray-200 rounded-lg p-3 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={currentUser.email}
                  disabled
                  className="w-full bg-gray-100 text-gray-900 border border-gray-200 rounded-lg p-3 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="font-medium text-gray-700">
                  Artwork Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Whispers of the Horizon"
                  required
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className="font-medium text-gray-700">Category</label>
                <select className={inputClass}>
                  <option>Select a category</option>
                  <option>Painting</option>
                  <option>Digital Art</option>
                  <option>Sculpture</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-medium text-gray-700">Description</label>
              <textarea
                placeholder="Tell the story behind your masterpiece..."
                rows="6"
                className={inputClass}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="font-medium text-gray-700">
                  List Price (USD)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 font-medium">
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
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-medium text-gray-700">
                  Upload Artwork
                </label>
                <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer block hover:border-[#7C3AED] hover:bg-purple-50 transition duration-150">
                  {loading ? (
                    <div className="flex justify-center items-center gap-2 text-[#7C3AED]">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#7C3AED]"></div>
                      Uploading...
                    </div>
                  ) : imageUrl ? (
                    <div className="flex flex-col items-center gap-3">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                      <img
                        src={imageUrl}
                        alt="Uploaded"
                        className="w-24 h-16 rounded object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-purple-100 text-[#7C3AED] p-3 rounded-full">
                        <Plus className="w-6 h-6" />
                      </div>
                      <p className="font-medium text-gray-900">
                        Click to upload
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4 border-t pt-8 mt-12">
              <button
                type="submit"
                disabled={!imageUrl}
                className={`px-8 py-3 rounded-lg flex items-center gap-2.5 transition font-medium text-white ${
                  imageUrl
                    ? "bg-[#7C3AED] hover:bg-[#6D28D9] shadow-sm"
                    : "bg-[#7C3AED] opacity-50 cursor-not-allowed"
                }`}
              >
                <List size={20} />
                List Artwork
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddArtworkPage;
