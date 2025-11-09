"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { ClientLoader } from "@/components/ui/client-loader";

// Dynamically import ShaderAnimation with no SSR
const ShaderAnimation = dynamic(
  () => import("@/components/ui/shader-animation").then((mod) => mod.ShaderAnimation),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading animation...</div>
      </div>
    ),
  }
);

export default function ProcessingPage() {
  useEffect(() => {
    // Redirect after 5 seconds
    const timer = setTimeout(() => {
      // Use window.location to avoid webpack issues
      window.location.href = "/thank-you?returnTo=/?skipIntro=true";
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <ClientLoader>
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-full h-full">
          <ShaderAnimation />
        </div>
      </main>
    </ClientLoader>
  );
}


