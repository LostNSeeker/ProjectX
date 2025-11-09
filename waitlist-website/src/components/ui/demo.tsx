'use client'

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
 
export function SplineSceneBasic() {
  return (
    <Card className="w-full h-screen bg-black relative overflow-hidden border-0">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
      />
      
      <div className="flex h-full items-center">
        {/* Left content */}
        <div className="flex-1 p-12 md:p-16 relative z-10 flex flex-col justify-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            Find Your Dream Remote Job
          </h1>
          <p className="mt-8 text-gray-400 max-w-2xl text-xl md:text-2xl">
            RemoteFlow intelligently scrapes and curates remote IT jobs from across the web. 
            Our AI-powered platform matches you with opportunities that align perfectly with your skills and preferences.
          </p>
          <div className="mt-12 space-y-4 text-gray-400 text-lg">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-white"></div>
              <span>Smart AI Job Matching</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-white"></div>
              <span>Global Remote Opportunities</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-white"></div>
              <span>Verified Companies Only</span>
            </div>
          </div>
        </div>

        {/* Right content - 3D Robot */}
        <div className="flex-1 relative h-full">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  )
}
