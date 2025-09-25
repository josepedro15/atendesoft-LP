import Image from 'next/image';
import { useState } from 'react';
import { Expand, X } from 'lucide-react';

interface PostImageCardProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

const PostImageCard = ({ 
  src, 
  alt, 
  width = 800, 
  height = 450, 
  className = '' 
}: PostImageCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleClose = () => {
    setIsExpanded(false);
  };

  return (
    <>
      {/* Container da imagem com containment rígido */}
      <div className={`post-image-card relative w-full max-w-4xl mx-auto my-6 overflow-hidden bg-muted/20 rounded-xl border border-border/50 ${className}`}>
        {/* Container da imagem - altura controlada */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-full object-cover object-center cursor-pointer transition-transform duration-300 hover:scale-105"
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
            onClick={handleExpand}
            priority={false}
          />
          
          {/* Overlay com botão de expandir */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
            <button
              onClick={handleExpand}
              className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Expandir imagem"
            >
              <Expand size={20} />
            </button>
          </div>
        </div>

        {/* Legenda da imagem (se houver) */}
        {alt && (
          <div className="p-4 bg-muted/30 border-t border-border/30">
            <p className="text-sm text-muted-foreground text-center italic">
              {alt}
            </p>
          </div>
        )}
      </div>

      {/* Modal de expansão */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <div className="relative max-w-7xl max-h-full">
            {/* Botão de fechar */}
            <button
              onClick={handleClose}
              className="absolute -top-12 right-0 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
              aria-label="Fechar imagem"
            >
              <X size={20} />
            </button>

            {/* Imagem expandida */}
            <div className="relative max-w-full max-h-[90vh] overflow-hidden rounded-lg">
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="w-full h-full object-contain"
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '90vh',
                  objectFit: 'contain'
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Legenda no modal */}
            {alt && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 rounded-b-lg">
                <p className="text-sm text-center">
                  {alt}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PostImageCard;
