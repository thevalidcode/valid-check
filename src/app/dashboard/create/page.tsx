import React, { Suspense } from "react";
import { CreateCheckInPageContent } from "./create-content";
import { Loader2 } from "lucide-react";

export default function CreateCheckInPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        </div>
      }
    >
      <CreateCheckInPageContent />
    </Suspense>
  );
}
