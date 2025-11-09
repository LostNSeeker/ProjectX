"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FaCampground, FaFire, FaTint, FaHotTub, FaHiking } from 'react-icons/fa';

const InteractiveSelector = () => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([]);
  
  const options = useMemo(() => [
    {
      title: "CollegeSphere",
      description: "Tool for searching college but give better info about college",
      image: "/CollegeSphere.png",
      icon: <FaCampground size={24} className="text-white" />,
      url: "/project?title=CollegeSphere&subtitle=Tool for searching college but give better info about college"
    },
    {
      title: "Yorigin",
      description: "Site which help competitive programmers to know maang events and their cp ratings",
      image: "/Yorigin.png",
      icon: <FaFire size={24} className="text-white" />,
      url: "/project?title=Yorigin&subtitle=Site which help competitive programmers to know maang events and their cp ratings"
    },
    {
      title: "Starthub",
      description: "For student entrepreneurs who want to start, and want to get help from their alumns",
      image: "/Starthub.png",
      icon: <FaTint size={24} className="text-white" />,
      url: "/project?title=Starthub&subtitle=For student entrepreneurs who want to start, and want to get help from their alumns"
    },
    {
      title: "KGPLaunchpad",
      description: "Site which help students get projects and learning form their alumns",
      image: "/KGPLaunchpad.png",
      icon: <FaHotTub size={24} className="text-white" />,
      url: "/project?title=KGPLaunchpad&subtitle=Site which help students get projects and learning form their alumns"
    },
    {
      title: "ManimAI",
      description: "Tool to generate videos helping students to generate codes to shows maths and physics videos",
      image: "/ManimAI.png",
      icon: <FaHiking size={24} className="text-white" />,
      url: "/project?title=ManimAI&subtitle=Tool to generate videos helping students to generate codes to shows maths and physics videos"
    }
  ], []);

  const handleOptionClick = (index: number) => {
    if (typeof window === 'undefined') return;
    
    const option = options[index];
    if (!option) {
      console.error('Option not found at index:', index);
      return;
    }
    
    setActiveIndex(index);
    
    // Build URL parameters
    const params = new URLSearchParams();
    params.set('image', option.image);
    params.set('bg', option.image);
    params.set('title', option.title);
    params.set('subtitle', option.description);
    params.set('returnTo', '/?skipIntro=true');
    
    // Use window.location.href to avoid webpack issues with router.push
    // This forces a full page reload which avoids the webpack module loading error
    const targetUrl = `/project?${params.toString()}`;
    window.location.href = targetUrl;
  };

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    options.forEach((_, i) => {
      const timer = setTimeout(() => {
        setAnimatedOptions((prev: number[]) => [...prev, i]);
      }, 180 * i);
      timers.push(timer);
    });
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [options]);

  return (
    <div className="relative flex flex-col items-center justify-center py-8 bg-black font-sans text-white"> 
      {/* Options Container */}
      <div className="options flex w-full max-w-[900px] min-w-[600px] h-[400px] mx-0 items-stretch overflow-hidden relative">
        {options.map((option, index) => (
          <div
            key={index}
            className={`
              option relative flex flex-col justify-end overflow-hidden transition-all duration-700 ease-in-out
              ${activeIndex === index ? 'active' : ''}
            `}
            style={{
              backgroundImage: `url('${option.image}')`,
              backgroundSize: activeIndex === index ? 'auto 100%' : 'auto 120%',
              backgroundPosition: 'center',
              backfaceVisibility: 'hidden',
              opacity: animatedOptions.includes(index) ? 1 : 0,
              transform: animatedOptions.includes(index) ? 'translateX(0)' : 'translateX(-60px)',
              minWidth: '60px',
              minHeight: '100px',
              margin: 0,
              borderRadius: 0,
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: activeIndex === index ? '#fff' : '#000',
              cursor: 'pointer',
              backgroundColor: '#000',
              boxShadow: activeIndex === index 
                ? '0 20px 60px rgba(0,0,0,0.50)' 
                : '0 10px 30px rgba(0,0,0,0.30)',
              flex: activeIndex === index ? '7 1 0%' : '1 1 0%',
              zIndex: activeIndex === index ? 10 : 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              position: 'relative',
              overflow: 'hidden',
              willChange: 'flex-grow, box-shadow, background-size, background-position'
            }}
            onClick={() => handleOptionClick(index)}
            onMouseEnter={() => setActiveIndex(index)}
          >
            {/* Shadow effect */}
            <div 
              className="shadow absolute left-0 right-0 pointer-events-none transition-all duration-700 ease-in-out"
              style={{
                bottom: activeIndex === index ? '0' : '-40px',
                height: '120px',
                boxShadow: activeIndex === index 
                  ? 'inset 0 -120px 120px -120px #000, inset 0 -120px 120px -80px #000' 
                  : 'inset 0 -120px 0px -120px #000, inset 0 -120px 0px -80px #000'
              }}
            ></div>
            
            {/* Label with icon and info */}
            <div className="label absolute left-0 right-0 bottom-5 flex items-center justify-start h-12 z-2 pointer-events-none px-4 gap-3 w-full">
              <div className="icon min-w-[44px] max-w-[44px] h-[44px] flex items-center justify-center rounded-full bg-[rgba(0,0,0,0.85)] backdrop-blur-[10px] shadow-[0_1px_4px_rgba(0,0,0,0.18)] border-2 border-white flex-shrink-0 flex-grow-0 transition-all duration-200">
                {option.icon}
              </div>
              <div className="info text-white whitespace-pre relative">
                <div 
                  className="main font-bold text-lg transition-all duration-700 ease-in-out"
                  style={{
                    opacity: activeIndex === index ? 1 : 0,
                    transform: activeIndex === index ? 'translateX(0)' : 'translateX(25px)'
                  }}
                >
                  {option.title}
                </div>
                <div 
                  className="sub text-base text-gray-300 transition-all duration-700 ease-in-out"
                  style={{
                    opacity: activeIndex === index ? 1 : 0,
                    transform: activeIndex === index ? 'translateX(0)' : 'translateX(25px)'
                  }}
                >
                  {option.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Custom animations */}
      <style jsx>{`
        @keyframes slideFadeIn {
          0% {
            opacity: 0;
            transform: translateX(-60px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInTop {
          opacity: 0;
          transform: translateY(-20px);
          animation: fadeInFromTop 0.8s ease-in-out forwards;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-600 {
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  );
};

export default InteractiveSelector;