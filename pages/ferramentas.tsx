import { useEffect } from "react";
import { useScrollTracking } from "@/lib/events";
import Navbar from "@/components/Navbar";
import Ferramentas from "@/components/Ferramentas";
import Footer from "@/components/Footer";

const FerramentasPage = () => {
  // Initialize scroll tracking for analytics
  const cleanup = useScrollTracking();
  
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Ferramentas />
      </main>
      <Footer />
    </div>
  );
};

export default FerramentasPage;
