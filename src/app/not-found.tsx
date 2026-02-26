"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFF9E5] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-yellow-400/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-yellow-500/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 mb-8 bg-white px-4 py-2 rounded-2xl shadow-sm border border-yellow-100">
          <div className="bg-yellow-400 p-1 rounded-lg">
            <CheckCircle2 className="h-5 w-5 text-yellow-950" />
          </div>
          <span className="font-bold text-xl tracking-tighter text-yellow-950">ValidCheck</span>
        </div>

        <div className="relative mb-8">
          <motion.h1 
            className="text-[12rem] font-black text-yellow-400/30 leading-none select-none"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            404
          </motion.h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="h-24 w-24 text-yellow-600/20" />
          </div>
        </div>

        <h2 className="text-4xl font-extrabold text-neutral-900 mb-4 tracking-tight">
          Page not found
        </h2>
        <p className="text-neutral-600 text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Oops! The page you're looking for seems to have checked out early. 
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild className="bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold h-12 px-8 rounded-xl shadow-lg shadow-yellow-200 border-none transition-all">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="bg-white border-neutral-200 h-12 px-8 rounded-xl hover:bg-neutral-50 font-semibold text-neutral-700 transition-all">
            <button onClick={() => window.history.back()} className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              Go Back
            </button>
          </Button>
        </div>
      </motion.div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
      
      <p className="mt-20 text-neutral-400 text-sm font-medium relative z-10">
        &copy; {new Date().getFullYear()} ValidCheck. All rights reserved.
      </p>
    </div>
  );
}
