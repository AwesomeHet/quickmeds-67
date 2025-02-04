import Hero from "@/components/Hero";
import TrendingMeds from "@/components/TrendingMeds";
import AboutUs from "@/components/AboutUs";
import FranchiseSection from "@/components/FranchiseSection";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <TrendingMeds />
      <AboutUs />
      <FranchiseSection />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;