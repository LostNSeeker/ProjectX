'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface SmoothRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function SmoothReveal({ 
  children, 
  delay = 0, 
  duration = 0.6, 
  className = '',
  direction = 'up'
}: SmoothRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && isInView) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isClient, isInView, delay]);

  const getInitialTransform = () => {
    switch (direction) {
      case 'up': return 'translateY(30px)';
      case 'down': return 'translateY(-30px)';
      case 'left': return 'translateX(30px)';
      case 'right': return 'translateX(-30px)';
      default: return 'translateY(30px)';
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) translateX(0)' : getInitialTransform(),
        transition: isClient ? `opacity ${duration}s ease-out, transform ${duration}s ease-out` : 'none',
        willChange: isClient ? 'opacity, transform' : 'auto',
      }}
    >
      {children}
    </div>
  );
}
