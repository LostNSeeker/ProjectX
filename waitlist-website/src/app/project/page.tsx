"use client";

import { useSearchParams, useRouter } from "next/navigation";
import ScrollExpandMedia from "@/components/blocks/scroll-expansion-hero";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ProjectPage() {
  const params = useSearchParams();
  const router = useRouter();
  const image = params.get("image") || "https://images.unsplash.com/photo-1682687982501-1e58ab814714?q=80&w=1280&auto=format&fit=crop";
  const bg = params.get("bg") || image;
  const title = params.get("title") || "Project Showcase";
  const date = params.get("subtitle") || "Scroll Experience";
  const returnTo = params.get("returnTo") || "/";

  const handleBack = () => {
    router.push(returnTo);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button 
          onClick={handleBack}
          variant="outline"
          className="bg-black/50 backdrop-blur-md border-white/20 text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>

      <ScrollExpandMedia
        mediaType="image"
        mediaSrc={image}
        bgImageSrc={bg}
        title={title}
        date={date}
        scrollToExpand="Scroll to Expand"
        textBlend
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">About This Project</h2>
          <p className="text-lg mb-8 text-gray-200">
            This page showcases the selected project image with a scroll-to-expand
            immersive effect.
          </p>
        </div>
      </ScrollExpandMedia>
    </main>
  );
}





