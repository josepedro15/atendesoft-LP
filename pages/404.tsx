import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const Custom404 = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Página não encontrada
          </h2>
          <p className="text-muted-foreground">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => router.push("/")}
            className="flex items-center space-x-2"
          >
            <Home size={18} />
            <span>Ir para o início</span>
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft size={18} />
            <span>Voltar</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Custom404;
