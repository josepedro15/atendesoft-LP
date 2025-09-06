import { useState, useEffect } from 'react';

export const useMobileOptimization = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const isMobileDevice = width <= 768;
      setIsMobile(isMobileDevice);

      // Detectar dispositivos de baixo desempenho
      const isLowEnd = 
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) || // CPU cores
        /Android [1-4]|iPhone OS [1-9]_|iPad.*OS [1-9]_/.test(navigator.userAgent); // Versões antigas
      
      setIsLowEndDevice(isLowEnd);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return {
    isMobile,
    isLowEndDevice,
    shouldReduceAnimations: isMobile || isLowEndDevice,
    particleCount: isMobile ? 3 : 8,
    animationDuration: isMobile ? 0.3 : 0.5,
    blurIntensity: isMobile ? 5 : 10
  };
};
