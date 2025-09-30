import { useRouter } from 'next/router';

interface SimplePageProps {
  // Removido getServerSideProps - agora usa client-side rendering
}

export default function SimplePage() {
  const router = useRouter();
  const { slug } = router.query;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Página Simples
        </h1>
        <p className="text-muted-foreground mb-6">
          Slug: {slug || 'Nenhum slug fornecido'}
        </p>
        <button 
          onClick={() => router.push('/')}
          className="btn-primary"
        >
          Voltar ao Início
        </button>
      </div>
    </div>
  );
}