import { useMemo } from 'react';
import { createElement } from 'react';

interface ProcessedContentProps {
  content: string;
}

export const useProcessedContent = ({ content }: ProcessedContentProps) => {
  return useMemo(() => {
    // Criar um elemento temporário para parsear o HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    // Encontrar todas as imagens
    const images = tempDiv.querySelectorAll('img');
    
    if (images.length === 0) {
      return content; // Se não há imagens, retornar conteúdo original
    }

    // Processar cada imagem
    images.forEach((img, index) => {
      const src = img.getAttribute('src') || '';
      const alt = img.getAttribute('alt') || '';
      const width = parseInt(img.getAttribute('width') || '800');
      const height = parseInt(img.getAttribute('height') || '450');
      
      // Criar um placeholder único para substituir
      const placeholder = `__POST_IMAGE_${index}__`;
      
      // Substituir a tag img pelo placeholder
      img.outerHTML = placeholder;
    });

    // Retornar o HTML processado com placeholders
    return tempDiv.innerHTML;
  }, [content]);
};

// Função para renderizar o conteúdo processado
export const renderProcessedContent = (processedContent: string, originalContent: string) => {
  // Encontrar todas as imagens no conteúdo original
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = originalContent;
  const images = tempDiv.querySelectorAll('img');
  
  if (images.length === 0) {
    return processedContent;
  }

  // Substituir placeholders pelas imagens processadas
  let result = processedContent;
  
  images.forEach((img, index) => {
    const src = img.getAttribute('src') || '';
    const alt = img.getAttribute('alt') || '';
    const width = parseInt(img.getAttribute('width') || '800');
    const height = parseInt(img.getAttribute('height') || '450');
    
    const placeholder = `__POST_IMAGE_${index}__`;
    
    // Criar o componente PostImageCard como string HTML
    const imageCardHTML = `
      <div class="post-image-card relative w-full max-w-4xl mx-auto my-6 overflow-hidden bg-muted/20 rounded-xl border border-border/50">
        <div class="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
          <img 
            src="${src}" 
            alt="${alt}" 
            width="${width}" 
            height="${height}"
            class="w-full h-full object-cover object-center cursor-pointer transition-transform duration-300 hover:scale-105"
            style="max-width: 100%; max-height: 100%; object-fit: cover; object-position: center;"
          />
          <div class="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
            <button class="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110" onclick="this.closest('.post-image-card').querySelector('img').click()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
              </svg>
            </button>
          </div>
        </div>
        ${alt ? `
          <div class="p-4 bg-muted/30 border-t border-border/30">
            <p class="text-sm text-muted-foreground text-center italic">${alt}</p>
          </div>
        ` : ''}
      </div>
    `;
    
    result = result.replace(placeholder, imageCardHTML);
  });
  
  return result;
};
