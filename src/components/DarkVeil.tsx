import { useRef, useEffect } from 'react';

type Props = {
  hueShift?: number;
  noiseIntensity?: number;
  scanlineIntensity?: number;
  speed?: number;
  scanlineFrequency?: number;
  warpAmount?: number;
  resolutionScale?: number;
};

export default function DarkVeil({
  hueShift = 0,
  noiseIntensity = 0,
  scanlineIntensity = 0,
  speed = 0.5,
  scanlineFrequency = 0,
  warpAmount = 0,
  resolutionScale = 1
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let animationId: number;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * resolutionScale;
      canvas.height = rect.height * resolutionScale;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    const draw = (time: number) => {
      const { width, height } = canvas;
      const t = time * 0.001 * speed;

      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // Create gradient effect
      const gradient = ctx.createRadialGradient(
        width * 0.5 + Math.sin(t) * 50,
        height * 0.5 + Math.cos(t) * 50,
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.8
      );

      // Use site colors with hue shift
      const hue = (220 + hueShift) % 360;
      gradient.addColorStop(0, `hsla(${hue}, 60%, 40%, 0.8)`);
      gradient.addColorStop(0.3, `hsla(${hue + 20}, 50%, 30%, 0.6)`);
      gradient.addColorStop(0.6, `hsla(${hue + 40}, 40%, 20%, 0.4)`);
      gradient.addColorStop(1, 'hsla(0, 0%, 0%, 0.1)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Add noise
      if (noiseIntensity > 0) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const noise = (Math.random() - 0.5) * noiseIntensity * 255;
          data[i] = Math.max(0, Math.min(255, data[i] + noise));     // R
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
        }
        
        ctx.putImageData(imageData, 0, 0);
      }

      // Add scanlines
      if (scanlineIntensity > 0) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${scanlineIntensity * 0.1})`;
        ctx.lineWidth = 1;
        
        for (let y = 0; y < height; y += scanlineFrequency || 4) {
          const alpha = Math.sin(y * 0.01 + t) * 0.5 + 0.5;
          ctx.globalAlpha = alpha * scanlineIntensity;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
        
        ctx.globalAlpha = 1;
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw(0);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [hueShift, noiseIntensity, scanlineIntensity, speed, scanlineFrequency, warpAmount, resolutionScale]);

  return <canvas ref={ref} className="w-full h-full block" />;
}
