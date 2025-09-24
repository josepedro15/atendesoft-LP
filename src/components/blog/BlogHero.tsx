import { useState } from 'react';
import { Search } from 'lucide-react';

interface BlogHeroProps {
  title: string;
  subtitle: string;
  searchValue?: string;
  onSearch?: (search: string) => void;
}

const BlogHero = ({ title, subtitle, searchValue = '', onSearch }: BlogHeroProps) => {
  const [search, setSearch] = useState(searchValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && search.trim()) {
      onSearch(search.trim());
    }
  };

  return (
    <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {title}
          </h1>
          <p className="text-xl opacity-90 mb-8 leading-relaxed">
            {subtitle}
          </p>
          
          {/* Barra de Busca */}
          {onSearch && (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar artigos..."
                  className="w-full px-6 py-4 pr-12 text-gray-900 rounded-lg border-0 focus:ring-2 focus:ring-white/20 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
