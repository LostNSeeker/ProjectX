"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface SafeImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  fill?: boolean;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  objectPosition?: string;
}

/**
 * Safe wrapper around Next.js Image component that handles webpack errors
 * by ensuring it only renders on the client side
 */
export function SafeImage({
  src,
  alt,
  width,
  height,
  className,
  style,
  priority = false,
  fill = false,
  objectFit = "cover",
  objectPosition = "center",
}: SafeImageProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || typeof window === 'undefined') {
    // Return a placeholder during SSR
    return (
      <div
        className={className}
        style={{
          width: fill ? "100%" : width,
          height: fill ? "100%" : height,
          backgroundColor: "rgba(0,0,0,0.1)",
          ...style,
        }}
      />
    );
  }

  // Only render Image component on client after mount
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        style={{
          objectFit,
          objectPosition,
          ...style,
        }}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{
        objectFit,
        objectPosition,
        ...style,
      }}
      priority={priority}
    />
  );
}

