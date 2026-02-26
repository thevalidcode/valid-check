import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { CheckinContent } from "./checkin-content";

export default async function CheckinPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center p-10 antialiased font-sans">
          <Loader2 className="w-10 h-10 animate-spin text-yellow-500 mb-4" />
          <p className="font-bold text-neutral-400 uppercase tracking-widest text-[10px]">
            Syncing Session Data...
          </p>
        </div>
      }
    >
      <CheckinContent slug={slug} />
    </Suspense>
  );
}
