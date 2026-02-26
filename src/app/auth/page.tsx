"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOrganizer } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Mail,
  Lock,
  UserPlus,
  LogIn,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { normalizeApiError } from "@/lib/normalizeApiError";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [isVerifyingGoogle, setIsVerifyingGoogle] = useState(false);
  const hasTriggeredExchange = useRef(false);

  const { meQuery, login, register, googleExchange } = useOrganizer();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (meQuery.data) {
      router.push("/dashboard");
    }
  }, [meQuery.data, router]);

  useEffect(() => {
    const sessionCode = searchParams.get("session_code");
    const authError = searchParams.get("error");

    if (authError) {
      setError(authError);
    }

    if (sessionCode && !hasTriggeredExchange.current) {
      hasTriggeredExchange.current = true;
      setIsVerifyingGoogle(true);
      googleExchange.mutate(sessionCode, {
        onSuccess: () => {
          setIsVerifyingGoogle(false);
          router.push("/dashboard");
        },
        onError: (err: any) => {
          setIsVerifyingGoogle(false);
          hasTriggeredExchange.current = false;
          const errorMsg = normalizeApiError(err, "Google sign-in failed.");
          setError(errorMsg);
        },
      });
    }
  }, [searchParams, googleExchange, router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    login.mutate(
      { email, password },
      {
        onSuccess: () => router.push("/dashboard"),
        onError: (err: any) => {
          const errorMsg = normalizeApiError(
            err,
            "Failed to login. Please check your credentials.",
          );
          setError(errorMsg);
        },
      },
    );
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const confirmPassword = form.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    register.mutate(
      { email, password },
      {
        onSuccess: () => router.push("/dashboard"),
        onError: (err: any) => {
          const errorMsg = normalizeApiError(
            err,
            "Failed to create account. Please try again.",
          );
          setError(errorMsg);
        },
      },
    );
  };

  const handleGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/api/auth/google`);
  };

  return (
    <div className="min-h-screen flex bg-[#FFF9E5] selection:bg-yellow-200">
      {/* Left side: Visual Branding */}
      <div className="hidden lg:flex w-1/2 bg-yellow-400 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
        <div className="relative z-10 p-12 text-yellow-950">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="bg-yellow-950 p-3 rounded-2xl shadow-xl">
              <CheckCircle2 className="h-10 w-10 text-yellow-400" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter">ValidCheck</h1>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold mb-6 leading-tight"
          >
            Streamline your event <br /> check-ins with precision.
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {[
              { icon: ShieldCheck, text: "Enterprise-grade security" },
              { icon: UserPlus, text: "Unlimited attendee registration" },
              { icon: ArrowRight, text: "Real-time analytics dashboard" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 text-xl font-medium"
              >
                <div className="bg-yellow-950/10 p-2 rounded-full">
                  <item.icon className="h-6 w-6" />
                </div>
                {item.text}
              </div>
            ))}
          </motion.div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-yellow-300 rounded-full blur-3xl opacity-50" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-500 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Right side: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white lg:rounded-l-[40px] shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.05)] z-20">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 text-center lg:text-left"
          >
            <Link
              href="/"
              className="lg:hidden inline-flex items-center gap-2 mb-8 text-neutral-900"
            >
              <div className="bg-yellow-400 p-1.5 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-yellow-950" />
              </div>
              <span className="font-bold text-2xl tracking-tighter">
                ValidCheck
              </span>
            </Link>
            <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              {tab === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-neutral-500 font-medium mt-2">
              {tab === "login"
                ? "Manage your events and attendees with ease."
                : "Join ValidCheck and start creating powerful check-in flows."}
            </p>
          </motion.div>

          {isVerifyingGoogle ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-6 bg-yellow-50/50 rounded-3xl border border-yellow-100">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />
                <Loader2 className="h-16 w-16 text-yellow-600 animate-spin relative z-10" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-yellow-950">
                  Almost there!
                </h3>
                <p className="text-yellow-800/70 font-medium">
                  Securely signing you in via Google...
                </p>
              </div>
            </div>
          ) : (
            <Tabs
              value={tab}
              onValueChange={(v) => setTab(v as any)}
              className="space-y-8"
            >
              <TabsList className="grid w-full grid-cols-2 bg-neutral-100/80 rounded-2xl">
                <TabsTrigger
                  value="login"
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-base transition-all"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-base transition-all"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border-neutral-200 hover:bg-neutral-50 hover:border-yellow-400 hover:text-neutral-900 transition-all font-semibold text-neutral-700 shadow-sm"
                onClick={handleGoogleLogin}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-neutral-100"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-neutral-400 font-medium">
                    Or use email address
                  </span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="login" className="mt-0">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <div className="relative group">
                          <Mail className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-yellow-600 transition-colors" />
                          <Input
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            className="pl-12 h-12 bg-neutral-50 border-neutral-200 rounded-xl focus:ring-yellow-500 focus:border-yellow-500"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="relative group">
                          <Lock className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-yellow-600 transition-colors" />
                          <Input
                            name="password"
                            type="password"
                            placeholder="Your password"
                            className="pl-12 h-12 bg-neutral-50 border-neutral-200 rounded-xl focus:ring-yellow-500 focus:border-yellow-500"
                            required
                          />
                        </div>
                      </div>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Alert
                            variant="destructive"
                            className="bg-red-50 border-red-200 text-red-700 rounded-xl"
                          >
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                      <Button
                        type="submit"
                        className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-lg rounded-xl shadow-lg shadow-yellow-200 transition-all border-none"
                        disabled={login.status === "pending"}
                      >
                        {login.status === "pending" ? (
                          <span className="flex items-center gap-2">
                            <LogIn className="h-5 w-5 animate-pulse" /> Signing
                            in...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <LogIn className="h-5 w-5" /> Sign In
                          </span>
                        )}
                      </Button>
                      <p className="text-center text-xs text-neutral-400 font-medium px-4">
                        By continuing, you agree to our{" "}
                        <Link
                          href="/terms"
                          className="underline hover:text-yellow-600 transition-colors"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="underline hover:text-yellow-600 transition-colors"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </p>{" "}
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="mt-0">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <div className="relative group">
                          <Mail className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-yellow-600 transition-colors" />
                          <Input
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                            className="pl-12 h-12 bg-neutral-50 border-neutral-200 rounded-xl"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="relative group">
                          <Lock className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-yellow-600 transition-colors" />
                          <Input
                            name="password"
                            type="password"
                            placeholder="Choose a password"
                            className="pl-12 h-12 bg-neutral-50 border-neutral-200 rounded-xl"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="relative group">
                          <Lock className="absolute left-4 top-3.5 h-5 w-5 text-neutral-400 group-focus-within:text-yellow-600 transition-colors" />
                          <Input
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm password"
                            className="pl-12 h-12 bg-neutral-50 border-neutral-200 rounded-xl"
                            required
                          />
                        </div>
                      </div>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Alert
                            variant="destructive"
                            className="bg-red-50 border-red-200 text-red-700 rounded-xl"
                          >
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        </motion.div>
                      )}

                      <Button
                        type="submit"
                        className="w-full h-12 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold text-lg rounded-xl shadow-lg shadow-yellow-200 transition-all border-none"
                        disabled={register.status === "pending"}
                      >
                        {register.status === "pending" ? (
                          <span className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5 animate-pulse" />{" "}
                            Creating account...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5" /> Create Account
                          </span>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
