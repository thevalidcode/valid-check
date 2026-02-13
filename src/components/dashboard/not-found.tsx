"use client";

import { motion } from "framer-motion";
import { Search, ArrowLeft, Home, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NotFoundProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  backHref?: string;
}

export function NotFound({ 
  title = "Resource Not Found", 
  message = "We couldn't find the page or event you're looking for. It might have been deleted or the link is incorrect.",
  onRetry,
  backHref = "/dashboard"
}: NotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-8 max-w-md"
      >
        <div className="relative mx-auto w-32 h-32">
          <motion.div 
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="bg-yellow-100 dark:bg-yellow-900/30 w-full h-full rounded-[2.5rem] flex items-center justify-center shadow-inner border border-yellow-200/50 dark:border-yellow-800/50"
          >
            <Search className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-2 -right-2 bg-white dark:bg-neutral-900 p-3 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-800"
          >
            <RefreshCcw className="w-5 h-5 text-neutral-400" />
          </motion.div>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight leading-tight uppercase italic underline decoration-yellow-400 decoration-4 underline-offset-4">
            {title}
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium text-lg balance">
            {message}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button 
            asChild
            variant="outline" 
            className="w-full sm:w-auto h-12 px-6 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 font-bold hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all active:scale-95"
          >
            <Link href={backHref}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Link>
          </Button>
          
          {onRetry ? (
            <Button 
              onClick={onRetry}
              className="w-full sm:w-auto h-12 px-8 rounded-xl bg-neutral-900 hover:bg-black text-white dark:bg-yellow-400 dark:hover:bg-yellow-50 dark:text-yellow-950 font-black border-none shadow-lg shadow-neutral-200 dark:shadow-none transition-all active:scale-95"
            >
              <RefreshCcw className="w-4 h-4 mr-2" /> Try Again
            </Button>
          ) : (
            <Button 
              asChild
              className="w-full sm:w-auto h-12 px-8 rounded-xl bg-neutral-900 hover:bg-black text-white dark:bg-yellow-400 dark:hover:bg-yellow-50 dark:text-yellow-950 font-black border-none shadow-lg shadow-neutral-200 dark:shadow-none transition-all active:scale-95"
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" /> Go Home
              </Link>
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
