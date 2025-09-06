import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import CircularText from './CircularText';
import DarkVeil from './DarkVeil';

const ParallaxBackground = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* DarkVeil background effect with site colors */}
      <div className="absolute inset-0 opacity-40">
        <DarkVeil
          hueShift={0} // Blue hue to match primary color #648fe0
          noiseIntensity={0.05}
          scanlineIntensity={0.2}
          speed={0.5}
          scanlineFrequency={3}
          warpAmount={0.1}
          resolutionScale={1}
        />
      </div>
      
      {/* Single large circular text fixed in position */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <CircularText
          text="THE AGE OF AI ISN'T AHEAD OF US — WE ARE LIVING IT."
          spinDuration={50}
          onHover="speedUp"
          className=""
        />
      </div>
    </div>
  );
};

export default ParallaxBackground;