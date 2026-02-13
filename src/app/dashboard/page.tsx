"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Plus, Calendar, Loader2 } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useCheckinPages } from "@/hooks";
import {
  StatisticsCards,
  SearchAndFilter,
  CheckInPageCard,
  CheckInPagesTable,
  RecentActivity,
  PreviewDialog,
  DeleteConfirmationDialog,
  CheckInPage,
} from "@/components/dashboard";
export default function DashboardPage() {
  const [previewPage, setPreviewPage] = useState<CheckInPage | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const { useList, update, remove } = useCheckinPages();
  const listQuery = useList({ limit: 100, search: searchQuery });

  const pages: CheckInPage[] = (listQuery.data?.data || []).map((p: any) => ({
    id: p.id,
    title: p.title || p.slug,
    slug: p.slug,
    eventDate: p.eventDate || new Date().toISOString(),
    startTime: p.startTime || "",
    endTime: p.endTime || "",
    capacity: p.capacity || undefined,
    isActive: p.isActive ?? true,
    totalCheckIns: p._count?.checkIns || 0,
    isRecurring: p.isRecurring || false,
    recurrencePattern: p.recurrencePattern,
    createdAt: p.createdAt || new Date().toISOString(),
  }));

  // Filter pages based on search and status
  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && page.isActive) ||
      (statusFilter === "inactive" && !page.isActive);
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalCheckIns = pages.reduce(
    (sum, page) => sum + page.totalCheckIns,
    0,
  );
  const activePages = pages.filter((page) => page.isActive).length;
  const successRate =
    pages.length > 0
      ? Math.round(
          (pages.filter((page) => page.totalCheckIns > 0).length /
            pages.length) *
            100,
        )
      : 0;

  const handleDelete = (id: string) => {
    remove.mutate(id, {
      onSuccess: () => setDeleteConfirm(null),
    });
  };

  const handleToggleActive = (id: string) => {
    const page = pages.find((p) => p.id === id);
    if (!page) return;
    update.mutate({ id, isActive: !page.isActive });
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans antialiased">
      <Navbar />
      <main className="container max-w-7xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          {/* Enhanced Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-10 border-b border-neutral-200 dark:border-neutral-800">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1.5 w-8 bg-yellow-400 rounded-full" />
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">Management Console</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-neutral-900 dark:text-neutral-50 uppercase italic">
                Dashboard
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-lg font-medium max-w-2xl">
                Real-time insights and professional management for your participant check-in portals.
              </p>
            </div>
            <Button
              asChild
              className="h-16 px-10 rounded-[2rem] bg-neutral-900 hover:bg-black text-white dark:bg-yellow-400 dark:hover:bg-yellow-500 dark:text-yellow-950 font-black text-lg shadow-2xl shadow-neutral-200 dark:shadow-none transition-all active:scale-95 group border-none"
            >
              <Link
                href="/dashboard/create"
                className="flex items-center gap-3"
              >
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                Launch Portal
              </Link>
            </Button>
          </div>

          {/* Metrics Section */}
          <section className="relative">
            <div className="absolute inset-0 bg-yellow-400/5 blur-[100px] rounded-full -z-10" />
            <StatisticsCards
              totalCheckIns={totalCheckIns}
              activePages={activePages}
              totalPages={pages.length}
              successRate={successRate}
            />
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-12 pt-4">
            <div className="xl:col-span-3 space-y-10">
              <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-50 uppercase tracking-tight italic">
                    Active Portals
                  </h2>
                  <div className="bg-neutral-900 dark:bg-yellow-400 px-3 py-1 rounded-lg">
                    <span className="text-[10px] font-black text-white dark:text-yellow-950">
                      {filteredPages.length} TOTAL
                    </span>
                  </div>
                </div>
                <div className="w-full md:w-auto">
                  <SearchAndFilter
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    statusFilter={statusFilter}
                    onStatusFilterChange={setStatusFilter}
                  />
                </div>
              </div>

              {listQuery.isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-yellow-500" />
                </div>
              ) : filteredPages.length > 0 ? (
                <>
                  <div className="hidden lg:block bg-white dark:bg-neutral-900 rounded-2xl border shadow-sm overflow-hidden">
                    <CheckInPagesTable
                      pages={filteredPages}
                      onPreview={setPreviewPage}
                      onToggleActive={handleToggleActive}
                      onDelete={setDeleteConfirm}
                    />
                  </div>
                  <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredPages.map((page) => (
                      <CheckInPageCard
                        key={page.id}
                        page={page}
                        onPreview={setPreviewPage}
                        onToggleActive={handleToggleActive}
                        onDelete={setDeleteConfirm}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-neutral-900 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-[3rem] p-20 flex flex-col items-center text-center space-y-6"
                >
                  <div className="w-24 h-24 bg-neutral-50 dark:bg-neutral-800 rounded-[2rem] flex items-center justify-center shadow-inner">
                    <Calendar className="w-10 h-10 text-neutral-300 dark:text-neutral-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-neutral-900 dark:text-neutral-100 uppercase italic tracking-tight">
                      {searchQuery ? "No match found" : "Ready for takeoff"}
                    </h3>
                    <p className="text-neutral-500 max-w-sm font-medium">
                      {searchQuery
                        ? "We couldn't find any events matching your search keywords. Try different terms."
                        : "You haven't launched any check-in portals yet. Start your first session now."}
                    </p>
                  </div>
                  <Button
                    asChild
                    className="h-14 px-8 rounded-2xl bg-neutral-900 hover:bg-black text-white dark:bg-yellow-400 dark:hover:bg-yellow-500 dark:text-yellow-950 font-black shadow-xl"
                  >
                    <Link href="/dashboard/create">
                      {searchQuery
                        ? "Create new event"
                        : "Launch first portal"}
                    </Link>
                  </Button>
                </motion.div>
              )}
            </div>

            <div className="xl:col-span-1">
              <div className="sticky top-28 space-y-8">
                <div className="flex items-center justify-between px-2">
                  <h3 className="font-black text-xs uppercase tracking-[0.2em] text-neutral-400">Stream Activity</h3>
                  <div className="flex items-center gap-1.5 flex-row-reverse">
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Live</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  </div>
                </div>
                <RecentActivity />
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <PreviewDialog
        page={previewPage}
        open={!!previewPage}
        onOpenChange={(open) => !open && setPreviewPage(null)}
      />

      <DeleteConfirmationDialog
        open={!!deleteConfirm}
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
      />
      <Footer />
    </div>
  );
}
