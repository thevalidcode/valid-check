"use client";

import { useEffect } from "react";
import { useOrganizer } from "@/hooks";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { meQuery } = useOrganizer();
  const router = useRouter();

  useEffect(() => {
    document.title = "Dashboard - ValidCheck";
    
    // Redirect if not logged in and not loading
    if (!meQuery.isLoading && !meQuery.data) {
      router.push("/auth");
    }
  }, [meQuery.isLoading, meQuery.data, router]);

  if (meQuery.isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-yellow-500" />
      </div>
    );
  }

  // If not authenticated, don't show the dashboard content (it will redirect anyway)
  if (!meQuery.data) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
