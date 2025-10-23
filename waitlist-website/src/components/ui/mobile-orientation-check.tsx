"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function MobileOrientationCheck({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [showOrientationMessage, setShowOrientationMessage] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                            window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
      
      if (isMobileDevice) {
        const isLandscapeOrientation = window.innerWidth > window.innerHeight;
        setIsLandscape(isLandscapeOrientation);
        setShowOrientationMessage(!isLandscapeOrientation);
        setIsReady(isLandscapeOrientation);
      } else {
        // Desktop - always ready
        setIsReady(true);
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <>
      <AnimatePresence>
        {showOrientationMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <div className="text-center p-8 max-w-sm mx-auto">
              {/* Phone Icon */}
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 90 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                className="w-16 h-16 mx-auto mb-6 bg-white rounded-lg flex items-center justify-center"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                  <line x1="12" y1="18" x2="12.01" y2="18"/>
                </svg>
              </motion.div>

              <h2 className="text-2xl font-bold text-white mb-4">
                Rotate Your Device
              </h2>
              
              <p className="text-gray-300 mb-6">
                For the best experience, please rotate your phone to landscape mode.
              </p>

              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18"/>
                  <path d="M3 12h18"/>
                  <path d="M3 18h18"/>
                </svg>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showOrientationMessage && isReady && children}
    </>
  );
}
