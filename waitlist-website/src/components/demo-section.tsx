"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Code, ArrowRight, Star, MapPin, DollarSign } from "lucide-react";

const demoJobs = [
  {
    id: "1",
    title: "Senior Full Stack Engineer",
    company: "TechCorp",
    location: "Remote",
    salary: "$120k - $180k",
    type: "Full-time",
    skills: ["React", "Node.js", "TypeScript", "AWS"],
    match: 95,
    logo: "🚀",
  },
  {
    id: "2",
    title: "Frontend Developer",
    company: "InnovateLab",
    location: "Remote",
    salary: "$90k - $130k",
    type: "Full-time",
    skills: ["Vue.js", "JavaScript", "CSS", "Figma"],
    match: 88,
    logo: "💻",
  },
  {
    id: "3",
    title: "Backend Engineer",
    company: "CloudScale",
    location: "Remote",
    salary: "$100k - $150k",
    type: "Full-time",
    skills: ["Python", "Django", "PostgreSQL", "Docker"],
    match: 92,
    logo: "⚡",
  },
  {
    id: "4",
    title: "DevOps Engineer",
    company: "DataFlow",
    location: "Remote",
    salary: "$110k - $160k",
    type: "Full-time",
    skills: ["Kubernetes", "Terraform", "AWS", "Jenkins"],
    match: 85,
    logo: "🔧",
  },
  {
    id: "5",
    title: "Full Stack Developer",
    company: "StartupXYZ",
    location: "Remote",
    salary: "$80k - $120k",
    type: "Full-time",
    skills: ["React", "Express", "MongoDB", "GraphQL"],
    match: 90,
    logo: "🌟",
  },
  {
    id: "6",
    title: "Mobile Developer",
    company: "AppVenture",
    location: "Remote",
    salary: "$95k - $140k",
    type: "Full-time",
    skills: ["React Native", "iOS", "Android", "Firebase"],
    match: 87,
    logo: "📱",
  },
];

export default function DemoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />

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
            Watch how our AI finds the perfect remote opportunities for you.
          </p>
        </motion.div>

        {/* Demo Container */}
        <motion.div
          ref={containerRef}
          style={{ y, opacity }}
          className="relative"
        >
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
            {/* Demo Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-sm text-gray-400">RemoteFlow Dashboard</div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">AI Matching Active</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for remote jobs..."
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Search
                </button>
              </div>
            </div>

            {/* Job Results */}
            <div className="space-y-4">
              {demoJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{job.logo}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                          <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
                            {job.match}% Match
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">{job.company}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{job.salary}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Code className="w-4 h-4" />
                            <span>{job.type}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
                        Apply Now
                      </button>
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <Star className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="bg-white/5 border border-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-all duration-200">
                Load More Jobs
              </button>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-blue-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Find Your Dream Remote Job?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of developers who have already discovered their perfect remote opportunities with RemoteFlow.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const element = document.querySelector("#waitlist");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 flex items-center space-x-2 mx-auto"
            >
              <span>Join Waitlist for Early Access</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
