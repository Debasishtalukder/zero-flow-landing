import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import BeforeAfter from "@/components/BeforeAfter";
import SocialProof from "@/components/SocialProof";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <Hero />
    <HowItWorks />
    <Features />
    <BeforeAfter />
    <SocialProof />
    <Pricing />
    <FAQ />
    <FinalCTA />
    <Footer />
  </div>
);

export default Index;
