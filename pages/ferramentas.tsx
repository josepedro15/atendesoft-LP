import { useEffect } from "react";
import { useScrollTracking } from "@/lib/events";
import { useMobile } from "@/hooks/use-mobile";
import Navbar from "@/components/Navbar";
import Ferramentas from "@/components/Ferramentas";
import ParallaxBackground from "@/components/ParallaxBackground";
import Footer from "@/components/Footer";

const FerramentasPage = () => {
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
        <Ferramentas />
      </main>
      <Footer />
    </div>
  );
};

export default FerramentasPage;
