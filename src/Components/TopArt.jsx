import React from "react";
import Link from "next/link";
import { artworkCollection } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const TopArt = async () => {
  const allArtworks = await artworkCollection();
  const topArtworks = allArtworks
    .filter((art) => art.isSold === false)
    .sort(() => 0.5 - Math.random())
    .slice(0, 7);

  const getGridClass = (index) => {
    switch (index) {
      case 0:
        return "col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3 lg:row-span-2";
      default:
        return "col-span-1";
    }
  };

  return (
    <section className="w-full max-w-[90%] md:max-w-[80%] mx-auto py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Featured Masterpieces</h2>
          <p className="text-gray-500">
            Our weekly curation of high-potential digital assets and physical works.
          </p>
        </div>
        <Link
          href="/artworks"
          className="text-purple-600 font-semibold hover:underline flex items-center gap-1 whitespace-nowrap"
        >
          View Gallery <ArrowRight size={18} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[250px]">
        {topArtworks.map((art, index) => (
          <div
            key={art._id}
            className={`relative rounded-2xl overflow-hidden group ${getGridClass(index)}`}
          >
            <Link href={`/artworks/${art._id}`}>
              <Image
                src={art.image}
                alt={art.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopArt;