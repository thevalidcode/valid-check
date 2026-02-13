"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  CheckCircle,
  Users,
  BarChart3,
  Shield,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Layout,
  Clock,
  QrCode,
  Calendar,
} from "lucide-react";

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 font-sans selection:bg-yellow-100 dark:selection:bg-yellow-900 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-4">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-400/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-400/20 blur-[100px] rounded-full" />
        </div>

        <div className="container max-w-6xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-100 dark:border-yellow-800 text-primary dark:text-yellow-400 text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Sparkles className="h-3 w-3" />
            Empowering Next-Gen Events
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 text-neutral-900 dark:text-neutral-50 leading-[0.9]"
          >
            Event Check-In <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-yellow-500 to-orange-500 decoration-none">
              Perfected.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            The enterprise-ready platform for professional organizers to deploy
            seamless check-in portals, track real-time attendance, and manage
            high-volume events with absolute precision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-5 items-center justify-center w-full"
          >
            <Button
              asChild
              size="lg"
              className="h-14 px-10 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-yellow-950 text-base font-bold shadow-xl shadow-yellow-200 dark:shadow-none group border-none"
            >
              <Link href="/auth">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 px-10 rounded-2xl text-base font-bold border-2 border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
            >
              <Link href="#features">Explore Features</Link>
            </Button>
          </motion.div>

          {/* Interactive Preview Mockup */}
          <motion.div
            style={{ y: y1 }}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-24 w-full max-w-6xl relative group"
          >
            <div className="relative rounded-[2.5rem] border-12 border-neutral-100 dark:border-neutral-900 bg-white dark:bg-neutral-950 overflow-hidden shadow-[0_0_100px_-20px_rgba(255,214,0,0.3)]">
              {/* Dashboard Simulation */}
              <div className="aspect-16/10 bg-white dark:bg-neutral-950 p-6 md:p-10 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-6">
                    <div className="flex gap-2 mr-4">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-yellow-400" />
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                    </div>
                    <div className="h-8 w-48 bg-neutral-100 dark:bg-neutral-900 rounded-lg flex items-center px-3">
                      <div className="h-2 w-2/3 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                      <Users className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="h-10 w-24 bg-yellow-400 rounded-xl" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  {[
                    {
                      label: "Active Events",
                      val: "12",
                      color: "text-yellow-600",
                      bg: "bg-yellow-50",
                    },
                    {
                      label: "Total Check-ins",
                      val: "1,248",
                      color: "text-blue-600",
                      bg: "bg-blue-50",
                    },
                    {
                      label: "Completion Rate",
                      val: "94%",
                      color: "text-emerald-600",
                      bg: "bg-emerald-50",
                    },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm"
                    >
                      <p className="text-xs font-bold text-neutral-400 uppercase mb-2 tracking-wider">
                        {s.label}
                      </p>
                      <p className={`text-3xl font-black ${s.color}`}>
                        {s.val}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex-1 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 p-6 overflow-hidden">
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((row) => (
                      <div
                        key={row}
                        className="flex items-center justify-between py-3 border-b border-neutral-100 dark:border-neutral-800 last:border-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                          <div className="space-y-2">
                            <div className="h-3 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                            <div className="h-2 w-20 bg-neutral-100 dark:bg-neutral-900 rounded-full" />
                          </div>
                        </div>
                        <div className="h-6 w-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full border border-emerald-200" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Dynamic Elements */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -right-12 top-1/4 bg-white dark:bg-neutral-900 p-5 rounded-3xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] border border-neutral-100 dark:border-neutral-800 hidden lg:block z-30"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-yellow-400 flex items-center justify-center text-yellow-950">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-0.5">
                    Live Alert
                  </p>
                  <p className="text-sm font-black text-neutral-900 dark:text-neutral-50">
                    Attendee Verified
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -left-12 bottom-1/4 bg-white dark:bg-neutral-900 p-5 rounded-3xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] border border-neutral-100 dark:border-neutral-800 hidden lg:block z-30"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-neutral-900 dark:bg-neutral-800 flex items-center justify-center text-white">
                  <QrCode className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-0.5">
                    Active Portal
                  </p>
                  <p className="text-sm font-black text-neutral-900 dark:text-neutral-50">
                    Tech Summit 2026
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-4 relative">
        <div className="container max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-neutral-900 dark:text-neutral-50 tracking-tight">
              Mission Critical Architecture
            </h2>
            <p className="text-xl text-neutral-500 max-w-3xl mx-auto font-medium leading-relaxed">
              ValidCheck is engineered for organizers who demand absolute
              reliability and speed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: Calendar,
                title: "Recurring Events",
                description:
                  "Automate series with intelligent scheduling. Configure once, run forever with smart pattern matching.",
                color:
                  "bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
              },
              {
                icon: Layout,
                title: "Adaptive Data Fields",
                description:
                  "Collect Phone, DOB, or custom requirements per event. Dynamic validation ensures data integrity.",
                color:
                  "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
              },
              {
                icon: BarChart3,
                title: "Deep Logistics",
                description:
                  "Monitor peak check-in velocities and attendee demographics with enterprise-grade reports.",
                color:
                  "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
              },
              {
                icon: Shield,
                title: "Privacy First",
                description:
                  "Full GDPR/CCPA compliance readiness. Isolated participant data silos for peak security.",
                color:
                  "bg-yellow-100/50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-500 dark:border-yellow-700",
              },
              {
                icon: Clock,
                title: "Smart Gatekeeping",
                description:
                  "Automated portal synchronization. Links activate and deactivate precisely on schedule.",
                color:
                  "bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
              },
              {
                icon: Sparkles,
                title: "Zero-Friction UX",
                description:
                  "Native-speed web portals. No downloads or accounts required for your attendees.",
                color:
                  "bg-amber-100/50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-500 dark:border-amber-700",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-10 rounded-[3rem] bg-neutral-50/50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800 hover:border-yellow-300 dark:hover:border-yellow-700 transition-all hover:shadow-[0_20px_80px_-20px_rgba(255,214,0,0.1)]"
              >
                <div
                  className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-8 border ${feature.color}`}
                >
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-neutral-900 dark:text-neutral-50">
                  {feature.title}
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed font-semibold">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-40 px-4 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full -z-10 bg-yellow-400" />
        <div className="container max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black text-yellow-950 mb-10 leading-[0.9] tracking-tighter">
              Ready to automate your <br /> event operations?
            </h2>
            <p className="text-2xl text-yellow-900 mb-14 max-w-2xl mx-auto font-bold opacity-80">
              Stop wasting time with clipboards and spreadsheets. Transform your
              event operations with an automated check-in infrastructure that
              scales with you.
            </p>
            <Button
              asChild
              size="lg"
              className="h-20 px-16 rounded-[2rem] bg-yellow-950 text-yellow-400 hover:bg-neutral-900 text-xl font-black shadow-2xl transition-transform hover:scale-105 active:scale-95 border-none"
            >
              <Link href="/auth">Create Your First Portal Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
