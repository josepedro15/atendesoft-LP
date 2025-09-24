import { useEffect } from "react";
import { useScrollTracking } from "@/lib/events";
import { useMobile } from "@/hooks/use-mobile";
import Navbar from "@/components/Navbar";
import Demonstracao from "@/components/Demonstracao";
import ParallaxBackground from "@/components/ParallaxBackground";
import Footer from "@/components/Footer";

const DemonstracaoPage = () => {
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
        <Demonstracao />
      </main>
      <Footer />
    </div>
  );
};

export default DemonstracaoPage;
