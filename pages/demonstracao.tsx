import { useEffect } from "react";
import { useScrollTracking } from "@/lib/events";
import Navbar from "@/components/Navbar";
import Demonstracao from "@/components/Demonstracao";
import Footer from "@/components/Footer";

const DemonstracaoPage = () => {
  // Initialize scroll tracking for analytics
  const cleanup = useScrollTracking();
  
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Demonstracao />
      </main>
      <Footer />
    </div>
  );
};

export default DemonstracaoPage;
