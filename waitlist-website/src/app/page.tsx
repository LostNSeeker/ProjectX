"use client";

import "@/components/ui/canvas";
import { Calendar } from "@/components/ui/calendar";
import { ParticleTextEffect } from "@/components/ui/particle-text-effect";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import DatabaseWithRestApi from "@/components/ui/database-with-rest-api";
import { ShuffleHero } from "@/components/ui/shuffle-grid";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import InteractiveSelector from "@/components/ui/interactive-selector";
import { Button } from "@/components/ui/button";
import { SplineSceneBasic } from "@/components/ui/demo";
import WaveDemo from "@/components/ui/wave-demo";
import { SmoothReveal } from "@/components/ui/smooth-reveal-fixed";
import { MobileOrientationCheck } from "@/components/ui/mobile-orientation-check";
import { ArrowRight, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePage() {
  const router = useRouter();
  const [isSubmitted] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    jobRole: "",
    remoteOnly: false,
  });

  useEffect(() => {
    // Check if we're coming back from another page
    if (typeof window === 'undefined') return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const skipIntro = urlParams.get('skipIntro');
    
    // Check localStorage for previous visit
    const hasVisitedBefore = localStorage.getItem('projectx_has_visited');
    
    if (skipIntro === 'true' || hasVisitedBefore === 'true') {
      setShowIntro(false);
      // Mark as visited if not already marked
      if (!hasVisitedBefore) {
        localStorage.setItem('projectx_has_visited', 'true');
      }
    } else {
      // Show intro for all words to complete
      // 3 words * ~7 seconds each = ~21 seconds, add buffer for transitions
      const timer = setTimeout(() => {
        setShowIntro(false);
        // Mark as visited after intro completes
        localStorage.setItem('projectx_has_visited', 'true');
      }, 22000); // 22 seconds to ensure all words are seen
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Use window.location to avoid webpack issues with router.push
    if (typeof window !== 'undefined') {
      window.location.href = "/processing";
    }
  };

  const jobRoles = [
    "Full Stack Engineer",
    "Frontend Developer", 
    "Backend Developer",
    "DevOps Engineer",
    "Data Engineer",
    "Mobile Developer",
    "UI/UX Designer",
    "Product Manager",
    "Other"
  ];

  const testimonials = [
    {
      quote: "ProjectX has revolutionized how we approach remote job searching. The intelligent matching system saved me countless hours and connected me with opportunities I wouldn't have found otherwise.",
      name: "Akshat",
      designation: "Co-Founder & Lead Developer",
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces",
    },
    {
      quote: "Building ProjectX has been an incredible journey. Our AI-powered platform doesn't just match jobs—it understands career aspirations and company culture to create perfect alignments.",
      name: "Prabaha", 
      designation: "Co-Founder & Tech Architect",
      src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=faces",
    },
    {
      quote: "The remote job market can be overwhelming, but ProjectX made it simple. I love how they verify companies and only show legitimate remote positions.",
      name: "Emily Johnson",
      designation: "Backend Developer at CloudScale", 
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces",
    },
  ];


  return (
    <MobileOrientationCheck>
      {/* Intro Screen with ParticleTextEffect */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          >
            <div className="w-full h-full">
              <ParticleTextEffect words={["Welcome to", "The Elite section"," of Internet"]} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="min-h-screen bg-black text-white">

        {/* Hero Section with 3D Robot - Full Screen */}
        {!showIntro && (
          <section id="home" className="h-screen w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-black" />
            
            <SmoothReveal delay={0.2} duration={1.2} direction="up" className="w-full h-full">
              <div className="w-full h-full relative">
                <div className="absolute inset-0 -mx-8">
                  <SplineSceneBasic />
                </div>
              </div>
            </SmoothReveal>
          </section>
        )}

        {/* How It Works & See It in Action - Combined */}
        {!showIntro && (
          <section className="py-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-black" />
            
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <SmoothReveal delay={0.1} duration={0.8} direction="up" className="text-center mb-4">
                <h2 className="text-6xl lg:text-8xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-gray-300 via-white to-gray-400 bg-clip-text text-transparent">
                    How It Works
                  </span>
                </h2>
                <p className="text-2xl lg:text-3xl text-gray-400 max-w-5xl mx-auto leading-relaxed">
                  Our advanced AI system scrapes and analyzes thousands of job listings to bring you the perfect remote opportunities.
                </p>
              </SmoothReveal>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-1">
                {/* Database Component Section */}
                <div className="flex flex-col justify-center items-center">
                  <div className="w-full">
                    <SmoothReveal delay={0.2} duration={0.8} direction="up">
                      <DatabaseWithRestApi />
                    </SmoothReveal>
                    
                    {/* Explanation Text Below Database */}
                    <SmoothReveal delay={0.4} duration={0.6} direction="up" className="mt-8 text-left">
                      <h3 className="text-2xl font-bold text-white mb-3">
                        Intelligent Job Scraping & Analysis
                      </h3>
                      <p className="text-base text-gray-400 leading-relaxed">
                        Our system continuously scrapes job listings from thousands of sources across the internet. 
                        The data flows through our AI-powered analysis engine which filters, categorizes, and matches 
                        positions based on your preferences, skills, and career goals.
                      </p>
                    </SmoothReveal>
                  </div>
                </div>

                {/* AI-Powered Matching Section */}
                <div className="flex flex-col">
                  <SmoothReveal delay={0.6} duration={0.8} direction="left">
                    <ContainerScroll 
                      titleComponent=""
                    >
                    <div className="bg-black rounded-2xl p-6 border border-white/10">
                      <div className="flex flex-col gap-6">
                        <div>
                          <h3 className="text-xl font-bold mb-3 text-white">Real-Time Job Matching</h3>
                          <p className="text-gray-300 mb-4 text-sm">
                            Our advanced algorithm analyzes your profile to match you with perfect remote opportunities.
                          </p>
                          <ul className="space-y-2 text-gray-400 text-sm">
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-white" />
                              Personalized job recommendations
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-white" />
                              Company culture matching
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-white" />
                              Salary range optimization
                            </li>
                          </ul>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="space-y-3">
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="text-xs text-gray-400">Job Match Score</div>
                              <div className="text-xl font-bold text-white">94%</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="text-xs text-gray-400">Remote Score</div>
                              <div className="text-xl font-bold text-white">100%</div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="text-xs text-gray-400">Culture Fit</div>
                              <div className="text-xl font-bold text-white">89%</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    </ContainerScroll>
                  </SmoothReveal>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Companies We Track */}
        {!showIntro && (
          <section className="py-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-black" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <SmoothReveal delay={0.1} duration={0.8} direction="up" className="text-center mb-12">
                <h2 className="text-4xl lg:text-6xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-gray-300 via-white to-gray-400 bg-clip-text text-transparent">
                    Companies We Track
                  </span>
                </h2>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                  We actively scrape job listings from top tech companies and startups, ensuring you never miss an opportunity from industry leaders.
                </p>
              </SmoothReveal>
              
              <SmoothReveal delay={0.3} duration={0.8} direction="up">
                <ShuffleHero />
              </SmoothReveal>
            </div>
          </section>
        )}



        {/* Calendar + Waitlist Combined */}
        {!showIntro && (
          <section id="waitlist" className="py-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-black" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <SmoothReveal delay={0.1} duration={0.8} direction="up" className="text-center mb-12">
                <h2 className="text-4xl lg:text-6xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-gray-300 via-white to-gray-400 bg-clip-text text-transparent">
                    Join The Waitlist
                  </span>
                </h2>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                  Be among the first to experience ProjectX. Reserve your spot today and get early access.
                </p>
              </SmoothReveal>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
                <div className="w-full flex justify-center mb-8 lg:mb-0">
                  <SmoothReveal delay={0.2} duration={0.6} direction="left">
                    <div className="bg-black rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl w-full max-w-md sm:max-w-lg">
                      <Calendar />
                      <div className="mt-6 flex justify-center">
                        <Button 
                          onClick={() => {
                            // Use window.location to avoid webpack issues
                            if (typeof window !== 'undefined') {
                              window.location.href = '/processing';
                            }
                          }} 
                          className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 w-full sm:w-auto"
                        >
                          Book a Demo
                        </Button>
                      </div>
                    </div>
                  </SmoothReveal>
                </div>

                <div className="w-full">
                  <SmoothReveal delay={0.4} duration={0.6} direction="right">
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="max-w-md mx-auto text-center"
                    >
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-black" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">
                        You&apos;re in! 🎉
                      </h3>
                      <p className="text-gray-400 mb-6">
                        Get ready to code remotely like a pro! We&apos;ll notify you when ProjectX launches.
                      </p>
                    </motion.div>
                  ) : (
                    <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-white/10 shadow-2xl w-full max-w-md mx-auto">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Full Name
                          </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 text-base"
                          placeholder="Enter your full name"
                          required
                        />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                          </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 text-base"
                          placeholder="your.email@example.com"
                          required
                        />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Job Role
                          </label>
                        <select
                          value={formData.jobRole}
                          onChange={(e) => setFormData({...formData, jobRole: e.target.value})}
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 text-base"
                          required
                        >
                          <option value="">Select your role</option>
                          {jobRoles.map((role) => (
                            <option key={role} value={role} className="bg-black">
                              {role}
                            </option>
                          ))}
                        </select>
                        </div>

                        <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="remoteOnly"
                          checked={formData.remoteOnly}
                          onChange={(e) => setFormData({...formData, remoteOnly: e.target.checked})}
                          className="w-5 h-5 text-white bg-white/5 border-white/20 rounded focus:ring-white/50 focus:ring-2"
                        />
                          <label htmlFor="remoteOnly" className="text-sm text-gray-300">
                            I&apos;m only interested in remote positions
                          </label>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-white text-black py-4 rounded-lg font-semibold text-lg hover:bg-gray-200 transition-all duration-200 shadow-lg"
                        >
                          Reserve My Spot!
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </form>

                      <p className="text-center text-sm text-gray-400 mt-6">
                        Join 2,500+ developers already on the waitlist
                      </p>
                    </div>
                  )}
                  </SmoothReveal>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Other Projects */}
        {!showIntro && (
          <section className="py-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-black" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <SmoothReveal delay={0.1} duration={0.8} direction="up" className="text-center mb-8">
                <h2 className="text-4xl lg:text-6xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-gray-300 via-white to-gray-400 bg-clip-text text-transparent">
                    Other Tools We&apos;re Building
                  </span>
                </h2>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                  Explore our upcoming projects designed for developers.
                </p>
              </SmoothReveal>

              <SmoothReveal delay={0.3} duration={0.8} direction="up">
                <InteractiveSelector />
              </SmoothReveal>
            </div>
          </section>
        )}

        {/* Wave Section with Footer Content Below */}
        {!showIntro && (
          <section className="relative overflow-hidden bg-black">
            <SmoothReveal delay={0.2} duration={0.8} direction="up">
              <WaveDemo />
            </SmoothReveal>
            
            {/* Footer Content Below Wave */}
            <div className="pb-12 relative bg-black">
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <SmoothReveal delay={0.3} duration={0.6} direction="up">
                    <h3 className="text-xl font-bold text-white mb-4">
                      ProjectX
                    </h3>
                    <p className="text-gray-400 text-sm">
                      The ultimate platform for remote job seekers in the IT industry.
                    </p>
                  </SmoothReveal>
                  <SmoothReveal delay={0.4} duration={0.6} direction="up">
                    <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                      <li><a href="#waitlist" className="hover:text-white transition-colors">Join Waitlist</a></li>
                      <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
                    </ul>
                  </SmoothReveal>
                  <SmoothReveal delay={0.5} duration={0.6} direction="up">
                    <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
                    <div className="space-y-2 text-sm text-gray-400">
                      <p>Email: hello@projectx.com</p>
                      <p>Twitter: @ProjectX</p>
                      <p>LinkedIn: ProjectX</p>
                    </div>
                  </SmoothReveal>
                </div>
                <SmoothReveal delay={0.6} duration={0.6} direction="up" className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
                  <p>&copy; 2024 ProjectX. All rights reserved. Built with Next.js and Tailwind CSS.</p>
                </SmoothReveal>
              </div>
            </div>
          </section>
        )}
      </main>
    </MobileOrientationCheck>
  );
}