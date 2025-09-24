import { useState } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Link, Check } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
  description: string;
}

const ShareButtons = ({ title, url, description }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  const handleShare = async (platform: string) => {
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Erro ao copiar link:', err);
      }
    } else if (platform === 'native') {
      if (navigator.share) {
        try {
          await navigator.share({
            title,
            text: description,
            url,
          });
        } catch (err) {
          console.error('Erro ao compartilhar:', err);
        }
      }
    } else {
      window.open(shareLinks[platform as keyof typeof shareLinks], '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm font-medium text-muted-foreground">Compartilhar:</span>
      
      <div className="flex items-center space-x-2">
        {/* Facebook */}
        <button
          onClick={() => handleShare('facebook')}
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          aria-label="Compartilhar no Facebook"
        >
          <Facebook size={16} />
        </button>

        {/* Twitter */}
        <button
          onClick={() => handleShare('twitter')}
          className="p-2 rounded-full bg-blue-400 text-white hover:bg-blue-500 transition-colors"
          aria-label="Compartilhar no Twitter"
        >
          <Twitter size={16} />
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => handleShare('linkedin')}
          className="p-2 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors"
          aria-label="Compartilhar no LinkedIn"
        >
          <Linkedin size={16} />
        </button>

        {/* Copiar Link */}
        <button
          onClick={() => handleShare('copy')}
          className={`p-2 rounded-full transition-colors ${
            copied 
              ? 'bg-green-600 text-white' 
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
          aria-label="Copiar link"
        >
          {copied ? <Check size={16} /> : <Link size={16} />}
        </button>

        {/* Compartilhamento Nativo (Mobile) */}
        {typeof window !== 'undefined' && 'share' in navigator && (
          <button
            onClick={() => handleShare('native')}
            className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            aria-label="Compartilhar"
          >
            <Share2 size={16} />
          </button>
        )}
      </div>

      {copied && (
        <span className="text-sm text-green-600 font-medium">
          Link copiado!
        </span>
      )}
    </div>
  );
};

export default ShareButtons;
