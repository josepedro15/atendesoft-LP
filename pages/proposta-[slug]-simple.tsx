// Versão simplificada para testar a rota dinâmica
import { GetServerSideProps } from 'next';

interface SimplePageProps {
  slug: string;
}

export default function SimplePage({ slug }: SimplePageProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Proposta: {slug}</h1>
        <p className="text-lg">Esta é uma versão simplificada para testar a rota dinâmica.</p>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;
  
  console.log('Slug recebido:', slug);
  
  return {
    props: {
      slug: slug as string
    }
  };
};
