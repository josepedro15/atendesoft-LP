import { useEffect } from "react";
import { useScrollTracking } from "@/lib/events";
import Navbar from "@/components/Navbar";
import Cases from "@/components/Cases";
import Footer from "@/components/Footer";

const CasesPage = () => {
  // Initialize scroll tracking for analytics
  const cleanup = useScrollTracking();
  
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Cases />
      </main>
      <Footer />
    </div>
  );
};

export default CasesPage;
