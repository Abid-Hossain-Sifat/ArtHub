import Banner from "@/Components/Banner";
import Navbar from "@/Components/Navbar";
import TopArt from "@/Components/TopArt";
import TopArtist from "@/Components/TopArtist";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Banner></Banner>
      <TopArt></TopArt>
      <TopArtist></TopArtist>
    </div>
  );
}
