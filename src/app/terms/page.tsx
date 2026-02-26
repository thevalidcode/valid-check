"use client";

import { motion } from "framer-motion";
import { Gavel, Scale, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
  const terms = [
    {
      icon: CheckCircle2,
      title: "Acceptance of Terms",
      content: "By creating an account or using ValidCheck, you agree to be bound by these terms. If you do not agree, please do not use our services."
    },
    {
      icon: Scale,
      title: "Use of Service",
      content: "You are responsible for maintaining the confidentiality of your account. You agree to use the service only for lawful purposes related to event management."
    },
    {
      icon: Gavel,
      title: "Intellectual Property",
      content: "All content, features, and functionality of ValidCheck are the exclusive property of ValidCheck and its licensors."
    },
    {
      icon: AlertCircle,
      title: "Limitation of Liability",
      content: "ValidCheck is provided 'as is' without warranty. We are not liable for any indirect or consequential damages arising from your use of the platform."
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
              Terms of Service
            </h1>
            <p className="text-neutral-600 font-medium max-w-2xl">
              Please read these terms carefully before using ValidCheck. They govern your relationship with our platform and services.
            </p>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {terms.map((term, idx) => (
                <div key={idx} className="space-y-4">
                  <div className="bg-yellow-400/20 p-3 rounded-2xl w-fit">
                    <term.icon className="h-6 w-6 text-yellow-950" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900">{term.title}</h3>
                  <p className="text-neutral-600 leading-relaxed font-medium">
                    {term.content}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-100">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Terms Conditions</h2>
              <div className="space-y-6 text-neutral-600 font-medium leading-relaxed">
                <p>
                  Last Updated: February 25, 2026
                </p>
                <h3 className="text-lg font-bold text-neutral-900">1. User Account</h3>
                <p>
                  You must be at least 18 years old to create an organizer account. You must provide accurate information and keep it updated. We reserve the right to terminate accounts that violate our usage guidelines.
                </p>
                <h3 className="text-lg font-bold text-neutral-900">2. Prohibited Conduct</h3>
                <p>
                  You may not use ValidCheck to:
                  - Collect sensitive data without proper consent.
                  - Attempt to bypass security measures.
                  - Use the service for any illegal or unauthorized purpose.
                </p>
                <h3 className="text-lg font-bold text-neutral-900">3. Termination</h3>
                <p>
                  We may terminate or suspend your account immediately, without prior notice or liability, if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="mt-12 text-center text-neutral-500 font-medium leading-relaxed">
          <p>By using ValidCheck, you signify your agreement to these terms.</p>
          <p className="mt-2">&copy; {new Date().getFullYear()} ValidCheck. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
