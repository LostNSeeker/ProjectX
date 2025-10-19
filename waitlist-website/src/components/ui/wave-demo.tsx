"use client";

import React from "react";
import { WavePath } from "@/components/ui/wave-path";

export default function WaveDemo() {
  return (
    <div className="relative w-full flex flex-col items-center justify-center py-20">
      <div className="flex w-[70vw] flex-col items-end">
        <WavePath className="mb-10" />
        <div className="flex w-full flex-col items-end">
          <div className="flex justify-end">
            <p className="text-gray-400 mt-2 text-sm">RemoteFlow</p>
            <p className="text-white ml-8 w-3/4 text-2xl md:text-4xl">
              Find your dream remote job. Work from anywhere. Live your best life.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



