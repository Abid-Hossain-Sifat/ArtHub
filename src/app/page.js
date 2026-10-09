import Banner from "@/Components/Banner";
import Category from "@/Components/Category";
import TopArt from "@/Components/TopArt";
import TopArtist from "@/Components/TopArtist";
import WhyArtHub from "@/Components/WhyArtHub";
import MasterQuotes from "@/Components/MasterQuotes";
import Faq from "@/Components/Faq";

export default function Home() {
  return (
    <div>
      <Banner />
      <TopArt />
      <TopArtist />
      <Category />
      <WhyArtHub />
      <MasterQuotes />
      <Faq />
    </div>
  );
}
