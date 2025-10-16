"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type CompanyItem = {
  id: number;
  name: string;
  // Optional: if you later have logo URLs, set src and we'll render background image
  src?: string;
};

const DEFAULT_COMPANIES: CompanyItem[] = [
  { id: 1, name: "Google" },
  { id: 2, name: "Amazon" },
  { id: 3, name: "Microsoft" },
  { id: 4, name: "Meta" },
  { id: 5, name: "Apple" },
  { id: 6, name: "Netflix" },
  { id: 7, name: "Spotify" },
  { id: 8, name: "Airbnb" },
  { id: 9, name: "CloudScale" },
  { id: 10, name: "InnovateLab" },
  { id: 11, name: "TechCorp" },
  { id: 12, name: "NextWave" },
  { id: 13, name: "DataForge" },
  { id: 14, name: "CodeNest" },
  { id: 15, name: "DeepStack" },
  { id: 16, name: "ByteWorks" },
];

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  let currentIndex = arr.length;
  let randomIndex: number;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
  }
  return arr;
}

function generateSquares(items: CompanyItem[]) {
  return shuffle(items).map((item) => (
    <motion.div
      key={item.id}
      layout
      transition={{ duration: 1.2, type: "spring" }}
      className={cn(
        "w-full h-full rounded-md overflow-hidden border border-white/10",
        "bg-gradient-to-br from-gray-800 to-gray-900"
      )}
      style={item.src ? {
        backgroundImage: `url(${item.src})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      } : undefined}
    >
      {!item.src && (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-sm md:text-base lg:text-lg font-semibold text-white/90">
            {item.name}
          </span>
        </div>
      )}
    </motion.div>
  ));
}

export function CompanyShuffleGrid({ companies = DEFAULT_COMPANIES, className }: { companies?: CompanyItem[]; className?: string; }) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [tiles, setTiles] = useState(generateSquares(companies));

  useEffect(() => {
    const shuffleTiles = () => {
      setTiles(generateSquares(companies));
      timeoutRef.current = setTimeout(shuffleTiles, 3000);
    };

    shuffleTiles();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [companies]);

  return (
    <div className={cn("grid grid-cols-4 grid-rows-4 gap-1 h-[360px] sm:h-[420px] md:h-[450px]", className)}>
      {tiles}
    </div>
  );
}



