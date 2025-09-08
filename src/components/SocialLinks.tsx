import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface SocialLink {
  id: string;
  title: string;
  url: string;
  icon: LucideIcon;
  color: string;
}

interface SocialLinksProps {
  social: SocialLink[];
}

const SocialLinks = ({ social }: SocialLinksProps) => {
  const handleClick = (id: string, url: string) => {
    window.open(url, "_blank");
  };

  return (
    <motion.div 
      className="flex justify-center space-x-4 mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      {social.map((link, index) => {
        const Icon = link.icon;
        return (
          <motion.button
            key={link.id}
            onClick={() => handleClick(link.id, link.url)}
            className="w-12 h-12 rounded-full bg-muted hover:bg-primary transition-colors duration-300 flex items-center justify-center text-muted-foreground hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
          >
            <Icon size={20} />
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default SocialLinks;
