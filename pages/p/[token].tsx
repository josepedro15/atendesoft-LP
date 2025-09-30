import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ProposalVersion } from '@/types/proposals';
import { mockStorage } from '@/lib/mock-storage';

interface PublicProposalPageProps {
  // Removido getServerSideProps - agora usa client-side rendering
}

export default function PublicProposalPage() {
  const router = useRouter();
  const { token } = router.query;
  
  const [version, setVersion] = useState<ProposalVersion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || typeof token !== 'string') return;

    const fetchProposal = async () => {
      try {
        // Para desenvolvimento, usar mock storage
        const allVersions = mockStorage.getVersionsByProposal('prop-example-1');
        const foundVersion = allVersions.find(v => v.public_token === token);
        
        if (!foundVersion) {
          setError('Proposta não encontrada ou expirada');
          return;
        }

        // Buscar a proposta pai
        const proposal = mockStorage.getProposal(foundVersion.proposal_id);
        if (!proposal) {
          setError('Proposta não encontrada');
          return;
        }

        // Verificar se a proposta ainda é válida
        if (proposal.valid_until && new Date(proposal.valid_until) < new Date()) {
          setError('Esta proposta expirou');
          return;
        }

        // Adicionar dados da proposta à versão
        const versionWithProposal = {
          ...foundVersion,
          proposal: {
            ...proposal,
            client_id: proposal.client_id || undefined
          }
        };

        setVersion(versionWithProposal as any);
      } catch (error) {
        console.error('Erro ao carregar proposta:', error);
        setError('Erro interno do servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando proposta...</p>
        </div>
      </div>
    );
  }

  if (error || !version) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Proposta não encontrada</h1>
          <p className="text-muted-foreground mb-6">{error || 'A proposta que você está procurando não existe.'}</p>
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {version.proposal?.title || 'Proposta Comercial'}
            </h1>
            
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: version.snapshot_html }} />
            </div>
            
            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Proposta gerada em {new Date(version.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}