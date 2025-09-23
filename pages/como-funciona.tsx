import { useEffect } from "react";
import { useScrollTracking } from "@/lib/events";
import Navbar from "@/components/Navbar";
import ComoFunciona from "@/components/ComoFunciona";
import Footer from "@/components/Footer";

const ComoFuncionaPage = () => {
  // Initialize scroll tracking for analytics
  const cleanup = useScrollTracking();
  
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <ComoFunciona />
      </main>
      <Footer />
    </div>
  );
};

export default ComoFuncionaPage;
