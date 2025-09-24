import { useEffect } from "react";
import { useScrollTracking } from "@/lib/events";
import { useMobile } from "@/hooks/use-mobile";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ComoFunciona from "@/components/ComoFunciona";
import Manifesto from "@/components/Manifesto";
import FAQ from "@/components/FAQ";
import CTAFinal from "@/components/CTAFinal";
import Footer from "@/components/Footer";
import ParallaxBackground from "@/components/ParallaxBackground";

const Home = () => {
  const isMobile = useMobile();
  
  // Initialize scroll tracking for analytics
  const cleanup = useScrollTracking();
  
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <div className="min-h-screen bg-background relative">
      {!isMobile && <ParallaxBackground />}
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <ComoFunciona />
        <Manifesto />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
