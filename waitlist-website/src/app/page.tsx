"use client";

import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";
import "@/components/ui/canvas";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Calendar } from "@/components/ui/calendar";
import { ParticleTextEffect } from "@/components/ui/particle-text-effect";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import DatabaseWithRestApi from "@/components/ui/database-with-rest-api";
import { ShuffleHero } from "@/components/ui/shuffle-grid";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { WorldMap } from "@/components/ui/world-map";
import InteractiveSelector from "@/components/ui/interactive-selector";
import { Button } from "@/components/ui/button";
import { CanvasBackground } from "@/components/ui/canvas-background";
import { SplineSceneBasic } from "@/components/ui/demo";
import WaveDemo from "@/components/ui/wave-demo";
import { Home, Zap, Users, MessageCircle, Mail, ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();
  const [isSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    jobRole: "",
    remoteOnly: false,
  });

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/processing");
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
      quote: "RemoteFlow helped me land a remote role at a top startup! The AI matching was spot-on and I found my dream job in just 2 weeks.",
      name: "Sarah Chen",
      designation: "Full Stack Developer at TechCorp",
      src: "👩‍💻",
    },
    {
      quote: "I've tried every job board out there, but RemoteFlow is in a league of its own. The personalized recommendations actually understand my skills.",
      name: "Marcus Rodriguez", 
      designation: "Senior Frontend Engineer at InnovateLab",
      src: "👨‍💻",
    },
    {
      quote: "The remote job market can be overwhelming, but RemoteFlow made it simple. I love how they verify companies and only show legitimate remote positions.",
      name: "Emily Johnson",
      designation: "Backend Developer at CloudScale", 
      src: "👩‍🔬",
    },
  ];


  return (
    <main className="min-h-screen bg-black text-white">
      {/* Dock Navigation */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <Dock className="bg-black/80 backdrop-blur-md border border-white/10">
          <DockItem>
            <DockIcon>
              <Home className="w-6 h-6 text-white" />
            </DockIcon>
            <DockLabel>Home</DockLabel>
          </DockItem>
          <DockItem>
            <DockIcon>
              <Zap className="w-6 h-6 text-white" />
            </DockIcon>
            <DockLabel>Features</DockLabel>
          </DockItem>
          <DockItem>
            <DockIcon>
              <Users className="w-6 h-6 text-white" />
            </DockIcon>
            <DockLabel>Waitlist</DockLabel>
          </DockItem>
          <DockItem>
            <DockIcon>
              <MessageCircle className="w-6 h-6 text-white" />
            </DockIcon>
            <DockLabel>Testimonials</DockLabel>
          </DockItem>
          <DockItem>
            <DockIcon>
              <Mail className="w-6 h-6 text-white" />
            </DockIcon>
            <DockLabel>Contact</DockLabel>
          </DockItem>
        </Dock>
      </div>

      {/* Hero Section with 3D Robot */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         

          {/* 3D Robot Component */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            <SplineSceneBasic />
          </motion.div>
        </div>
      </section>

      {/* Waitlist moved near footer; placeholder removed here */}

      {/* Features Section with Particle Text */}
      <section id="features" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ParticleTextEffect words={["Welcome to", "Elite Section", "of Internet"]} />
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 max-w-3xl mx-auto text-center mt-6 mb-16"
          >
            Experience the future of remote job hunting with our cutting-edge platform designed specifically for IT professionals.
          </motion.p>

          
        </div>
      </section>

      {/* Calendar moved into Waitlist; placeholder removed here */}

      {/* Testimonials */}
      <section id="testimonials" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                What Developers Say
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Don&apos;t just take our word for it. Here&apos;s what real developers are saying about RemoteFlow.
            </p>
          </motion.div>

          <AnimatedTestimonials testimonials={testimonials} />
        </div>
      </section>

      {/* Companies Using the Software */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ShuffleHero />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our advanced AI system makes finding your dream remote job simple and efficient.
            </p>
          </motion.div>

          <DatabaseWithRestApi />
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                See It in Action
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the power of RemoteFlow with our interactive demo.
            </p>
          </motion.div>

          <ContainerScroll 
          titleComponent={
            <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              See It in Action
            </h2>
          }
        >
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 border border-white/10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-white">AI-Powered Job Matching</h3>
                <p className="text-gray-300 mb-6">
                  Our advanced algorithm analyzes your skills, preferences, and career goals to match you with the perfect remote opportunities.
                </p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    Personalized job recommendations
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    Company culture matching
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    Salary range optimization
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-white/10">
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Job Match Score</div>
                    <div className="text-2xl font-bold text-green-400">94%</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Remote Score</div>
                    <div className="text-2xl font-bold text-blue-400">100%</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Culture Fit</div>
                    <div className="text-2xl font-bold text-purple-400">89%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ContainerScroll>
        </div>
      </section>

      {/* World Map */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Remote Jobs, Worldwide
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover remote opportunities across the globe.
            </p>
          </motion.div>

          <WorldMap />
        </div>
      </section>

      {/* Other Projects */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Other Tools We&apos;re Building
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore our upcoming projects designed for developers.
            </p>
          </motion.div>

          <InteractiveSelector />
        </div>
      </section>

      {/* Calendar + Waitlist (combined) just above Footer */}
      <section id="waitlist" className="py-20 relative overflow-hidden">
        <BackgroundBeams className="bg-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Calendar header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Plan Your Remote Career
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Visualize your journey to remote work success. Track application timelines and early access dates.
            </p>
          </motion.div>

          {/* Calendar + Form in one row */}
          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Calendar */}
            <div className="w-full flex justify-center">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 border border-white/10 shadow-2xl transform scale-95">
                <Calendar />
                <div className="mt-6 flex justify-center">
                  <Button onClick={() => router.push('/processing')} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
                    Book
                  </Button>
                </div>
              </div>
            </div>

            {/* Waitlist form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="w-full"
            >
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-md mx-auto text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    You&apos;re in! 🎉
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Get ready to code remotely like a pro! We&apos;ll notify you when RemoteFlow launches.
                  </p>
                </motion.div>
              ) : (
                <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl max-w-md mx-auto">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
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
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
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
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                        required
                      >
                        <option value="">Select your role</option>
                        {jobRoles.map((role) => (
                          <option key={role} value={role} className="bg-gray-800">
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
                        className="w-5 h-5 text-blue-500 bg-white/5 border-white/20 rounded focus:ring-blue-500/50 focus:ring-2"
                      />
                      <label htmlFor="remoteOnly" className="text-sm text-gray-300">
                        I&apos;m only interested in remote positions
                      </label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Wave section just above the Footer */}
      <section className="relative overflow-hidden">
        <WaveDemo />
      </section>

      {/* Footer with Canvas */}
      <footer className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black" />
        <CanvasBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                RemoteFlow
              </h3>
              <p className="text-gray-400 text-sm">
                The ultimate platform for remote job seekers in the IT industry.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#waitlist" className="hover:text-white transition-colors">Join Waitlist</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>Email: hello@remoteflow.com</p>
                <p>Twitter: @RemoteFlow</p>
                <p>LinkedIn: RemoteFlow</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 RemoteFlow. All rights reserved. Built with Next.js and Tailwind CSS.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}