"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, CheckCircle, Mail, Clock } from "lucide-react";
import { motion } from "framer-motion";

function ThankYouPageContent() {
  const params = useSearchParams();
  const router = useRouter();
  const returnTo = params.get("returnTo") || "/";

  const handleBack = () => {
    // Use window.location to avoid webpack issues
    if (typeof window !== 'undefined') {
      window.location.href = returnTo;
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl text-center w-full"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-8 bg-green-500 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-300 via-white to-gray-400 bg-clip-text text-transparent">
              Thank You!
            </span>
          </h1>
          
          <p className="text-gray-300 text-xl mb-8 leading-relaxed">
            Your request has been received successfully. We&apos;ll get back to you soon with exciting updates.
          </p>

          {/* Status Cards */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 flex items-center space-x-3"
            >
              <Mail className="w-5 h-5 text-blue-400" />
              <div className="text-left">
                <p className="text-sm text-gray-400">Confirmation sent to</p>
                <p className="text-white font-medium">your email address</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 flex items-center space-x-3"
            >
              <Clock className="w-5 h-5 text-green-400" />
              <div className="text-left">
                <p className="text-sm text-gray-400">Response time</p>
                <p className="text-white font-medium">within 24 hours</p>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              onClick={handleBack}
              className="bg-white text-black hover:bg-gray-200 transition-colors px-8 py-3"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            <Button 
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800 transition-colors px-8 py-3"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </motion.div>

          {/* Additional Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm text-gray-500 mt-8"
          >
            Questions? Reach out to us at{" "}
            <a href="mailto:support@remoteflow.com" className="text-blue-400 hover:text-blue-300">
              support@remoteflow.com
            </a>
          </motion.p>
        </motion.div>
      </motion.div>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </main>
    }>
      <ThankYouPageContent />
    </Suspense>
  );
}





