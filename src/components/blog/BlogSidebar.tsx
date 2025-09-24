import { KeywordStats } from '@/types/blog';
import { Tag, TrendingUp } from 'lucide-react';

interface BlogSidebarProps {
  popularKeywords: KeywordStats[];
}

const BlogSidebar = ({ 
  popularKeywords
}: BlogSidebarProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Keywords Populares */}
      <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center">
          <TrendingUp size={18} className="mr-2 sm:w-5 sm:h-5" />
          Tópicos Populares
        </h3>
        
        {popularKeywords.length > 0 ? (
          <div className="space-y-2">
            {popularKeywords.slice(0, 5).map((item, index) => (
              <div
                key={item.keyword}
                className="w-full text-left p-2 sm:p-3 rounded-lg bg-muted flex items-center justify-between"
              >
                <div className="flex items-center min-w-0 flex-1">
                  <Tag size={14} className="mr-2 flex-shrink-0" />
                  <span className="font-medium text-sm truncate">{item.keyword}</span>
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground ml-2 flex-shrink-0">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            Nenhum tópico disponível no momento.
          </p>
        )}
      </div>

      {/* Newsletter */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-2">
          Fique por dentro
        </h3>
        <p className="text-xs sm:text-sm opacity-90 mb-3 sm:mb-4">
          Receba os melhores artigos sobre automação comercial e IA diretamente no seu email.
        </p>
        <form className="space-y-2 sm:space-y-3">
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
      <div className="bg-muted border border-border rounded-lg p-4 sm:p-6 text-center">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
          Precisa de ajuda?
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
          Nossa equipe está pronta para ajudar você a implementar automação na sua empresa.
        </p>
        <button className="btn-primary w-full text-sm">
          Falar com especialista
        </button>
      </div>
    </div>
  );
};

export default BlogSidebar;
