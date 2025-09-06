
import MagicBento from "./MagicBento";

const Manifesto = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center relative">
          <MagicBento 
            className="absolute inset-0 bg-white/50 backdrop-blur-xl border border-white/50 rounded-3xl -m-8 p-8 shadow-2xl"
            enableStars={true}
            enableTilt={true}
            clickEffect={true}
            enableMagnetism={true}
            enableBorderGlow={true}
          >
            <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-primary mb-12 leading-relaxed">
              Acreditamos que a{" "}
              <span className="font-bold text-primary">
                Inteligência Artificial
              </span>{" "}
              deve ser acessível e transformar negócios de todos os tamanhos
            </h2>
            
            <div className="space-y-8 text-lg text-primary leading-relaxed">
              <p>
                Não importa se você é uma startup ou uma grande corporação. 
                Cada negócio merece ter acesso às tecnologias que podem 
                revolucionar sua forma de trabalhar e crescer.
              </p>
              
              <p>
                Nossa missão é democratizar a IA, criando soluções que não apenas 
                automatizam processos, mas que realmente <strong className="text-primary">entendem</strong> e 
                se adaptam ao seu negócio único.
              </p>
              
              <p>
                Porque acreditamos que o futuro não é sobre substituir pessoas, 
                mas sobre <strong className="text-primary">potencializar</strong> equipes para 
                alcançarem resultados extraordinários.
              </p>
            </div>
            </div>
          </MagicBento>

          <div className="mt-12 glass-card p-8 max-w-2xl mx-auto">
            <p className="text-xl font-semibold text-foreground mb-4">
              &quot;A melhor IA é aquela que você nem percebe que está lá&quot;
            </p>
            <p className="text-muted-foreground">
              — Equipe AtendeSoft
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Manifesto;