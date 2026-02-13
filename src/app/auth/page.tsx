"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOrganizer } from "@/hooks";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
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
} from "lucide-react";
import Link from "next/link";
import { normalizeApiError } from "@/lib/normalizeApiError";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);

  const { meQuery, login, register } = useOrganizer();
  const router = useRouter();

  useEffect(() => {
    if (meQuery.data) {
      router.push("/dashboard");
    }
  }, [meQuery.data, router]);

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
        </div>
      </div>
    </div>
  );
}
