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
    <div className="fixed inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
      {/* Single large circular text fixed in position */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <CircularText
          text="The age of AI isn't ahead of us — we are living it."
          spinDuration={25}
          onHover="speedUp"
          className=""
        />
      </div>
    </div>
  );
};

export default ParallaxBackground;
