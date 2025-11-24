import React, { useEffect, useRef } from 'react';

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    const particles: { 
      x: number; 
      y: number; 
      dx: number; 
      dy: number; 
      size: number; 
      alpha: number;
      pulseSpeed: number; 
    }[] = [];

    for (let i = 0; i < 80; i++) { // Increased count slightly
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 0.5, // Faster movement
        dy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1, // Larger size (1px to 4px)
        alpha: Math.random() * 0.5 + 0.2, // Random starting opacity
        pulseSpeed: Math.random() * 0.02 + 0.005 // Random twinkling speed
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        // Move
        p.x += p.dx;
        p.y += p.dy;
        
        // Wrap around screen
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        // Twinkle (Pulse opacity)
        p.alpha += p.pulseSpeed;
        if (p.alpha >= 0.8 || p.alpha <= 0.2) p.pulseSpeed *= -1;

        // Draw with vibrant cyan-blue tint
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 200, 255, ${p.alpha})`; // Vibrant Blue/Cyan
        ctx.shadowBlur = 10; // Glow effect
        ctx.shadowColor = "rgba(100, 200, 255, 0.8)";
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow for performance
      });
      requestAnimationFrame(animate);
    };
    animate();
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};