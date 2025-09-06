import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, disabled = false, speed = 5, className = '' }) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block ${disabled ? '' : 'animate-shine'} ${className}`}
      style={{
        background: 'linear-gradient(120deg, transparent 40%, rgba(255, 255, 255, 0.8) 50%, transparent 60%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        animationDuration: animationDuration
      }}
    >
      {text}
    </span>
  );
};

export default ShinyText;
