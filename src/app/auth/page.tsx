import { Suspense } from "react";
import { AuthContent } from "./auth-content";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FFF9E5]">
          <Loader2 className="w-10 h-10 animate-spin text-yellow-500" />
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
