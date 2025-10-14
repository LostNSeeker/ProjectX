"use client";

import { Dock, DockIcon, DockItem, DockLabel } from "@/components/ui/dock";
import { SplineScene } from "@/components/ui/splite";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Calendar } from "@/components/ui/calendar";
import { ParticleTextEffect } from "@/components/ui/particle-text-effect";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { ShuffleHero } from "@/components/ui/shuffle-grid";
import DatabaseWithRestApi from "@/components/ui/database-with-rest-api";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { WorldMap } from "@/components/ui/world-map";
import InteractiveSelector from "@/components/ui/interactive-selector";
import { Button } from "@/components/ui/button";
import { CanvasBackground } from "@/components/ui/canvas-background";
import { Home, Zap, Users, MessageCircle, Mail, ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function HomePage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
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
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
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
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                Feel the Power:
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Land Your Dream
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Remote Full Stack Job!
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              Join the waitlist for <span className="text-blue-400 font-semibold">RemoteFlow</span>, the ultimate tool for IT pros to discover remote opportunities. 
              <br />
              <span className="text-lg text-gray-400">Code from your couch, conquer the IT world!</span>
            </p>

            <Button 
              onClick={() => scrollToSection("#waitlist")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
            >
              Join Waitlist
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>

          {/* 3D Robot */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[600px] w-full"
          >
            <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-2xl font-bold text-white mb-2">3D Robot</h3>
                <p className="text-gray-300">Interactive 3D visualization</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Waitlist Form with Background Beams */}
      <section id="waitlist" className="py-20 relative overflow-hidden">
        <BackgroundBeams className="bg-black" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Reserve Your Spot
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of developers who are already on the waitlist. 
              Be the first to experience the future of remote job hunting!
            </p>
          </motion.div>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="max-w-md mx-auto"
            >
              <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
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
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Section with Particle Text */}
      <section id="features" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ParticleTextEffect words={["Why", "Join", "RemoteFlow?"]} />
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 max-w-3xl mx-auto text-center mt-6 mb-16"
          >
            Experience the future of remote job hunting with our cutting-edge platform designed specifically for IT professionals.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Discover Remote IT Jobs",
                description: "Access thousands of curated remote positions from top tech companies worldwide.",
                icon: "🔍"
              },
              {
                title: "AI-Powered Matching", 
                description: "Our advanced AI analyzes your skills and preferences to find the perfect match.",
                icon: "⚡"
              },
              {
                title: "Global Opportunities",
                description: "Work from anywhere with companies across the US, EU, Asia, and beyond.",
                icon: "🌍"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plan Your Remote Career - Calendar Section */}
      <section className="py-20 relative overflow-hidden w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]" />

        <div className="w-full max-w-none mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
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

          <div className="w-full flex justify-center">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 border border-white/10 shadow-2xl">
              <Calendar />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-lg text-gray-300 mb-6">
              Interested? Join the waitlist to get early access!
            </p>
            <Button 
              onClick={() => scrollToSection("#waitlist")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
            >
              Join Waitlist for Early Access
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

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

      {/* Companies Grid */}
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
                Trusted by Top Tech Teams
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of developers who work at the world&apos;s most innovative companies.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Google", "Microsoft", "Amazon", "Meta", 
              "Apple", "Netflix", "Spotify", "Airbnb"
            ].map((company, index) => (
              <motion.div
                key={company}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-white/10 hover:border-blue-400/50 transition-all duration-300"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🏢</div>
                  <h3 className="font-semibold text-white">{company}</h3>
                </div>
              </motion.div>
            ))}
          </div>
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