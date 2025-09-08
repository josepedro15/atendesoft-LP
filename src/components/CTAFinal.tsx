import { MessageCircle, ArrowRight } from "lucide-react";
import { events } from "@/lib/events";
import CurvedLoop from "./CurvedLoop";

const CTAFinal = () => {
  const handleWhatsAppClick = () => {
    events.ctaWhatsappClick("final-cta");
    window.open("https://wa.me/5511999999999?text=Estou%20pronto%20para%20vender%20com%20IA!", "_blank");
  };

  return (
    <section className="py-20 bg-foreground relative overflow-hidden">

      {/* CurvedLoop Animation */}
      <div className="relative z-10 overflow-hidden">
        <CurvedLoop 
          marqueeText="O futuro não é amanhã — é IA hoje."
          speed={1}
          curveAmount={300}
          direction="left"
          interactive={true}
          className="text-white"
        />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent/20 rounded-full blur-xl"></div>
    </section>
  );
};

export default CTAFinal;