import { useEffect } from "react";
import { useScrollTracking } from "@/lib/events";
import { useMobile } from "@/hooks/use-mobile";
import Navbar from "@/components/Navbar";
import Cases from "@/components/Cases";
import ParallaxBackground from "@/components/ParallaxBackground";
import Footer from "@/components/Footer";

const CasesPage = () => {
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
        <Cases />
      </main>
      <Footer />
    </div>
  );
};

export default CasesPage;
