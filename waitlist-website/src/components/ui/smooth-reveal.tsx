'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useSmoothReveal } from '@/hooks/use-smooth-scroll';

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
  const { ref } = useSmoothReveal({ delay, duration });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getTransform = () => {
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
      className={`${isClient ? 'opacity-0' : 'opacity-100'} ${className}`}
      style={{
        transform: isClient ? getTransform() : 'translateY(0)',
        transition: isClient ? `opacity ${duration}s ease-out, transform ${duration}s ease-out` : 'none',
      }}
    >
      {children}
    </div>
  );
}
