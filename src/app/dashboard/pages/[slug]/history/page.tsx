"use client";

import { use, useState } from "react";
import { useCheckinPages } from "@/hooks";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { History, ArrowLeft, Search, Calendar as CalendarIcon, Clock, CheckCircle2, MapPin, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { NotFound } from "@/components/dashboard";

export default function CheckinHistoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { useGetBySlug, useGetCheckins } = useCheckinPages();
  const pageQuery = useGetBySlug(slug);
  const checkinsQuery = useGetCheckins(slug);

  const checkins = (checkinsQuery.data?.data || []) as any[];
  const filteredCheckins = checkins.filter(c => 
    c.attendee.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.attendee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isLoading = pageQuery.isLoading || checkinsQuery.isLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <Navbar />
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-10 h-10 animate-spin text-yellow-500" />
        </div>
      </div>
    );
  }

  if (pageQuery.isError || (!pageQuery.isLoading && !pageQuery.data?.data)) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <Navbar />
        <NotFound 
          title="History Log Not Found"
          message={`We are unable to retrieve check-in history for "${slug}". Verify the link or contact support.`}
          onRetry={() => pageQuery.refetch()}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans antialiased">
      <Navbar />
      <main className="container max-w-7xl mx-auto px-4 py-12">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-10 border-b border-neutral-200 dark:border-neutral-800">
            <div className="space-y-3">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-yellow-600 mb-2 transition-colors"
              >
                <ArrowLeft className="w-3 h-3 mr-2" /> Return to Console
              </Link>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-8 bg-yellow-400 rounded-full" />
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Verification Ledger</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-neutral-900 dark:text-neutral-50 flex items-center gap-4 uppercase italic">
                {pageQuery.data?.data?.title || slug}
              </h1>
              <p className="text-neutral-500 font-medium text-lg">
                Real-time check-in activity and verification logs.
              </p>
            </div>

            <Button variant="outline" className="h-16 px-10 rounded-[2rem] border-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 font-black text-lg shadow-xl transition-all hover:bg-neutral-50">
              <Download className="w-6 h-6 mr-3 text-yellow-500" /> Export Ledger
            </Button>
          </div>

          {/* Search & Stats */}
          <div className="flex flex-col md:flex-row gap-4">
             <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input 
                  placeholder="Search by attendee name..." 
                  className="pl-12 h-14 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm text-base focus:ring-2 ring-yellow-400/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="bg-white dark:bg-neutral-900 px-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex items-center gap-3 shadow-sm h-14">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400">Total Check-ins: {checkins.length}</span>
              </div>
          </div>

          {/* Records View */}
          <div className="space-y-4">
            {/* Desktop Table */}
            <Card className="hidden md:block rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-neutral-50 dark:bg-neutral-800/50">
                    <TableRow className="border-none">
                      <TableHead className="py-5 px-8 font-bold text-neutral-500 uppercase tracking-wider text-[10px]">Verification</TableHead>
                      <TableHead className="py-5 font-bold text-neutral-500 uppercase tracking-wider text-[10px]">Attendee</TableHead>
                      <TableHead className="py-5 font-bold text-neutral-500 uppercase tracking-wider text-[10px]">Time & Date</TableHead>
                      <TableHead className="py-5 px-8 font-bold text-neutral-500 uppercase tracking-wider text-[10px]">Device Info</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {filteredCheckins.length > 0 ? (
                        filteredCheckins.map((checkin) => (
                          <motion.tr
                            key={checkin.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="group border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors"
                          >
                            <TableCell className="py-5 px-8">
                              <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 rounded-lg px-2.5 py-1 font-bold text-[10px] flex items-center gap-1.5 w-fit uppercase tracking-tight">
                                  <CheckCircle2 className="w-3 h-3" /> Successfully Verified
                              </Badge>
                            </TableCell>
                            <TableCell className="py-5">
                              <div className="space-y-0.5">
                                <p className="font-bold text-neutral-900 dark:text-neutral-50">{checkin.attendee.fullName}</p>
                                <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-tight">{checkin.attendee.email}</p>
                              </div>
                            </TableCell>
                            <TableCell className="py-5">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm font-bold text-neutral-700 dark:text-neutral-300">
                                  {format(new Date(checkin.checkedInAt), 'MMM dd, yyyy')}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
                                  <Clock className="w-3.5 h-3.5 text-yellow-500" />
                                  {format(new Date(checkin.checkedInAt), 'hh:mm aaa')}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-5 px-8">
                               <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest bg-neutral-50 dark:bg-neutral-800 w-fit px-2 py-1 rounded">
                                  <MapPin className="w-3 h-3" /> Registered Client
                               </div>
                            </TableCell>
                          </motion.tr>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="h-64 text-center">
                            <NoResults icon={History} message="No check-in history found yet." />
                          </TableCell>
                        </TableRow>
                      )}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* Mobile Cards */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              <AnimatePresence mode="popLayout">
                {filteredCheckins.length > 0 ? (
                  filteredCheckins.map((checkin) => (
                    <motion.div
                      key={checkin.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-neutral-50">{checkin.attendee.fullName}</p>
                          <p className="text-xs text-neutral-500">{checkin.attendee.email}</p>
                        </div>
                        <Badge className="bg-green-50 text-green-700 border-green-200 rounded-lg text-[9px] font-black uppercase">
                          Verified
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-neutral-50 dark:border-neutral-800">
                        <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
                          <Clock className="w-3.5 h-3.5 text-yellow-500" />
                          {format(new Date(checkin.checkedInAt), 'MMM dd, hh:mm a')}
                        </div>
                        <MapPin className="w-3.5 h-3.5 text-neutral-300" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <NoResults icon={History} message="No check-ins recorded." />
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

function NoResults({ icon: Icon, message }: { icon: any, message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-3">
      <div className="h-12 w-12 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-neutral-400">
        <Icon className="w-6 h-6" />
      </div>
      <p className="font-bold text-neutral-500 text-sm">{message}</p>
    </div>
  );
}

