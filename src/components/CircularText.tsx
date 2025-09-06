import { useEffect } from 'react';
import { motion, useAnimation, useMotionValue } from 'motion/react';

const getRotationTransition = (duration: number, from: number, loop = true) => ({
  from,
  to: from + 360,
  ease: 'linear' as const,
  duration,
  type: 'tween' as const,
  repeat: loop ? Infinity : 0
});

const getTransition = (duration: number, from: number) => ({
  rotate: getRotationTransition(duration, from),
  scale: {
    type: 'spring' as const,
    damping: 20,
    stiffness: 300
  }
});

interface CircularTextProps {
  text: string;
  spinDuration?: number;
  onHover?: 'speedUp' | 'slowDown' | 'pause' | 'goBonkers';
  className?: string;
}

const CircularText = ({ text, spinDuration = 20, onHover = 'speedUp', className = '' }: CircularTextProps) => {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotation = useMotionValue(0);

  useEffect(() => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start)
    });
  }, [spinDuration, text, onHover, controls, rotation]);

  const handleHoverStart = () => {
    const start = rotation.get();
    if (!onHover) return;

    let transitionConfig: any;
    let scaleVal = 1;

    switch (onHover) {
      case 'slowDown':
        transitionConfig = getTransition(spinDuration * 2, start);
        break;
      case 'speedUp':
        transitionConfig = getTransition(spinDuration / 4, start);
        break;
      case 'pause':
        transitionConfig = {
          rotate: { type: 'spring' as const, damping: 20, stiffness: 300 },
          scale: { type: 'spring' as const, damping: 20, stiffness: 300 }
        };
        scaleVal = 1;
        break;
      case 'goBonkers':
        transitionConfig = getTransition(spinDuration / 20, start);
        scaleVal = 0.8;
        break;
      default:
        transitionConfig = getTransition(spinDuration, start);
    }

    controls.start({
      rotate: start + 360,
      scale: scaleVal,
      transition: transitionConfig
    });
  };

  const handleHoverEnd = () => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start)
    });
  };

  return (
    <motion.div
      className={`circular-text ${className}`}
      style={{ 
        rotate: rotation,
        position: 'relative',
        display: 'inline-block',
        width: '300000px',
        height: '300000px',
        borderRadius: '50%',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        fontWeight: 600,
        fontSize: '50px',
        letterSpacing: '0.5em',
        textTransform: 'uppercase',
        color: 'rgba(0, 0, 0, 0.4)',
        userSelect: 'none',
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: 1
      }}
      initial={{ rotate: 0 }}
      animate={controls}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {letters.map((letter, i) => {
        const rotationDeg = (360 / letters.length) * i;
        const factor = Math.PI / letters.length;
        const x = factor * i;
        const y = factor * i;
        const transform = `rotateZ(${rotationDeg}deg) translate3d(${x}px, ${y}px, 0)`;

        return (
          <span 
            key={i} 
            style={{ 
              transform, 
              WebkitTransform: transform,
              position: 'absolute',
              top: '50%',
              left: '50%',
              transformOrigin: '0 0',
              display: 'block',
              whiteSpace: 'nowrap',
              willChange: 'transform'
            }}
          >
            {letter}
          </span>
        );
        })}
      </motion.div>
  );
};

export default CircularText;
