// Página de teste para verificar se rotas dinâmicas funcionam
import { GetStaticProps } from 'next';

interface TestPageProps {
  message: string;
}

export default function TestPage({ message }: TestPageProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Teste de Rota</h1>
        <p className="text-lg">{message}</p>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      message: 'Rota dinâmica funcionando!'
    }
  };
};