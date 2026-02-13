"use client";
import { useState, useEffect, use } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
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
import { format } from "date-fns";
import { normalizeApiError } from "@/lib/normalizeApiError";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export default function CheckinPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const unwrappedParams = use(params);
  const [step, setStep] = useState<"email" | "details" | "done">("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isReturning, setIsReturning] = useState(false);
  const [attendeeId, setAttendeeId] = useState<string | null>(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [dob, setDob] = useState<Date | undefined>(undefined);

  const { useGetBySlug, useGetActivePages } = useCheckinPages();
  const pageQuery = useGetBySlug(unwrappedParams.slug);
  const activePagesQuery = useGetActivePages();

  const {
    useFindByEmail,
    create: createAttendee,
    update: updateAttendee,
  } = useAttendee();
  const findQuery = useFindByEmail(searchEmail);
  const { checkin } = useCheckin();

  const eventData = pageQuery.data?.data;
  const isInvalidPage =
    !pageQuery.isLoading && (!eventData || !eventData.isActive);

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

  useEffect(() => {
    if (findQuery.data?.data) {
      const attendee = findQuery.data.data;
      const page = eventData;

      setIsReturning(true);
      setAttendeeId(attendee.id);

      if (attendee.dateOfBirth) {
        setDob(new Date(attendee.dateOfBirth));
      }

      const needsPhone = page?.collectPhone && !attendee.phone;
      const needsDOB = page?.collectDOB && !attendee.dateOfBirth;

      if (needsPhone || needsDOB) {
        setStep("details");
      } else {
        const doAutoCheckin = async () => {
          try {
            let currentCoords = coords;
            if (page?.requireLocation && !currentCoords) {
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
            const errorMsg = normalizeApiError(err, "Failed to check in");
            setError(errorMsg);
          }
        };
        doAutoCheckin();
      }
    } else if (searchEmail && findQuery.isSuccess) {
      if (eventData && !eventData.allowSelfRegistration) {
        setError(
          "This event requires pre-registration. Please contact the administrator.",
        );
        setSearchEmail("");
        return;
      }
      setIsReturning(false);
      setAttendeeId(null);
      setStep("details");
    }
  }, [findQuery.data, findQuery.isSuccess, searchEmail, eventData]);

  const handleEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!email) return setError("Please enter a valid email.");
    setSearchEmail(email);
  };

  const handleDetails = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget as HTMLFormElement);
    const fullName = form.get("fullName") as string;
    const phone = form.get("phone") as string | undefined;

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
                    <motion.form
                      key="email-step"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onSubmit={handleEmail}
                      className="space-y-6"
                    >
                      <div className="space-y-4  w-full">
                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-[10px] font-black text-neutral-400 ml-1 uppercase tracking-widest"
                          >
                            Session Credentials (Email)
                          </Label>
                          <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-300 transition-colors group-focus-within:text-yellow-500" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="your@email.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="pl-14 h-16 rounded-2xl border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:bg-white text-lg transition-all font-medium"
                              required
                            />
                          </div>
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
                      <Button
                        type="submit"
                        className="w-full h-16 bg-neutral-900 hover:bg-black text-white dark:bg-yellow-400 dark:hover:bg-yellow-500 dark:text-yellow-950 font-black text-lg rounded-2xl border-none shadow-xl transition-all active:scale-[0.98]"
                        disabled={findQuery.isFetching}
                      >
                        {findQuery.isFetching ? (
                          <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        ) : (
                          "VERIFY IDENTITY"
                        )}
                      </Button>
                    </motion.form>
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
                      <div className="h-8 w-8 bg-white/10 dark:bg-black/10 rounded-full flex shrink-0 items-center justify-center">
                        <Activity className="w-4 h-4 text-white dark:text-yellow-950" />
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
                          defaultValue={findQuery.data?.data?.fullName || ""}
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
                          defaultValue={findQuery.data?.data?.phone || ""}
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
