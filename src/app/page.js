import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";

import "../styles/globals.css";
import BrandBar from "./components/BrandBar";
import Featurebar from "./components/featurebar";
import CategoryBar from "./components/CategoryBar";
import FooterBar from "./components/FooterBar";
import PartnerSection from "./components/PartnerSection";
import FeaturedShop from "./components/FeaturedShop";
import FeaturedRentals from "./components/FeaturedRentals";
import ReviewsSection from "./components/ReviewSection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <BrandBar />
      <HeroSection />
      <Featurebar />
      <CategoryBar />
      <FeaturedRentals />
      <FeaturedShop />
      <ReviewsSection />
      <PartnerSection />
      <FooterBar />
    </main>
  );
}
