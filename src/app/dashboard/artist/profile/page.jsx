import React from 'react'
import { Camera, Pencil, Lock, Image as ImageIcon, DollarSign, Award, ShieldCheck, Calendar } from 'lucide-react'
import Image from 'next/image'

const ProfilePage = () => {
  // Dynamic Admin User Context Node
  const user = {
    name: 'ArtHub Admin',
    email: 'admin@arthub.com',
    role: 'admin',
    emailVerified: false,
    avatar: 'https://i.ibb.co/0jqjkYBg/Logo.png',
    bio: 'Digital impressionist based in Barcelona, exploring the intersection of traditional light theory and modern generative algorithms.',
    createdAt: 'Joined June 2026'
  }

  return (
    <div className="w-full min-h-screen bg-[#F8F9FC] p-6 lg:p-10 font-sans text-slate-800">
      
      {/* Top Profile Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Profile Management</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your studio identity, artwork stats, and account security.</p>
      </div>
      
      {/* Container tracking layout config w-9xl system mapping width */}
      <div className="w-full max-w-[1440px] bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
          
          <div className="lg:col-span-2 flex flex-col sm:flex-row gap-10 items-start">
            
            <div className="flex flex-col items-center sm:items-start gap-6 flex-shrink-0 w-full sm:w-auto">
              
              <div className="relative group cursor-pointer mx-auto sm:mx-0">
                <div className="w-32 h-32 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm overflow-hidden flex items-center justify-center p-2">
                  <Image
                    src={user.avatar} 
                    alt={user.name} 
                    width={128}
                    height={128}
                    priority
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
                
                {/* Floating Camera Actions Selector */}
                <button 
                  className="absolute -bottom-1 -right-1 bg-white text-slate-700 hover:text-slate-900 p-2 rounded-full border border-slate-200 shadow-md transition-all duration-200 hover:scale-105"
                  title="Update Profile Picture"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Stacked Vertical Interaction Buttons Layer */}
              <div className="flex flex-col gap-3 w-full sm:w-40">
                {/* Edit Action Button */}
                <button className="inline-flex items-center justify-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 w-full">
                  <Pencil className="w-3.5 h-3.5" />
                  Edit Profile
                </button>

                {/* Password Action Button */}
                <button className="inline-flex items-center justify-center gap-2 bg-[#DCE4EC] hover:bg-[#D1DCE8] text-slate-600 hover:text-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 w-full">
                  <Lock className="w-3.5 h-3.5" />
                  Change Password
                </button>
              </div>
            </div>

            {/* [SECOND FIELD - BLUE): Comprehensive Metadata Profile Details */}
            <div className="flex-1 space-y-4 text-center sm:text-left w-full h-full flex flex-col justify-start pt-2">
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center sm:justify-start">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">{user.name}</h2>
                
                <span className="inline-flex items-center gap-1 px-3 py-0.5 text-[11px] font-semibold rounded-full bg-[#F3E8FF] text-[#7C3AED] border border-[#E9D5FF]/30 capitalize">
                  <ShieldCheck className="w-3 h-3" />
                  {user.role}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-500">{user.email}</p>
                {!user.emailVerified && (
                  <p className="text-[10px] text-amber-600 font-medium bg-amber-50 border border-amber-100 rounded-md px-2 py-0.5 inline-block">
                    Pending Verification
                  </p>
                )}
              </div>
              
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-400 font-medium pt-4 mt-auto">
                <Calendar className="w-3.5 h-3.5" />
                <span>{user.createdAt}</span>
              </div>
            </div>

          </div>

          <div className="w-full bg-[#F8F9FC]/80 border border-slate-100 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
            
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Studio Analytics</h3>
              
              {/* Analytics Metrics List */}
              <div className="flex flex-col gap-3.5">
                <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-50 rounded-xl text-[#7C3AED]">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-slate-500 font-semibold">Total Artworks</p>
                  </div>
                  <p className="text-lg font-bold text-slate-900">42</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-slate-500 font-semibold">Total Sold</p>
                  </div>
                  <p className="text-lg font-bold text-slate-900">0</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}

export default ProfilePage