import { useEffect } from "react";
import { useScrollTracking } from "@/lib/events";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Beneficios from "@/components/Beneficios";
import ComoFunciona from "@/components/ComoFunciona";
import Produtos from "@/components/Produtos";
import DashboardsBI from "@/components/DashboardsBI";
import Ferramentas from "@/components/Ferramentas";
import Demonstracao from "@/components/Demonstracao";
import Cases from "@/components/Cases";
import Planos from "@/components/Planos";
import Manifesto from "@/components/Manifesto";
import FAQ from "@/components/FAQ";
import CTAFinal from "@/components/CTAFinal";
import Footer from "@/components/Footer";

const Home = () => {
  // Initialize scroll tracking for analytics
  const cleanup = useScrollTracking();
  
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Beneficios />
        <ComoFunciona />
        <Produtos />
        <DashboardsBI />
        <Ferramentas />
        <Demonstracao />
        <Cases />
        <Planos />
        <Manifesto />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
