"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShaderAnimation } from "@/components/ui/shader-animation";

export default function ProcessingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/thank-you?returnTo=/?skipIntro=true");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full h-full">
        <ShaderAnimation />
      </div>
    </main>
  );
}


