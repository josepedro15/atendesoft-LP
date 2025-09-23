// Teste de rota dinâmica simples
import { GetServerSideProps } from 'next';

interface TestPageProps {
  id: string;
}

export default function TestPage({ id }: TestPageProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">ID: {id}</h1>
        <p className="text-lg">Rota dinâmica funcionando!</p>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  
  return {
    props: {
      id: id as string
    }
  };
};
