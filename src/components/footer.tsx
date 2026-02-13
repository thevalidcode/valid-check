import { CheckCircle2, Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-800">
      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-1.5 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-neutral-900 dark:text-neutral-50">
                Valid<span className="text-primary">Check</span>
              </span>
            </Link>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
              Leading the way in frictionless event management. Open-source,
              secure, and built for scale.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://twitter.com/thevalidcode"
                className="h-9 w-9 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-500 hover:text-primary transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="https://github.com/thevalidcode/valid-check"
                className="h-9 w-9 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-500 hover:text-primary transition-colors"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link
                href="https://linkedin.com/in/thevalidcode"
                className="h-9 w-9 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-500 hover:text-primary transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-neutral-900 dark:text-neutral-50 mb-6">
              Product
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="#features"
                  className="text-sm font-medium text-neutral-500 hover:text-primary transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/thevalidcode/valid-check"
                  className="text-sm font-medium text-neutral-500 hover:text-primary transition-colors"
                >
                  Open Source
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-neutral-900 dark:text-neutral-50 mb-6">
              Connect
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="https://github.com/thevalidcode/valid-check"
                  className="text-sm font-medium text-neutral-500 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Github className="h-4 w-4" /> GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="https://twitter.com/thevalidcode"
                  className="text-sm font-medium text-neutral-500 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Twitter className="h-4 w-4" /> Twitter
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-neutral-900 dark:text-neutral-50 mb-6">
              Valid
            </h3>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 leading-relaxed mb-4">
              Building the future of event attendance systems.
            </p>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-2xl border border-yellow-200 dark:border-yellow-800">
              <p className="text-xs font-bold text-yellow-800 dark:text-yellow-400 tracking-tight">
                PROUDLY OPEN SOURCE
              </p>
              <p className="text-[10px] text-yellow-700 dark:text-yellow-500 mt-1">
                Contribute on GitHub and help us grow.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-100 dark:border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-medium text-neutral-400">
            © {new Date().getFullYear()} ValidCheck. Designed and built with ❤️
            by{" "}
            <span className="text-neutral-900 dark:text-neutral-50 font-bold">
              Valid
            </span>
          </p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
