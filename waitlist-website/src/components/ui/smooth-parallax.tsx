'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface SmoothParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  direction?: 'up' | 'down';
}

export function SmoothParallax({ 
  children, 
  speed = 0.5, 
  className = '',
  direction = 'up'
}: SmoothParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const isInView = useInView(ref, { once: false, margin: '-200px' });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      if (!isInView) return;
      
      const rect = element.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;
      
      const transform = direction === 'up' 
        ? `translateY(${rate}px)` 
        : `translateY(${-rate}px)`;
      
      element.style.transform = transform;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isClient, speed, direction, isInView]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
