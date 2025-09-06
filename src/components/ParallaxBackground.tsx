import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import CircularText from './CircularText';

const ParallaxBackground = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Multiple circular texts with different parallax speeds */}
      <motion.div
        className="absolute top-1/4 left-1/4"
        style={{
          y: scrollY * 0.2,
          x: scrollY * 0.1,
        }}
      >
        <CircularText
          text="The age of AI isn't ahead of us — we are living it."
          spinDuration={30}
          onHover="speedUp"
          className="opacity-20"
        />
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-1/4"
        style={{
          y: scrollY * -0.15,
          x: scrollY * -0.05,
        }}
      >
        <CircularText
          text="The age of AI isn't ahead of us — we are living it."
          spinDuration={25}
          onHover="slowDown"
          className="opacity-15 scale-75"
        />
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 left-1/3"
        style={{
          y: scrollY * 0.3,
          x: scrollY * 0.08,
        }}
      >
        <CircularText
          text="The age of AI isn't ahead of us — we are living it."
          spinDuration={35}
          onHover="goBonkers"
          className="opacity-10 scale-50"
        />
      </motion.div>

      <motion.div
        className="absolute top-2/3 right-1/3"
        style={{
          y: scrollY * -0.25,
          x: scrollY * -0.12,
        }}
      >
        <CircularText
          text="The age of AI isn't ahead of us — we are living it."
          spinDuration={28}
          onHover="pause"
          className="opacity-12 scale-90"
        />
      </motion.div>

      {/* Additional smaller elements for depth */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          y: scrollY * 0.1,
          x: scrollY * 0.05,
        }}
      >
        <CircularText
          text="AI*FUTURE*NOW*"
          spinDuration={40}
          onHover="speedUp"
          className="opacity-8 scale-60"
        />
      </motion.div>
    </div>
  );
};

export default ParallaxBackground;
