import React from 'react';
import { artworkCollection } from '@/lib/data';
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const ArtistArtworkManage = async () => {
  const Artworks = await artworkCollection();

  const totalArtworks = Artworks.length;
  const availableArtworks = Artworks.filter(art => art.status?.toLowerCase() === 'available' || !art.isSold).length;
  const soldArtworks = Artworks.filter(art => art.isSold || art.status?.toLowerCase() === 'sold').length;

  return (
    <div className="w-full min-h-screen bg-[#F8F9FC] p-6 lg:p-10 font-sans text-slate-800">
      
      {/* Top Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#0F172A]">Manage Your Masterpieces</h1>
        <p className="text-slate-500 text-sm mt-1">Track, edit, and curate your active listings.</p>
      </div>

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Total Artworks */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Artworks</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-slate-900">{totalArtworks}</span>
          </div>
        </div>

        {/* Available */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-slate-900">{availableArtworks}</span>
          </div>
        </div>

        {/* Sold */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sold</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-slate-900">{soldArtworks}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Artwork</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
              {Artworks.map((artwork) => {
                // Formatting helper variables
                const isItemSold = artwork.isSold || artwork.status?.toLowerCase() === 'sold';
                const statusText = isItemSold ? 'Sold' : (artwork.status || 'Available');

                return (
                  <tr key={artwork._id || artwork.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                    
                    {/* Artwork image & title */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm">
                          {artwork.image ? (
                            <img src={artwork.image} alt={artwork.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg">🎨</span>
                          )}
                        </div>
                        <span className="font-semibold text-slate-900">{artwork.title || 'Untitled'}</span>
                      </div>
                    </td>

                    {/* Category Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-600 capitalize">
                        {artwork.category || 'General'}
                      </span>
                    </td>

                    {/* Price Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-slate-900 font-bold">
                      ${typeof artwork.price === 'number' ? artwork.price.toFixed(2) : artwork.price}
                    </td>

                    {/* Status Badge Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        isItemSold 
                          ? 'bg-slate-100 text-slate-500' 
                          : 'bg-emerald-50 text-emerald-600'
                      } capitalize`}>
                        {statusText}
                      </span>
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Edit Masterpiece"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State Fallback */}
        {Artworks.length === 0 && (
          <div className="text-center py-16 text-slate-400 text-sm">
            No masterpieces added yet. Start creating!
          </div>
        )}

        {/* Table Pagination Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400 bg-slate-50/30">
          <div>
            Showing {Artworks.length} of {Artworks.length} artworks
          </div>
          <div className="flex gap-2">
            <button className="flex items-center justify-center p-1.5 border border-slate-200 rounded-lg hover:bg-white text-slate-500 transition-colors disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="flex items-center justify-center p-1.5 border border-slate-200 rounded-lg hover:bg-white text-slate-500 transition-colors disabled:opacity-50" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ArtistArtworkManage;