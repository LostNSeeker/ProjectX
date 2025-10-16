"use client";

import { useSearchParams } from "next/navigation";
import ScrollExpandMedia from "@/components/blocks/scroll-expansion-hero";

export default function ProjectPage() {
  const params = useSearchParams();
  const image = params.get("image") || "https://images.unsplash.com/photo-1682687982501-1e58ab814714?q=80&w=1280&auto=format&fit=crop";
  const bg = params.get("bg") || image;
  const title = params.get("title") || "Project Showcase";
  const date = params.get("subtitle") || "Scroll Experience";

  return (
    <main className="min-h-screen bg-black text-white">
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



