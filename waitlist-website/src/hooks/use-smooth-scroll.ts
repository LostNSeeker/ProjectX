'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface UseSmoothScrollOptions {
  delay?: number;
  duration?: number;
  ease?: string;
  stagger?: number;
}

export function useSmoothScroll(options: UseSmoothScrollOptions = {}) {
  const ref = useRef<HTMLElement>(null);
  const [isClient, setIsClient] = useState(false);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && isInView && ref.current) {
      // Add smooth reveal animation
      ref.current.style.opacity = '1';
      ref.current.style.transform = 'translateY(0)';
    }
  }, [isClient, isInView]);

  return { ref, isInView };
}

export function useSmoothReveal(options: UseSmoothScrollOptions = {}) {
  const ref = useRef<HTMLElement>(null);
  const [isClient, setIsClient] = useState(false);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && isInView && ref.current) {
      const element = ref.current;
      
      // Set initial state
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = `opacity ${options.duration || 0.6}s ease-out, transform ${options.duration || 0.6}s ease-out`;
      
      // Trigger animation
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, options.delay || 0);
    }
  }, [isClient, isInView, options.delay, options.duration]);

  return { ref, isInView };
}

export function useSmoothStagger(options: UseSmoothScrollOptions = {}) {
  const containerRef = useRef<HTMLElement>(null);
  const [isClient, setIsClient] = useState(false);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && isInView && containerRef.current) {
      const children = containerRef.current.querySelectorAll('[data-stagger]');
      
      children.forEach((child, index) => {
        const element = child as HTMLElement;
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.6s ease-out, transform 0.6s ease-out`;
        
        setTimeout(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, (options.stagger || 100) * index);
      });
    }
  }, [isClient, isInView, options.stagger]);

  return { ref: containerRef, isInView };
}
