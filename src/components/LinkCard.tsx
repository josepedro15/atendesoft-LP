import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { events } from "@/lib/events";

interface LinkCardProps {
  id: string;
  title: string;
  description?: string;
  url: string;
  icon: LucideIcon;
  color: string;
  isExternal: boolean;
  category: 'primary' | 'secondary';
}

const LinkCard = ({ 
  id, 
  title, 
  description, 
  url, 
  icon: Icon, 
  color, 
  isExternal, 
  category 
}: LinkCardProps) => {
  const handleClick = () => {
    // Analytics
    events.linktreeClick(id, category);
    
    if (isExternal) {
      window.open(url, "_blank");
    } else {
      window.location.href = url;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-primary hover:bg-primary/90 text-primary-foreground';
      case 'success':
        return 'bg-success hover:bg-success/90 text-success-foreground';
      case 'accent':
        return 'bg-accent hover:bg-accent/90 text-accent-foreground border border-border';
      case 'muted':
        return 'bg-muted hover:bg-muted/90 text-muted-foreground border border-border';
      default:
        return 'bg-primary hover:bg-primary/90 text-primary-foreground';
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`
        w-full p-4 rounded-xl transition-all duration-300 
        focus:outline-none focus:ring-2 focus:ring-primary/20
        ${getColorClasses(color)}
        ${category === 'primary' ? 'shadow-lg hover:shadow-xl' : 'shadow-md hover:shadow-lg'}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <Icon size={24} />
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-lg">{title}</h3>
          {description && (
            <p className="text-sm opacity-90 mt-1">{description}</p>
          )}
        </div>
        {isExternal && (
          <div className="flex-shrink-0">
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="opacity-70"
            >
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </div>
        )}
      </div>
    </motion.button>
  );
};

export default LinkCard;
