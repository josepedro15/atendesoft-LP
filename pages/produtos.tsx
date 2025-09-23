import { useEffect } from "react";
import { useScrollTracking } from "@/lib/events";
import Navbar from "@/components/Navbar";
import Produtos from "@/components/Produtos";
import Footer from "@/components/Footer";

const ProdutosPage = () => {
  // Initialize scroll tracking for analytics
  const cleanup = useScrollTracking();
  
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Produtos />
      </main>
      <Footer />
    </div>
  );
};

export default ProdutosPage;
