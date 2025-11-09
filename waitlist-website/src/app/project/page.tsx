"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ClientLoader } from "@/components/ui/client-loader";

// Dynamically import ScrollExpandMedia with no SSR
const ScrollExpandMedia = dynamic(
  () => import("@/components/blocks/scroll-expansion-hero"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading project...</div>
      </div>
    ),
  }
);

function ProjectPageContent() {
  const params = useSearchParams();
  
  const image = params.get("image") || "https://images.unsplash.com/photo-1682687982501-1e58ab814714?q=80&w=1280&auto=format&fit=crop";
  const bg = params.get("bg") || image;
  const title = params.get("title") || "Project Showcase";
  const date = params.get("subtitle") || "Scroll Experience";
  const returnTo = params.get("returnTo") || "/";

  const handleBack = () => {
    // Use window.location to avoid webpack issues with router.push
    if (typeof window !== 'undefined') {
      window.location.href = returnTo;
    }
  };

  return (
    <ClientLoader>
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
            {title === "CollegeSphere" && (
              <div className="text-lg mb-8 text-gray-200 space-y-4">
                <p>
                  CollegeSphere is a comprehensive tool designed to help students search for colleges with better, more detailed information. 
                  Unlike traditional college search platforms, CollegeSphere provides in-depth insights about institutions, helping students 
                  make more informed decisions about their educational future.
                </p>
                <p>
                  Our platform aggregates data from multiple sources to give you a complete picture of each college, including academic programs, 
                  campus culture, career outcomes, and much more.
                </p>
              </div>
            )}
            {title === "Yorigin" && (
              <div className="text-lg mb-8 text-gray-200 space-y-4">
                <p>
                  Yorigin is a specialized platform designed to help competitive programmers stay informed about MAANG (Meta, Amazon, Apple, Netflix, Google) 
                  events and track their competitive programming ratings.
                </p>
                <p>
                  Whether you're preparing for coding interviews or participating in competitive programming contests, Yorigin provides you with 
                  up-to-date information about tech company events, coding competitions, and helps you monitor your progress in the competitive 
                  programming community.
                </p>
              </div>
            )}
            {title === "Starthub" && (
              <div className="text-lg mb-8 text-gray-200 space-y-4">
                <p>
                  Starthub is a platform created for student entrepreneurs who want to start their own ventures and seek guidance from their alumni network.
                </p>
                <p>
                  Connect with successful alumni who have been in your shoes, get mentorship, find co-founders, and access resources to help you 
                  launch your startup. Starthub bridges the gap between aspiring student entrepreneurs and experienced alumni who can provide 
                  valuable insights and support.
                </p>
              </div>
            )}
            {title === "KGPLaunchpad" && (
              <div className="text-lg mb-8 text-gray-200 space-y-4">
                <p>
                  KGPLaunchpad is a platform that helps students get real-world projects and learn from their alumni network.
                </p>
                <p>
                  Students can discover project opportunities posted by alumni, collaborate on meaningful work, and gain practical experience 
                  while building connections with industry professionals. It's a win-win platform where students get hands-on experience and 
                  alumni can give back to their alma mater.
                </p>
              </div>
            )}
            {title === "ManimAI" && (
              <div className="text-lg mb-8 text-gray-200 space-y-4">
                <p>
                  ManimAI is an innovative tool that helps students generate educational videos by automatically creating code to visualize 
                  mathematical and physics concepts.
                </p>
                <p>
                  Using AI-powered code generation, ManimAI makes it easy for students and educators to create engaging visualizations 
                  for complex mathematical equations and physics principles. Simply describe what you want to visualize, and ManimAI generates 
                  the code needed to create stunning educational videos.
                </p>
              </div>
            )}
            {!["CollegeSphere", "Yorigin", "Starthub", "KGPLaunchpad", "ManimAI"].includes(title) && (
              <p className="text-lg mb-8 text-gray-200">
                {date || "This page showcases the selected project image with a scroll-to-expand immersive effect."}
              </p>
            )}
          </div>
        </ScrollExpandMedia>
      </main>
    </ClientLoader>
  );
}

export default function ProjectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <ProjectPageContent />
    </Suspense>
  );
}





