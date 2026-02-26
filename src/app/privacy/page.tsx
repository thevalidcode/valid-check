"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: Eye,
      title: "Data We Collect",
      content: "We collect information you provide directly to us when you create an account, such as your name, email address, and event details. We also collect attendee information provided during the check-in process."
    },
    {
      icon: Lock,
      title: "How We Use Data",
      content: "Your data is used to provide, maintain, and improve our services, including event management and attendee tracking. we never sell your personal information to third parties."
    },
    {
      icon: Shield,
      title: "Data Security",
      content: "We implement industry-standard security measures to protect your data from unauthorized access, disclosure, or destruction. This includes encryption and secure server infrastructure."
    },
    {
      icon: FileText,
      title: "Your Rights",
      content: "You have the right to access, correct, or delete your personal information at any time. You can manage your profile settings or contact us for assistance with data requests."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFF9E5] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] shadow-sm border border-neutral-100 overflow-hidden"
        >
          <div className="p-8 md:p-12 border-b border-neutral-50 bg-yellow-400/10">
            <Link href="/" className="inline-flex items-center gap-2 text-yellow-800 font-bold mb-8 hover:gap-3 transition-all">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tighter mb-4">
              Privacy Policy
            </h1>
            <p className="text-neutral-600 font-medium max-w-2xl">
              At ValidCheck, we take your privacy seriously. This policy outlines how we handle your data and yours and your attendees' information.
            </p>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sections.map((section, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="bg-yellow-400/20 p-3 rounded-2xl w-fit">
                    <section.icon className="h-6 w-6 text-yellow-950" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900">{section.title}</h3>
                  <p className="text-neutral-600 leading-relaxed font-medium">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-100">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Detailed Overview</h2>
              <div className="space-y-6 text-neutral-600 font-medium leading-relaxed">
                <p>
                  Last Updated: February 25, 2026
                </p>
                <p>
                  ValidCheck ("we," "our," or "us") provides an event attendee check-in platform. By using our service, you agree to the collection and use of information in accordance with this policy.
                </p>
                <h3 className="text-lg font-bold text-neutral-900">1. Information Collection</h3>
                <p>
                  Account Information: Email, name, and hashed password. 
                  Event Information: Data related to your check-in pages, attendee lists, and logs.
                  Usage Data: IP addresses, browser types, and interaction logs for security and performance monitoring.
                </p>
                <h3 className="text-lg font-bold text-neutral-900">2. Cookies</h3>
                <p>
                  We use essential cookies to maintain your session and security. You can control cookie settings through your browser, but some features may not function correctly without them.
                </p>
                <h3 className="text-lg font-bold text-neutral-900">3. Third-party Services</h3>
                <p>
                  We use Google OAuth for authentication. When you use Google to sign in, we receive your email and profile picture as permitted by your Google account settings.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="mt-12 text-center">
          <p className="text-neutral-500 font-medium mb-6">Have questions about our privacy practices?</p>
          <Button asChild className="bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold rounded-xl px-8 h-12 border-none">
            <Link href="mailto:thevalidcode@gmail.com">Contact Privacy Team</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
