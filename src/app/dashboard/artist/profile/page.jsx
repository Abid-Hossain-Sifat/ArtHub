"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getInitials, isRemote } from "@/lib/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileSkeleton } from "@/Components/Skeleton";
import {
  Camera,
  Pencil,
  Lock,
  Image as ImageIcon,
  Calendar,
  ShieldCheck,
  X,
  DollarSign,
  Award,
  Sparkles,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { useSession, updateUser, changePassword, changeEmail } from "@/lib/auth-client";
import { toast } from "react-hot-toast";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const ProfilePage = () => {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [profile, setProfile] = useState({ name: "", email: "", image: "", role: "" });
  const [previewImage, setPreviewImage] = useState("");
  const [tempProfile, setTempProfile] = useState({ name: "", email: "", image: "" });
  const [tempPreviewImage, setTempPreviewImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [stats, setStats] = useState({ total: 0, sold: 0, available: 0 });

  useEffect(() => {
    if (!user) return;

    setProfile({
      name: user.name || "",
      email: user.email || "",
      image: user.image || "",
      role: user.role || "artist",
    });
    setPreviewImage(user.image || "");
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;

    const loadStats = async () => {
      try {
        const response = await fetch(`${backendUrl}/artworks?artistId=${encodeURIComponent(user.id)}`);
        if (!response.ok) return;

        const artworks = await response.json();
        const total = Array.isArray(artworks) ? artworks.length : 0;
        const sold = Array.isArray(artworks)
          ? artworks.filter((item) => item.isSold || item.status?.toLowerCase() === "sold").length
          : 0;

        setStats({ total, sold, available: total - sold });
      } catch (error) {
        console.error("Error loading artwork stats:", error);
      }
    };

    loadStats();
  }, [user?.id]);

  const isLoading = isPending || !user;

  const handleOpenEdit = () => {
    setTempProfile({
      name: profile.name,
      email: profile.email,
      image: profile.image,
    });
    setTempPreviewImage(previewImage);
    setEditOpen(true);
  };

  const handleTempProfileField = (field, value) => {
    setTempProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordField = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const uploadImageToImgbb = async (file) => {
    if (!imgbbKey) {
      toast.error("IMGBB API key is missing.");
      return null;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error?.message || "Upload failed");
      }

      return result.data.url;
    } catch (error) {
      console.error("ImgBB upload error:", error);
      toast.error("Avatar upload failed.");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAvatarSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const tmpUrl = URL.createObjectURL(file);
    setTempPreviewImage(tmpUrl);

    const imageUrl = await uploadImageToImgbb(file);
    if (imageUrl) {
      setTempProfile((prev) => ({ ...prev, image: imageUrl }));
      toast.success("Avatar uploaded successfully.");
    }
  };

  const saveProfile = async () => {
    if (!tempProfile.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    setSavingProfile(true);
    try {
      await updateUser({ name: tempProfile.name, image: tempProfile.image || undefined });

      if (tempProfile.email && tempProfile.email !== profile.email) {
        await changeEmail({ newEmail: tempProfile.email });
      }

      const response = await fetch(`${backendUrl}/user/${user.id}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: tempProfile.name,
          email: tempProfile.email,
          image: tempProfile.image,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to update backend profile");
      }

      setProfile((prev) => ({
        ...prev,
        name: tempProfile.name,
        email: tempProfile.email,
        image: tempProfile.image,
      }));
      setPreviewImage(tempPreviewImage);

      toast.success("Profile updated successfully.");
      setEditOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Profile save failed:", error);
      toast.error(error.message || "Could not update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const changePasswordSubmit = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("Complete all password fields.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      toast.success("Password changed successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordOpen(false);
    } catch (error) {
      console.error("Password change failed:", error);
      toast.error(error.message || "Could not change password.");
    } finally {
      setSavingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#FAF8F5] p-6 lg:p-10 font-sans text-stone-900">
        <div className="mb-8 max-w-7xl mx-auto">
          <div className="h-8 bg-stone-200 rounded-lg w-64 animate-pulse" />
        </div>
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] p-4 sm:p-6 lg:p-10 font-sans text-stone-900">
      
      {/* Top Profile Header Section */}
      <div className="mb-8 max-w-7xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B4136D]/10 text-[#B4136D] text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio Identity</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium tracking-tight text-stone-900">
            Artist Dossier
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Manage your public artist signature, studio metrics, and verification security.
          </p>
        </div>
        <Link 
          href="/dashboard" 
          className="self-start sm:self-auto inline-flex items-center gap-2 rounded-2xl border border-stone-200/90 bg-white px-5 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-all shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </Link>
      </div>
      
      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto bg-white rounded-[2rem] border border-stone-200/90 shadow-2xs p-6 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-stretch">
          
          {/* Main Profile Info */}
          <div className="lg:col-span-2 flex flex-col sm:flex-row gap-8 items-center sm:items-start">
            
            <div className="flex flex-col items-center sm:items-start gap-5 flex-shrink-0 w-full sm:w-auto">
              <div className="relative group mx-auto sm:mx-0">
                <div className="w-32 h-32 rounded-2xl bg-stone-50 border border-stone-200 shadow-inner overflow-hidden flex items-center justify-center p-2 relative">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt={profile.name}
                      width={128}
                      height={128}
                      priority
                      unoptimized={isRemote(previewImage)}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#B4136D] to-[#800d4d] text-white text-3xl font-serif font-bold tracking-wider select-none rounded-xl">
                      {getInitials(profile.name)}
                    </div>
                  )}
                </div>
                
                {/* Floating Camera Upload Button */}
                <button 
                  onClick={handleOpenEdit}
                  className="absolute -bottom-1 -right-1 bg-white text-stone-700 hover:text-[#B4136D] p-2 rounded-full border border-stone-200 shadow-md transition-all duration-200 hover:scale-105 cursor-pointer"
                  title="Update Profile Picture"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 w-full sm:w-44">
                <button 
                  onClick={handleOpenEdit}
                  className="inline-flex items-center justify-center gap-2 bg-[#B4136D] hover:bg-[#930f58] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-[#B4136D]/20 transition-all active:scale-95 w-full cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Dossier</span>
                </button>

                <button 
                  onClick={() => setPasswordOpen(true)}
                  className="inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 w-full cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Change Password</span>
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-4 text-center sm:text-left w-full h-full flex flex-col justify-start pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center sm:justify-start">
                <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight text-stone-900">{profile.name}</h2>
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-[#B4136D]/10 text-[#B4136D] border border-[#B4136D]/20 capitalize">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Master Artist</span>
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-stone-600">{profile.email}</p>
                {!user.emailVerified && (
                  <p className="text-[10px] text-amber-800 font-medium bg-amber-50 border border-amber-200 rounded-md px-2 py-0.5 inline-block">
                    Verification In Progress
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Curator Bio</h4>
                <p className="text-stone-600 text-xs sm:text-sm font-normal leading-relaxed max-w-lg">
                  Resident artist and exhibition contributor at ArtHub. Specializing in timeless traditional crafts, oil compositions, and digital fine-art curations.
                </p>
              </div>
              
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-stone-400 font-medium pt-4 mt-auto">
                <Calendar className="w-3.5 h-3.5" />
                <span>Studio Guild Status: Active</span>
              </div>
            </div>

          </div>

          {/* Studio Analytics Side Card */}
          <div className="w-full bg-stone-50/70 border border-stone-200/80 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Studio Analytics</h3>
              
              <div className="flex flex-col gap-3.5">
                <div className="bg-white p-4 rounded-xl border border-stone-200/80 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#B4136D]/10 rounded-xl text-[#B4136D]">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500 font-medium">Curated Artworks</p>
                      <p className="text-lg font-serif font-bold text-stone-900">{stats.total}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200/80 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-700">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500 font-medium">Sold Masterpieces</p>
                      <p className="text-lg font-serif font-bold text-stone-900">{stats.sold}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-stone-200/80 flex items-start gap-3 shadow-2xs">
              <Award className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-stone-600 leading-normal">
                Your artwork dossiers are featured in the global ArtHub exhibition. All certificates are cryptographically verified upon purchase.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl border border-stone-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-serif font-bold text-stone-900">Edit Artist Dossier</h2>
                  <p className="text-sm text-stone-500">Update your display signature, contact address, or portrait avatar.</p>
                </div>
                <button onClick={() => setEditOpen(false)} className="rounded-full p-2 text-stone-400 hover:bg-stone-100 transition-colors cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Artist Name</label>
                    <input
                      type="text"
                      value={tempProfile.name}
                      onChange={(e) => handleTempProfileField("name", e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-sm outline-none focus:border-[#B4136D] focus:bg-white transition-all text-stone-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      value={tempProfile.email}
                      onChange={(e) => handleTempProfileField("email", e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-sm outline-none focus:border-[#B4136D] focus:bg-white transition-all text-stone-800"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-stone-200/80 bg-stone-50/50 p-4">
                  <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Portrait Avatar</p>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-white border border-stone-200 p-1">
                      {tempPreviewImage ? (
                        <Image src={tempPreviewImage} alt="preview" fill className="object-cover rounded-xl" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-stone-400">No image</div>
                      )}
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors shadow-2xs">
                      <Camera className="h-4 w-4 text-stone-500" />
                      <span>{uploadingImage ? "Uploading…" : "Upload Portrait File"}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarSelect} disabled={uploadingImage} />
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end pt-2">
                  <button onClick={() => setEditOpen(false)} className="rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer">
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
                    disabled={savingProfile || uploadingImage}
                    className="rounded-xl bg-[#B4136D] hover:bg-[#930f58] px-5 py-2.5 text-xs font-bold text-white disabled:opacity-70 transition-colors shadow-md shadow-[#B4136D]/20 cursor-pointer"
                  >
                    {savingProfile ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PASSWORD MODAL */}
      <AnimatePresence>
        {passwordOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl border border-stone-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-serif font-bold text-stone-900">Change Password</h2>
                  <p className="text-sm text-stone-500">Update your security credentials safely.</p>
                </div>
                <button onClick={() => setPasswordOpen(false)} className="rounded-full p-2 text-stone-400 hover:bg-stone-100 transition-colors cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => handlePasswordField("currentPassword", e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-sm outline-none focus:border-[#B4136D] focus:bg-white text-stone-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => handlePasswordField("newPassword", e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-sm outline-none focus:border-[#B4136D] focus:bg-white text-stone-800"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => handlePasswordField("confirmPassword", e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-4 py-3 text-sm outline-none focus:border-[#B4136D] focus:bg-white text-stone-800"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button onClick={() => setPasswordOpen(false)} className="rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer">
                  Cancel
                </button>
                <button
                  onClick={changePasswordSubmit}
                  disabled={savingPassword}
                  className="rounded-xl bg-[#B4136D] hover:bg-[#930f58] px-5 py-2.5 text-xs font-bold text-white disabled:opacity-70 transition-colors shadow-md shadow-[#B4136D]/20 cursor-pointer"
                >
                  {savingPassword ? "Updating…" : "Update Password"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;