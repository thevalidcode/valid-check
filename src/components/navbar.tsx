"use client";

import { Button } from "@/components/ui/button";
import { useOrganizer } from "@/hooks";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, LayoutDashboard, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function Navbar() {
  const { meQuery, logout } = useOrganizer();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = !!meQuery.data;
  const user = meQuery.data;

  // Check if we are on a public check-in page
  const isCheckinPage = pathname?.startsWith("/checkin/");

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b bg-white/70 dark:bg-neutral-950/70 backdrop-blur-md border-neutral-200 dark:border-neutral-800"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-neutral-900 dark:text-neutral-50">
              Valid<span className="text-primary">Check</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {!isCheckinPage && (
              <Link
                href="/#features"
                className="text-sm font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                Features
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isCheckinPage ? null : isAuthenticated ? (
            <>
              <Button
                asChild
                variant="ghost"
                className="hidden sm:flex rounded-full px-4 text-sm font-bold text-neutral-600 hover:text-yellow-700 hover:bg-yellow-50 transition-all"
              >
                <Link href="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Console
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 p-0 border border-neutral-200 dark:border-neutral-700"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 mt-2 rounded-xl p-1 shadow-xl"
                  align="end"
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1 p-1">
                      <p className="text-sm font-bold leading-none">
                        {user?.email?.split("@")[0]}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    asChild
                    className="rounded-lg cursor-pointer"
                  >
                    <Link href="/dashboard" className="flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      logout.mutate();
                      router.push("/");
                    }}
                    className="text-red-600 dark:text-red-400 rounded-lg cursor-pointer font-semibold"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                asChild
                className="rounded-full px-5 text-sm font-bold"
              >
                <Link href="/auth">Sign In</Link>
              </Button>
              <Button
                asChild
                className="rounded-full px-6 bg-primary hover:bg-yellow-700 shadow-md shadow-yellow-200 dark:shadow-none font-bold"
              >
                <Link href="/auth">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
