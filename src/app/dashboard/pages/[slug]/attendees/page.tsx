"use client";

import { use, useState } from "react";
import { useCheckinPages, useAttendee } from "@/hooks";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  ArrowLeft,
  Search,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { NotFound } from "@/components/dashboard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export default function AttendeesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dob, setDob] = useState<Date | undefined>(undefined);

  const { useGetBySlug, useGetAttendees } = useCheckinPages();
  const { create: createAttendee } = useAttendee();

  const pageQuery = useGetBySlug(slug);
  const attendeesQuery = useGetAttendees(slug);

  const attendees = (attendeesQuery.data?.data || []) as any[];
  const filteredAttendees = attendees.filter(
    (a) =>
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddAttendee = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;

    await createAttendee.mutateAsync({
      email,
      fullName,
      phone: phone || undefined,
      dateOfBirth: dob ? dob.toISOString() : undefined,
    });

    setIsAddOpen(false);
    setDob(undefined);
    attendeesQuery.refetch();
  };

  const isLoading = pageQuery.isLoading || attendeesQuery.isLoading;

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
          title="Event Not Found"
          message={`We couldn't find any check-in portal with the identifier "${slug}".`}
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
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">
                  Attendee Directory
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-neutral-900 dark:text-neutral-50 flex items-center gap-4 uppercase italic">
                {pageQuery.data?.data?.title || slug}
              </h1>
              <p className="text-neutral-500 font-medium text-lg">
                Manage and view verified participants for this session.
              </p>
            </div>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="h-16 px-10 rounded-[2rem] bg-neutral-900 hover:bg-black text-white dark:bg-yellow-400 dark:hover:bg-yellow-500 dark:text-yellow-950 font-black text-lg shadow-2xl transition-all active:scale-95 border-none">
                  <UserPlus className="w-6 h-6 mr-3" /> Add Participant
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl rounded-[2.5rem] border-2 border-neutral-100 dark:border-neutral-800 shadow-2xl p-0 overflow-hidden bg-white dark:bg-neutral-950">
                <div className="p-10 pb-6 border-b border-neutral-50 dark:border-neutral-900">
                  <DialogHeader className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-neutral-900 dark:bg-neutral-50 rounded-2xl text-white dark:text-neutral-900">
                        <UserPlus className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-6 bg-yellow-400 rounded-full" />
                          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">
                            Manual Entry
                          </span>
                        </div>
                        <DialogTitle className="text-3xl font-black text-neutral-900 dark:text-neutral-50 tracking-tighter uppercase italic">
                          New Participant
                        </DialogTitle>
                      </div>
                    </div>
                    <p className="text-neutral-400 font-medium text-sm">
                      Register an attendee for this session manually.
                      Verification will be logged as an administrative action.
                    </p>
                  </DialogHeader>
                </div>

                <form
                  onSubmit={handleAddAttendee}
                  className="p-10 space-y-8 bg-neutral-50/50 dark:bg-neutral-950"
                >
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black text-neutral-400 ml-1 uppercase tracking-widest italic">
                        Full Name
                      </Label>
                      <Input
                        name="fullName"
                        placeholder="e.g. ALEX RIVERA"
                        required
                        className="h-14 rounded-2xl border-2 border-neutral-50 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-6 font-bold text-lg focus:border-yellow-400 focus:ring-0 transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black text-neutral-400 ml-1 uppercase tracking-widest italic">
                        Email Node
                      </Label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="alex@example.com"
                        required
                        className="h-14 rounded-2xl border-2 border-neutral-50 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-6 font-bold text-lg focus:border-yellow-400 focus:ring-0 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black text-neutral-400 ml-1 uppercase tracking-widest italic">
                          Phone
                        </Label>
                        <Input
                          name="phone"
                          placeholder="+1..."
                          className="h-14 rounded-2xl border-2 border-neutral-50 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-6 font-bold text-lg focus:border-yellow-400 focus:ring-0 transition-all"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black text-neutral-400 ml-1 uppercase tracking-widest italic">
                          DOB (Day & Month)
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full h-14 rounded-2xl border-2 border-neutral-50 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-6 font-bold text-left justify-start transition-all",
                                !dob && "text-neutral-400",
                              )}
                            >
                              <CalendarIcon className="w-4 h-4 mr-2 opacity-50" />
                              {dob ? (
                                format(dob, "MMMM do")
                              ) : (
                                <span>Select...</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0 rounded-3xl overflow-hidden border-none shadow-2xl"
                            align="start"
                          >
                            <CalendarComponent
                              mode="single"
                              selected={dob}
                              onSelect={setDob}
                              autoFocus
                              className="p-4"
                              formatters={{
                                formatCaption: (date) => format(date, "MMMM"),
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col gap-4">
                    <Button
                      type="submit"
                      disabled={createAttendee.isPending}
                      className="w-full h-16 bg-yellow-400 hover:bg-yellow-500 text-neutral-900 font-black text-lg rounded-[2rem] border-none shadow-xl shadow-yellow-400/20 transition-all active:scale-95 uppercase italic tracking-widest"
                    >
                      {createAttendee.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-3" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 mr-3" />
                      )}
                      Finalize Entry
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsAddOpen(false)}
                      className="h-12 rounded-[2rem] font-black uppercase text-[10px] tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
                    >
                      Discard & Close
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats & Search */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-3">
              <div className="p-8 bg-white dark:bg-neutral-900 rounded-[2rem] border-2 border-neutral-100 dark:border-neutral-800 shadow-xl shadow-neutral-100/50 dark:shadow-none relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Users className="w-20 h-20 text-neutral-900 dark:text-neutral-50" />
                </div>
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] mb-2">
                  Live Registry
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-black text-neutral-900 dark:text-neutral-50 tracking-tighter italic">
                    {attendees.length}
                  </p>
                  <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">
                    Participants
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-9">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-300 group-focus-within:text-yellow-500 transition-colors" />
                <Input
                  placeholder="Query by identity, network address or handle..."
                  className="pl-16 h-20 rounded-[2rem] border-2 border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl shadow-neutral-100/50 dark:shadow-none text-lg font-bold focus:border-yellow-400 transition-all focus:ring-0"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
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
                      <TableHead className="py-5 px-8 font-bold text-neutral-500 uppercase tracking-wider text-[10px]">
                        Attendee
                      </TableHead>
                      <TableHead className="py-5 font-bold text-neutral-500 uppercase tracking-wider text-[10px]">
                        Contact Information
                      </TableHead>
                      <TableHead className="py-5 font-bold text-neutral-500 uppercase tracking-wider text-[10px]">
                        Registration Date
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {filteredAttendees.length > 0 ? (
                        filteredAttendees.map((attendee) => (
                          <motion.tr
                            key={attendee.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="group border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors"
                          >
                            <TableCell className="py-5 px-8">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-700 dark:text-yellow-400 font-bold text-sm">
                                  {attendee.fullName.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-neutral-900 dark:text-neutral-50 leading-tight">
                                    {attendee.fullName}
                                  </span>
                                  {attendee.dateOfBirth && (
                                    <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest mt-0.5">
                                      Born: {format(new Date(attendee.dateOfBirth), "MMMM do")}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-5">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                                  <Mail className="w-3.5 h-3.5 opacity-50" />{" "}
                                  {attendee.email}
                                </div>
                                {attendee.phone && (
                                  <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                                    <Phone className="w-3.5 h-3.5 opacity-50" />{" "}
                                    {attendee.phone}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-5">
                              <div className="flex items-center gap-2 text-sm font-medium text-neutral-500">
                                <CalendarIcon className="w-3.5 h-3.5 opacity-50" />
                                {format(
                                  new Date(attendee.createdAt),
                                  "MMM dd, yyyy",
                                )}
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="h-64 text-center">
                            <NoResults
                              icon={Users}
                              message="No attendees found matching your criteria."
                            />
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
                {filteredAttendees.length > 0 ? (
                  filteredAttendees.map((attendee) => (
                    <motion.div
                      key={attendee.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white dark:bg-neutral-900 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-700 dark:text-yellow-400 font-bold">
                          {attendee.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-neutral-50">
                            {attendee.fullName}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-neutral-500">
                              {format(
                                new Date(attendee.createdAt),
                                "MMM dd, yyyy",
                              )}
                            </p>
                            {attendee.dateOfBirth && (
                              <span className="h-1 w-1 rounded-full bg-neutral-300" />
                            )}
                            {attendee.dateOfBirth && (
                              <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest leading-none">
                                {format(new Date(attendee.dateOfBirth), "MMMM do")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2 pt-2 border-t border-neutral-50 dark:border-neutral-800">
                        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <Mail className="w-3.5 h-3.5 opacity-50" />{" "}
                          {attendee.email}
                        </div>
                        {attendee.phone && (
                          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                            <Phone className="w-3.5 h-3.5 opacity-50" />{" "}
                            {attendee.phone}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <NoResults icon={Users} message="No attendees found." />
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

function NoResults({ icon: Icon, message }: { icon: any; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-3">
      <div className="h-12 w-12 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-neutral-400">
        <Icon className="w-6 h-6" />
      </div>
      <p className="font-bold text-neutral-500 text-sm">{message}</p>
    </div>
  );
}
