import { motion } from "motion/react";
import Image from "next/image";

interface ProfileHeaderProps {
  name: string;
  description: string;
  avatar: string;
}

const ProfileHeader = ({ name, description, avatar }: ProfileHeaderProps) => {
  return (
    <motion.div 
      className="text-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Avatar */}
      <motion.div 
        className="mx-auto mb-4 w-20 h-20 rounded-full overflow-hidden bg-white shadow-lg"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <Image
          src={avatar}
          alt={name}
          width={80}
          height={80}
          className="w-full h-full object-contain p-2"
        />
      </motion.div>

      {/* Name */}
      <motion.h1 
        className="text-2xl font-bold text-foreground mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {name}
      </motion.h1>

      {/* Description */}
      <motion.p 
        className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
};

export default ProfileHeader;
