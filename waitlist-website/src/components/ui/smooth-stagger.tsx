'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useSmoothStagger } from '@/hooks/use-smooth-scroll';

interface SmoothStaggerProps {
  children: ReactNode;
  stagger?: number;
  className?: string;
}

export function SmoothStagger({ 
  children, 
  stagger = 100, 
  className = ''
}: SmoothStaggerProps) {
  const { ref } = useSmoothStagger({ stagger });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div 
      data-stagger 
      className={`${isClient ? 'opacity-0' : 'opacity-100'} ${className}`}
      style={{
        transform: isClient ? 'translateY(20px)' : 'translateY(0)',
        transition: isClient ? 'opacity 0.6s ease-out, transform 0.6s ease-out' : 'none',
      }}
    >
      {children}
    </div>
  );
}
