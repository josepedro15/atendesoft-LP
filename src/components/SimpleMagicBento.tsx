import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface SimpleMagicBentoProps {
  children: React.ReactNode;
  className?: string;
  enableStars?: boolean;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
  enableBorderGlow?: boolean;
}

const SimpleMagicBento: React.FC<SimpleMagicBentoProps> = ({
  children,
  className = '',
  enableStars = true,
  enableTilt = true,
  clickEffect = true,
  enableMagnetism = true,
  enableBorderGlow = true
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !cardRef.current) return;

    const element = cardRef.current;
    let particles: HTMLDivElement[] = [];

    const createParticle = (x: number, y: number) => {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(100, 143, 224, 0.9);
        box-shadow: 0 0 15px rgba(100, 143, 224, 0.8);
        pointer-events: none;
        z-index: 1000;
        left: ${x}px;
        top: ${y}px;
      `;
      return particle;
    };

    const clearParticles = () => {
      particles.forEach(particle => {
        gsap.to(particle, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          onComplete: () => particle.remove()
        });
      });
      particles = [];
    };

    const handleMouseEnter = () => {
      console.log('Mouse entered card');
      
      if (enableStars) {
        // Create particles immediately
        for (let i = 0; i < 6; i++) {
          const x = Math.random() * (element.offsetWidth || 200);
          const y = Math.random() * (element.offsetHeight || 200);
          const particle = createParticle(x, y);
          element.appendChild(particle);
          particles.push(particle);

          gsap.fromTo(particle, 
            { scale: 0, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
          );

          gsap.to(particle, {
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            rotation: Math.random() * 360,
            duration: 2 + Math.random(),
            ease: 'none',
            repeat: -1,
            yoyo: true
          });
        }
      }

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }
    };

    const handleMouseLeave = () => {
      console.log('Mouse left card');
      clearParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;

        gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(100, 143, 224, 0.4) 0%, rgba(100, 143, 224, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;

      element.appendChild(ripple);

      gsap.fromTo(ripple, { scale: 0, opacity: 1 }, {
        scale: 1,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => ripple.remove()
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearParticles();
    };
  }, [isClient, enableStars, enableTilt, clickEffect, enableMagnetism]);

  if (!isClient) {
    return <div className={className}>{children}</div>;
  }

  return (
    <>
      <style>
        {`
          .simple-magic-bento {
            --glow-color: 100, 143, 224;
            position: relative;
            overflow: hidden;
          }
          
          .simple-magic-bento--border-glow::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 2px;
            background: radial-gradient(200px circle at 50% 50%,
                rgba(var(--glow-color), 0.6) 0%,
                rgba(var(--glow-color), 0.3) 30%,
                transparent 60%);
            border-radius: inherit;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: subtract;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1;
            opacity: 0;
          }
          
          .simple-magic-bento--border-glow:hover::after {
            opacity: 1;
          }
          
          .simple-magic-bento--border-glow:hover {
            box-shadow: 0 8px 30px rgba(100, 143, 224, 0.3), 0 0 50px rgba(var(--glow-color), 0.2);
          }
        `}
      </style>
      
      <div
        ref={cardRef}
        className={`simple-magic-bento ${enableBorderGlow ? 'simple-magic-bento--border-glow' : ''} ${className}`}
      >
        {children}
      </div>
    </>
  );
};

export default SimpleMagicBento;
