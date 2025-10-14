"use client";

import { useEffect, useRef } from "react";

export function CanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Animation variables
    let animationId: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      time += 0.01;
      
      // Create floating particles
      for (let i = 0; i < 50; i++) {
        const x = (canvas.width / 50) * i + Math.sin(time + i) * 20;
        const y = canvas.height / 2 + Math.cos(time * 0.5 + i) * 100;
        const size = Math.sin(time + i) * 2 + 2;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${0.3 + Math.sin(time + i) * 0.2})`;
        ctx.fill();
      }

      // Create wave effect
      ctx.beginPath();
      ctx.strokeStyle = "rgba(139, 92, 246, 0.3)";
      ctx.lineWidth = 2;
      for (let x = 0; x < canvas.width; x += 5) {
        const y = canvas.height / 2 + Math.sin(time + x * 0.01) * 50;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-30"
      style={{ background: "transparent" }}
    />
  );
}
