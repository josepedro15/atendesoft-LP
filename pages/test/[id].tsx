// Teste de rota dinâmica simples
import { useRouter } from 'next/router';

export default function TestPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">ID: {id || 'Carregando...'}</h1>
        <p className="text-lg">Rota dinâmica funcionando!</p>
      </div>
    </div>
  );
}