import React from "react";
import Image from "next/image";
import { artworkCollection, userDetails } from "@/lib/data";

const TopArtist = async () => {
  const artworks = await artworkCollection();
  const users = await userDetails();

  const artistMap = {};

  users
    .filter((user) => user.role === "artist")
    .forEach((artist) => {
      artistMap[artist._id] = {
        id: artist._id,
        name: artist.name,
        email: artist.email,
        image: artist.image || "/default-avatar.png",
        artworks: 0,
        sales: 0,
      };
    });

  artworks.forEach((art) => {
    if (!artistMap[art.artistId]) return;
    artistMap[art.artistId].artworks++;
    if (art.isSold) {
      artistMap[art.artistId].sales++;
    }
  });

  const artists = Object.values(artistMap)
    .sort((a, b) => {
      const scoreA = a.sales * 10 + a.artworks;
      const scoreB = b.sales * 10 + b.artworks;
      return scoreB - scoreA;
    })
    .slice(0, 3);

  return (
    <section className="w-full max-w-[90%] md:max-w-[80%] mx-auto bg-[#f5f7ff] py-10 md:py-16 px-4 md:px-8 rounded-3xl border border-purple-200 my-12">
      {/* Header */}
      <div className="text-center mb-10 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Top Artist</h2>
        <p className="text-sm md:text-base text-gray-500">
          The visionary minds shaping the future of digital and physical art.
        </p>
      </div>

      {/* Artist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
        {artists.map((artist, index) => (
          <div key={artist.id || index} className="flex flex-col items-center p-4">
            {/* Circular Image */}
            <div className="relative w-28 h-28 md:w-32 md:h-32 mb-4 rounded-full overflow-hidden shadow-lg border-4 border-white">
              <Image
                src={artist.image}
                alt={artist.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Info */}
            <h3 className="font-bold text-lg text-center truncate w-full">{artist.name}</h3>
            <p className="text-sm text-gray-600 mb-4 text-center">
              {artist.artworks} Artworks • {artist.sales} Sold
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopArtist;