"use client";
import React, { useState, useEffect, use, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Mail,
  User,
  Calendar,
  Loader2,
  ArrowRight,
  Activity,
  Search,
} from "lucide-react";
import { useCheckin, useAttendee, useCheckinPages } from "@/hooks";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { format, isAfter, endOfDay, isBefore, startOfDay } from "date-fns";
import { normalizeApiError } from "@/lib/normalizeApiError";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Info, Clock as ClockIcon, Calendar as CalendarDaysIcon } from "lucide-react";

export default function CheckinPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"email" | "details" | "done">("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isReturning, setIsReturning] = useState(false);
  const [attendeeId, setAttendeeId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [picture, setPicture] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [dob, setDob] = useState<Date | undefined>(undefined);
  const [isVerifyingGoogle, setIsVerifyingGoogle] = useState(false);
  const hasTriggeredExchange = useRef(false);

  const { useGetBySlug, useGetActivePages } = useCheckinPages();
  const pageQuery = useGetBySlug(unwrappedParams.slug);
  const activePagesQuery = useGetActivePages();

  const {
    create: createAttendee,
    update: updateAttendee,
    exchangeSession,
  } = useAttendee();
  const { checkin } = useCheckin();

  const eventData = pageQuery.data?.data;
  const isInvalidPage =
    !pageQuery.isLoading && (!eventData || !eventData.isActive);

  // Status Validation
  const getEventStatus = () => {
    if (!eventData) return null;
    if (!eventData.isActive) return { status: "INACTIVE", message: "This event portal has been deactivated by the organizer." };

    const now = new Date();
    
    if (eventData.isRecurring) {
      if (eventData.recurrenceEnd && isAfter(now, endOfDay(new Date(eventData.recurrenceEnd)))) {
        return { status: "EXPIRED", message: "This recurring event series has ended." };
      }

      // Pattern check
      const originalDate = new Date(eventData.eventDate);
      if (eventData.recurrencePattern === "WEEKLY") {
        if (now.getDay() !== originalDate.getDay()) {
          const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          return { status: "WRONG_DAY", message: `Check-in for this weekly series is only available on ${days[originalDate.getDay()]}s.` };
        }
      } else if (eventData.recurrencePattern === "MONTHLY") {
        if (now.getDate() !== originalDate.getDate()) {
          return { status: "WRONG_DAY", message: `Check-in for this monthly series is only available on the ${originalDate.getDate()}th of each month.` };
        }
      }

      // Time check
      if (eventData.startTime || eventData.endTime) {
        const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
        if (eventData.startTime) {
          const start = new Date(eventData.startTime);
          const startInMinutes = start.getHours() * 60 + start.getMinutes();
          if (currentTimeInMinutes < startInMinutes) {
            return { status: "NOT_STARTED", message: `Today's session hasn't started. Check-in opens at ${format(start, "p")}.` };
          }
        }
        if (eventData.endTime) {
          const end = new Date(eventData.endTime);
          const endInMinutes = end.getHours() * 60 + end.getMinutes();
          if (currentTimeInMinutes > endInMinutes) {
            return { status: "CLOSED", message: "Today's check-in window has already closed." };
          }
        }
      }
    } else {
      const eventDate = new Date(eventData.eventDate);
      if (!isSameDay(now, eventDate)) {
        if (isBefore(now, startOfDay(eventDate))) {
          return { status: "UPCOMING", message: `This event is scheduled for ${format(eventDate, "PPPP")}. Registration isn't open yet.` };
        } else {
          return { status: "EXPIRED", message: "The registration period for this event has expired." };
        }
      }

      if (eventData.startTime && isBefore(now, new Date(eventData.startTime))) {
        return { status: "NOT_STARTED", message: `Check-in opens at ${format(new Date(eventData.startTime), "p")}.` };
      }
      if (eventData.endTime && isAfter(now, new Date(eventData.endTime))) {
        return { status: "CLOSED", message: "Check-in for this event has closed." };
      }
    }

    return { status: "ACTIVE" };
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const eventStatus = getEventStatus();

  // Handle Google Session Exchange
  useEffect(() => {
    const sessionCode = searchParams.get("session_code");
    const authError = searchParams.get("error");

    if (authError) {
      setError(authError);
    }

    if (sessionCode && !hasTriggeredExchange.current && eventData) {
      hasTriggeredExchange.current = true;
      setIsVerifyingGoogle(true);
      exchangeSession.mutate(
        { sessionCode, slug: unwrappedParams.slug },
        {
          onSuccess: async (res: any) => {
            setIsVerifyingGoogle(false);
            
            // Handle different response structures if necessary
            const data = res.data || res;
            const attendee = data.attendee;
            const alreadyCheckedIn = data.alreadyCheckedIn;

            if (!attendee) {
              setError("Failed to retrieve attendee data.");
              return;
            }

            setEmail(attendee.email);
            setFullName(attendee.fullName || "");
            setPicture(attendee.picture || null);
            setPhone(attendee.phone || "");
            setAttendeeId(attendee.id);
            setIsReturning(true);

            if (attendee.dateOfBirth) {
              setDob(new Date(attendee.dateOfBirth));
            }

            // Clear the session_code from the URL
            router.replace(`/checkin/${unwrappedParams.slug}`);

            if (alreadyCheckedIn) {
              setStep("done");
              return;
            }

            // Move to details to confirm/fill rest, or auto-checkin if everything is there
            const page = eventData;
            const needsPhone = page?.collectPhone && !attendee.phone;
            const needsDOB = page?.collectDOB && !attendee.dateOfBirth;

            if (needsPhone || needsDOB) {
              setStep("details");
            } else {
              // Auto check-in if we have everything
              if (page) {
                try {
                  let currentCoords = coords;
                  if (page.requireLocation && !currentCoords) {
                    currentCoords = await fetchLocation();
                    setCoords(currentCoords);
                  }
                  await checkin.mutateAsync({
                    checkInPageId: page.id,
                    attendeeId: attendee.id,
                    latitude: currentCoords?.lat,
                    longitude: currentCoords?.lng,
                  });
                  setStep("done");
                } catch (err: any) {
                  setError(normalizeApiError(err, "Failed to check in"));
                  setStep("details");
                }
              } else {
                setStep("details");
              }
            }
          },
          onError: (err: any) => {
            setIsVerifyingGoogle(false);
            hasTriggeredExchange.current = false;
            setError(normalizeApiError(err, "Google verification failed."));
            // Also clear params on error so they don't get stuck
            router.replace(`/checkin/${unwrappedParams.slug}`);
          },
        },
      );
    }
  }, [
    searchParams,
    exchangeSession,
    eventData,
    coords,
    unwrappedParams.slug,
    router,
  ]);

  const fetchLocation = async (): Promise<{
    lat: number;
    lng: number;
  } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 5000 },
      );
    });
  };

  const handleDetails = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Using state instead of FormData for controlled inputs
    if (!eventData) {
      setError("Invalid check-in page.");
      return;
    }

    try {
      let currentCoords = coords;
      if (eventData.requireLocation && !currentCoords) {
        currentCoords = await fetchLocation();
        if (!currentCoords) {
          setError("Location access is required for this event.");
          return;
        }
        setCoords(currentCoords);
      }

      let finalAttendeeId = attendeeId;
      if (isReturning && finalAttendeeId) {
        const updateData: any = { id: finalAttendeeId };
        if (fullName) updateData.fullName = fullName;
        if (phone) updateData.phone = phone;
        if (dob) updateData.dateOfBirth = dob.toISOString();
        await updateAttendee.mutateAsync(updateData);
      } else {
        const created = await createAttendee.mutateAsync({
          email,
          fullName,
          phone,
          dateOfBirth: dob ? dob.toISOString() : undefined,
        });
        finalAttendeeId =
          created.data?.id || created.id || created.data?.data?.id;
      }

      if (finalAttendeeId) {
        await checkin.mutateAsync({
          checkInPageId: eventData.id,
          attendeeId: finalAttendeeId,
          latitude: currentCoords?.lat,
          longitude: currentCoords?.lng,
        });
        setStep("done");
      }
    } catch (err: any) {
      const errorMsg = normalizeApiError(err, "Something went wrong.");
      setError(errorMsg);
    }
  };

  if (isInvalidPage) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col antialiased font-sans">
        <Navbar />
        <main className="flex-1 container max-w-2xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="text-center space-y-3">
              <div className="bg-yellow-400 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-yellow-200 mb-6">
                <Search className="w-8 h-8 text-yellow-950" />
              </div>
              <h1 className="text-4xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight">
                Select an Event
              </h1>
              <p className="text-neutral-500 font-medium text-lg">
                The page you were looking for doesn&apos;t exist or is closed.
                Please select an active session below.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {activePagesQuery.isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
                </div>
              ) : activePagesQuery.data?.data?.length > 0 ? (
                activePagesQuery.data.data.map((page: any) => (
                  <Link key={page.id} href={`/checkin/${page.slug}`}>
                    <Card className="hover:border-yellow-400 border-2 transition-all group overflow-hidden cursor-pointer shadow-sm hover:shadow-md rounded-2xl">
                      <CardContent className="p-6 flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-bold text-xl text-neutral-900 dark:text-neutral-50 group-hover:text-yellow-600 transition-colors uppercase tracking-tight">
                            {page.title}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-neutral-500 font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-yellow-500" />{" "}
                              {format(new Date(page.eventDate), "PPP")}
                            </span>
                            <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded font-mono lowercase tracking-normal">
                              /{page.slug}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-6 h-6 text-neutral-300 group-hover:translate-x-1 group-hover:text-yellow-500 transition-all" />
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-[2.5rem] border-2 border-dashed border-neutral-200 dark:border-neutral-800">
                  <Activity className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <p className="font-bold text-neutral-400">
                    No active events found at the moment.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col antialiased font-sans">
      <Navbar />
      <main className="flex-1 container max-w-lg mx-auto px-4 py-16 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10 space-y-2">
            <h1 className="text-4xl font-black text-neutral-900 dark:text-neutral-50 tracking-tighter uppercase italic">
              {eventData?.title || "Check-In"}
            </h1>
            <div className="flex items-center justify-center gap-2">
              <div className="h-1 w-8 bg-yellow-400 rounded-full" />
              <p className="text-neutral-400 font-bold text-[10px] uppercase tracking-[0.3em]">
                Identity Verification
              </p>
              <div className="h-1 w-8 bg-yellow-400 rounded-full" />
            </div>
          </div>

          <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden bg-white dark:bg-neutral-900">
            <div className="h-2 bg-yellow-400 w-full" />
            <CardContent className="p-10 md:p-12">
              <AnimatePresence mode="wait">
                {pageQuery.isLoading ? (
                  <div
                    key="loading"
                    className="flex flex-col items-center justify-center py-12 gap-4"
                  >
                    <Loader2 className="w-10 h-10 animate-spin text-yellow-500" />
                    <p className="font-bold text-neutral-400 uppercase tracking-widest text-[10px]">
                      Accessing Network...
                    </p>
                  </div>
                ) : (
                  step === "email" && (
                    <motion.div
                      key="email-step"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8"
                    >
                      {/* Google Sign In Only */}
                      <div className="space-y-6">
                        <div className="bg-neutral-50 dark:bg-neutral-950 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 text-center space-y-4">
                          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">
                            Secure Session Access
                          </p>
                          
                          {eventStatus?.status !== "ACTIVE" && eventStatus?.message && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 border-2 border-yellow-200 dark:border-yellow-800/50 p-6 rounded-2xl text-left space-y-2 mb-4 animate-in fade-in slide-in-from-top-2">
                              <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                                <ClockIcon className="w-5 h-5" />
                                <span className="font-black uppercase tracking-widest text-xs italic">Temporal Notice</span>
                              </div>
                              <p className="text-sm font-bold text-yellow-900 dark:text-yellow-200 leading-relaxed">
                                {eventStatus.message}
                              </p>
                            </div>
                          )}

                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              window.location.href = `/api/auth/google?type=attendee&slug=${unwrappedParams.slug}`;
                            }}
                            className={cn(
                              "w-full h-20 rounded-[2rem] border-2 border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all font-bold flex items-center justify-center gap-4 group relative overflow-hidden shadow-sm hover:shadow-md",
                              eventStatus?.status !== "ACTIVE" && "opacity-50 grayscale pointer-events-none"
                            )}
                            disabled={isVerifyingGoogle || eventStatus?.status !== "ACTIVE"}
                          >
                            {isVerifyingGoogle ? (
                              <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                            ) : (
                              <>
                                <svg
                                  className="w-6 h-6 group-hover:scale-110 transition-transform"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                  />
                                  <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                  />
                                  <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                    fill="#FBBC05"
                                  />
                                  <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                  />
                                </svg>
                                <span className="text-neutral-900 dark:text-neutral-100 text-lg uppercase tracking-tight">
                                  CONTINUE WITH GOOGLE
                                </span>
                              </>
                            )}
                          </Button>
                          <p className="text-[9px] text-neutral-400 font-medium leading-relaxed">
                            To ensure event security, we use Google for instant
                            identity verification. Your data is handled
                            according to our Privacy Policy.
                          </p>
                        </div>

                        {error && (
                          <Alert
                            variant="destructive"
                            className="rounded-2xl border-red-100 bg-red-50 text-red-600 font-bold text-xs uppercase"
                          >
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </motion.div>
                  )
                )}

                {step === "details" && (
                  <motion.form
                    key="details-step"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleDetails}
                    className="space-y-6"
                  >
                    <div className="bg-neutral-900 dark:bg-yellow-400 p-5 rounded-2xl shadow-lg flex items-center justify-between mb-4">
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-[9px] font-black text-neutral-400 dark:text-yellow-900 uppercase tracking-widest">
                          Verified
                        </p>
                        <p className="text-sm font-black text-white dark:text-yellow-950 truncate">
                          {email}
                        </p>
                      </div>
                      <div className="flex -space-x-2">
                        {picture ? (
                          <div className="h-10 w-10 rounded-full border-2 border-white dark:border-neutral-900 overflow-hidden shadow-sm">
                            <img
                              src={picture}
                              alt={fullName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-full border-2 border-white dark:border-neutral-900 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shadow-sm">
                            <span className="text-[10px] font-black text-neutral-500">
                              {fullName?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="h-10 w-10 bg-white/10 dark:bg-black/10 rounded-full flex shrink-0 items-center justify-center border-2 border-white dark:border-neutral-900">
                          <Activity className="w-4 h-4 text-white dark:text-yellow-950" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="fullName"
                        className="text-[10px] font-black text-neutral-400 ml-1 uppercase tracking-widest"
                      >
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-300" />
                        <Input
                          id="fullName"
                          name="fullName"
                          placeholder="Your official name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-14 h-16 rounded-2xl border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:bg-white transition-all font-medium"
                          required
                        />
                      </div>
                    </div>

                    {eventData?.collectPhone && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="phone"
                          className="text-[10px] font-black text-neutral-400 ml-1 uppercase tracking-widest"
                        >
                          Phone Contact
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="+1 (555) 000-0000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="h-16 rounded-2xl border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:bg-white transition-all font-medium"
                          required
                        />
                      </div>
                    )}

                    {eventData?.collectDOB && (
                      <div className="space-y-2">
                        <Label
                          htmlFor="dateOfBirth"
                          className="text-[10px] font-black text-neutral-400 ml-1 uppercase tracking-widest"
                        >
                          Birth Date (Day & Month)
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-14 h-16 rounded-2xl border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:bg-white transition-all font-medium justify-start text-left",
                                !dob && "text-muted-foreground",
                              )}
                            >
                              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-300" />
                              {dob ? (
                                format(dob, "MMMM do")
                              ) : (
                                <span>Select date</span>
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
                    )}

                    {error && (
                      <Alert
                        variant="destructive"
                        className="rounded-2xl border-2 border-red-200 bg-red-50 text-red-900 animate-in fade-in slide-in-from-top-2"
                      >
                        <AlertDescription className="text-xs font-bold uppercase">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="pt-4 space-y-4">
                      <Button
                        type="submit"
                        className="w-full h-16 bg-neutral-900 hover:bg-black text-white dark:bg-yellow-400 dark:hover:bg-yellow-500 dark:text-yellow-950 font-black text-lg rounded-2xl border-none shadow-xl transition-all active:scale-[0.98]"
                        disabled={createAttendee.isPending || checkin.isPending}
                      >
                        {createAttendee.isPending || checkin.isPending ? (
                          <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        ) : (
                          "FINALIZE CHECK-IN"
                        )}
                      </Button>
                      <button
                        type="button"
                        className="w-full text-center text-[10px] font-black text-neutral-400 uppercase tracking-widest hover:text-neutral-600 transition-colors"
                        onClick={() => setStep("email")}
                      >
                        Restart Session
                      </button>
                    </div>
                  </motion.form>
                )}

                {step === "done" && (
                  <motion.div
                    key="done-step"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <div className="w-28 h-28 bg-green-50 dark:bg-green-900/20 rounded-[3rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-green-100 dark:border-green-800">
                      <CheckCircle className="w-14 h-14 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-4xl font-black text-neutral-900 dark:text-neutral-50 mb-4 tracking-tighter uppercase italic">
                      Verified
                    </h2>
                    <p className="text-neutral-500 font-bold mb-10 max-w-70 mx-auto text-xs leading-relaxed uppercase tracking-widest text-center">
                      Session confirmation for{" "}
                      <span className="text-neutral-900 dark:text-neutral-200 border-b-2 border-yellow-400 px-1">
                        {eventData?.title}
                      </span>
                    </p>

                    <div className="bg-neutral-50 dark:bg-neutral-950 rounded-[2rem] p-8 mb-10 text-neutral-800 dark:text-neutral-200 font-black border border-neutral-100 dark:border-neutral-800 shadow-sm uppercase tracking-tight text-xs leading-relaxed">
                      {eventData?.successMessage ||
                        (isReturning
                          ? "Success. Access Granted. Welcome back to the session."
                          : "Registration Success. Your profile data is now live.")}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
