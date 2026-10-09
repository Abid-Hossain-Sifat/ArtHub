"use client";

import React, { useState, useEffect } from "react";
import { userDetails, updateUserRole } from "../../../../lib/data";
import { TableSkeleton } from "../../../../Components/Skeleton";
import Image from "next/image";
import { Users, Palette, ShieldCheck, ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react";

export function getInitials(name) {
  if (!name) return "U";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function isRemote(url) {
  return typeof url === "string" && url.startsWith("http");
}

const AdminDashboardUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("user");

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await userDetails();
        setUsers(data || []);
      } catch (err) {
        console.error("Error loading users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Counts
  const totalUsersCount = users.filter((u) => u.role === "user").length;
  const totalArtistsCount = users.filter((u) => u.role === "artist").length;
  const totalAdminsCount = users.filter((u) => u.role === "admin").length;

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.max(1, Math.ceil(users.length / usersPerPage));

  // Modal
  const openModal = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role || "user");
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedUser(null);
  };

  // Role update
  const handleRoleUpdate = async () => {
    if (!selectedUser?._id) return;

    if (selectedUser.role === selectedRole) {
      closeModal();
      return;
    }

    try {
      const result = await updateUserRole(selectedUser._id, selectedRole);

      if (result?.success) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === selectedUser._id
              ? { ...user, role: selectedRole }
              : user,
          ),
        );
        closeModal();
      } else {
        console.log("Update failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 bg-[#FAF8F5] min-h-screen font-sans text-stone-900">
      {/* HEADER */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B4136D]/10 text-[#B4136D] text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curatorial Registry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium tracking-tight text-stone-900">
          User Management
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm">
          Platform-wide registry of verified artists, art patrons, and executive curators.
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-2xl md:rounded-3xl shadow-2xs border border-stone-200/90 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Art Patrons
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-serif font-bold text-stone-900">
            {loading ? (
              <div className="h-8 bg-stone-200 rounded w-12 animate-pulse" />
            ) : (
              totalUsersCount
            )}
          </span>
          <span className="text-[11px] text-stone-400">Registered collectors</span>
        </div>

        <div className="bg-white p-6 rounded-2xl md:rounded-3xl shadow-2xs border border-stone-200/90 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Master Artists
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#B4136D]/10 text-[#B4136D] flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-serif font-bold text-[#B4136D]">
            {loading ? (
              <div className="h-8 bg-stone-200 rounded w-12 animate-pulse" />
            ) : (
              totalArtistsCount
            )}
          </span>
          <span className="text-[11px] text-[#B4136D]/80">Active creators</span>
        </div>

        <div className="bg-white p-6 rounded-2xl md:rounded-3xl shadow-2xs border border-stone-200/90 flex flex-col justify-between space-y-2 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Super Curators
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-serif font-bold text-emerald-800">
            {loading ? (
              <div className="h-8 bg-stone-200 rounded w-12 animate-pulse" />
            ) : (
              totalAdminsCount
            )}
          </span>
          <span className="text-[11px] text-emerald-700">Executive admins</span>
        </div>
      </div>

      {/* TABLE WORKFLOW LAYER */}
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xs border border-stone-200/90 overflow-hidden">
        <div className="w-full overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[650px] table-auto">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200/80 text-stone-500 text-[11px] font-semibold tracking-wider uppercase">
                <th className="p-4 px-6 w-20">Avatar</th>
                <th className="p-4 px-6">Name</th>
                <th className="p-4 px-6">Email Address</th>
                <th className="p-4 px-6 w-32">Registry Role</th>
                <th className="p-4 px-6 text-right w-36">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 text-sm text-stone-700">
              {loading ? (
                <TableSkeleton rows={5} />
              ) : (
                currentUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-stone-50/60 transition-colors"
                  >
                    {/* Avatar */}
                    <td className="p-4 px-6 whitespace-nowrap">
                      {isRemote(user.image) ? (
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-stone-200 shadow-2xs">
                          <Image
                            src={user.image}
                            alt={user.name || "User"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B4136D] to-[#800d4d] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-inner">
                          {getInitials(user.name)}
                        </div>
                      )}
                    </td>

                    {/* Name */}
                    <td className="p-4 px-6 whitespace-nowrap font-medium text-stone-900">
                      {user.name || "N/A"}
                    </td>

                    {/* Email */}
                    <td className="p-4 px-6 whitespace-nowrap text-stone-500 text-xs">
                      {user.email || "N/A"}
                    </td>

                    {/* Badge Role */}
                    <td className="p-4 px-6 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize tracking-wide border ${
                          user.role === "admin"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200/60"
                            : user.role === "artist"
                              ? "bg-[#B4136D]/10 text-[#B4136D] border-[#B4136D]/20"
                              : "bg-blue-50 text-blue-700 border-blue-200/60"
                        }`}
                      >
                        {user.role === "user" ? "Patron" : user.role || "user"}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="p-4 px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => openModal(user)}
                        className="bg-stone-50 text-stone-700 hover:bg-[#B4136D] hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border border-stone-200 hover:border-[#B4136D] shadow-2xs cursor-pointer"
                      >
                        Change Role
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-stone-200/80 bg-stone-50/50">
            <p className="text-xs text-stone-500">
              Showing Page {currentPage} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-semibold text-stone-800 px-2">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ADAPTIVE MODAL */}
      {isOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 transition-opacity">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-stone-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Modify Registry Role
              </h2>
              <button
                onClick={closeModal}
                className="text-stone-400 hover:text-stone-600 p-1.5 transition-colors rounded-lg hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80">
                {isRemote(selectedUser.image) ? (
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-stone-200 shadow-2xs">
                    <Image
                      src={selectedUser.image}
                      alt={selectedUser.name || "User"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B4136D] to-[#800d4d] text-white flex items-center justify-center font-bold text-sm shadow-inner">
                    {getInitials(selectedUser.name)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-stone-900 truncate text-sm">
                    {selectedUser.name}
                  </h4>
                  <p className="text-xs text-stone-500 truncate">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              {/* Selector Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Select New Privilege Tier
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-800 focus:outline-none focus:border-[#B4136D] focus:bg-white cursor-pointer transition-all"
                >
                  <option value="user">Patron (Standard User)</option>
                  <option value="artist">Artist (Verified Creator)</option>
                  <option value="admin">Administrator (Super Curator)</option>
                </select>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-stone-200 text-stone-600 hover:bg-stone-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleUpdate}
                className="px-5 py-2 bg-[#B4136D] hover:bg-[#930f58] text-white rounded-xl text-xs font-bold shadow-md shadow-[#B4136D]/20 transition-all duration-150 active:scale-95 cursor-pointer"
              >
                Save Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardUsers;
