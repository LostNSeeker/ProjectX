"use client";

import { useEffect, useState, ReactNode } from "react";

/**
 * ClientLoader ensures components only render on the client side
 * This prevents webpack from analyzing modules during SSR
 */
export function ClientLoader({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || typeof window === 'undefined') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}

