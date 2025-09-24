import { KeywordStats } from '@/types/blog';
import { Tag, TrendingUp } from 'lucide-react';

interface BlogSidebarProps {
  popularKeywords: KeywordStats[];
  onKeywordClick?: (keyword: string) => void;
  activeKeyword?: string;
}

const BlogSidebar = ({ 
  popularKeywords, 
  onKeywordClick, 
  activeKeyword 
}: BlogSidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Keywords Populares */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <TrendingUp size={20} className="mr-2" />
          Tópicos Populares
        </h3>
        
        {popularKeywords.length > 0 ? (
          <div className="space-y-2">
            {popularKeywords.map((item, index) => (
              <button
                key={item.keyword}
                onClick={() => onKeywordClick?.(item.keyword)}
                className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
                  activeKeyword === item.keyword
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                <div className="flex items-center">
                  <Tag size={16} className="mr-2" />
                  <span className="font-medium">{item.keyword}</span>
                </div>
                <span className={`text-sm ${
                  activeKeyword === item.keyword 
                    ? 'text-primary-foreground/70' 
                    : 'text-muted-foreground'
                }`}>
                  {item.count}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            Nenhum tópico disponível no momento.
          </p>
        )}
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">
          Fique por dentro
        </h3>
        <p className="text-sm opacity-90 mb-4">
          Receba os melhores artigos sobre automação comercial e IA diretamente no seu email.
        </p>
        <form className="space-y-3">
          <input
            type="email"
            placeholder="Seu email"
            className="w-full px-3 py-2 rounded text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
          />
          <button
            type="submit"
            className="w-full bg-white text-primary font-medium py-2 rounded text-sm hover:bg-white/90 transition-colors"
          >
            Inscrever-se
          </button>
        </form>
      </div>

      {/* CTA */}
      <div className="bg-muted border border-border rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Precisa de ajuda?
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Nossa equipe está pronta para ajudar você a implementar automação na sua empresa.
        </p>
        <button className="btn-primary w-full">
          Falar com especialista
        </button>
      </div>
    </div>
  );
};

export default BlogSidebar;
