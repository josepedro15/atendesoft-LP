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
        background: 'linear-gradient(120deg, transparent 30%, rgba(100, 143, 224, 0.9) 50%, transparent 70%)',
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
