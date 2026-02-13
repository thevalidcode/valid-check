"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Users,
  Save,
  Check,
  Globe,
  Layout,
  Repeat,
  UserPlus,
  Loader2,
  CalendarDays,
  MapPin,
  Map,
  ShieldCheck,
  Zap,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { useCheckinPages } from "@/hooks";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { normalizeApiError } from "@/lib/normalizeApiError";

interface CheckInPageForm {
  title: string;
  slug: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  capacity: string;
  isActive: boolean;
  isRecurring: boolean;
  recurrencePattern: string;
  recurrenceEnd: string;
  collectPhone: boolean;
  collectDOB: boolean;
  allowSelfRegistration: boolean;
  requireLocation: boolean;
  latitude: string;
  longitude: string;
  radius: string;
  successMessage: string;
}

function CreateCheckInPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEditing = !!editId;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CheckInPageForm>({
    title: "",
    slug: "",
    description: "",
    eventDate: format(new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "17:00",
    capacity: "",
    isActive: true,
    isRecurring: false,
    recurrencePattern: "DAILY",
    recurrenceEnd: "",
    collectPhone: false,
    collectDOB: false,
    allowSelfRegistration: true,
    requireLocation: false,
    latitude: "",
    longitude: "",
    radius: "100",
    successMessage: "You have been successfully checked in.",
  });

  const { useList, create, update } = useCheckinPages();
  const listQuery = useList({ limit: 100 });

  const isLoadingData = listQuery.isLoading || (isEditing && !listQuery.data);

  useEffect(() => {
    if (isEditing && editId) {
      const found = (listQuery.data?.data || []).find(
        (p: any) => p.id === editId,
      );
      if (found) {
        setFormData({
          title: found.title || found.slug,
          slug: found.slug,
          description: found.description || "",
          eventDate: found.eventDate
            ? new Date(found.eventDate).toISOString().slice(0, 10)
            : "",
          startTime: found.startTime || "",
          endTime: found.endTime || "",
          capacity: found.capacity ? String(found.capacity) : "",
          isActive: found.isActive ?? true,
          isRecurring: found.isRecurring ?? false,
          recurrencePattern: found.recurrencePattern || "DAILY",
          recurrenceEnd: found.recurrenceEnd
            ? new Date(found.recurrenceEnd).toISOString().slice(0, 10)
            : "",
          collectPhone: found.collectPhone ?? false,
          collectDOB: found.collectDOB ?? false,
          allowSelfRegistration: found.allowSelfRegistration ?? true,
          requireLocation: found.requireLocation ?? false,
          latitude: found.latitude ? String(found.latitude) : "",
          longitude: found.longitude ? String(found.longitude) : "",
          radius: found.radius ? String(found.radius) : "100",
          successMessage:
            found.successMessage || "You have been successfully checked in.",
        });
      }
    }
  }, [isEditing, editId, listQuery.data]);

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-yellow-500" />
        </div>
      </div>
    );
  }

  const handleInputChange = (field: keyof CheckInPageForm, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "title" && typeof value === "string" && !isEditing) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        handleInputChange("latitude", position.coords.latitude.toString());
        handleInputChange("longitude", position.coords.longitude.toString());
      },
      () => {
        alert("Unable to retrieve your location");
      },
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: any = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description || undefined,
        eventDate: formData.eventDate,
        startTime: formData.startTime || undefined,
        endTime: formData.endTime || undefined,
        capacity: formData.capacity ? Number(formData.capacity) : undefined,
        isActive: formData.isActive,
        isRecurring: formData.isRecurring,
        recurrencePattern: formData.isRecurring
          ? formData.recurrencePattern
          : undefined,
        recurrenceEnd:
          formData.isRecurring && formData.recurrenceEnd
            ? formData.recurrenceEnd
            : undefined,
        collectPhone: formData.collectPhone,
        collectDOB: formData.collectDOB,
        allowSelfRegistration: formData.allowSelfRegistration,
        requireLocation: formData.requireLocation,
        latitude: formData.latitude ? Number(formData.latitude) : undefined,
        longitude: formData.longitude ? Number(formData.longitude) : undefined,
        radius: formData.radius ? Number(formData.radius) : undefined,
        successMessage: formData.successMessage || undefined,
      };

      if (isEditing && editId) {
        await update.mutateAsync({ id: editId, ...payload });
      } else {
        await create.mutateAsync(payload);
      }

      router.push("/dashboard");
    } catch (err: any) {
      const errorMsg = normalizeApiError(
        err,
        `Failed to ${isEditing ? "update" : "create"} check-in page.`,
      );
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Navbar />
      <main className="container max-w-5xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-10 border-b border-neutral-200 dark:border-neutral-800">
            <div className="space-y-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-yellow-600 mb-2 transition-colors"
              >
                <ArrowLeft className="w-3 h-3 mr-2" /> Back to Console
              </Link>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-8 bg-yellow-400 rounded-full" />
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">
                  {isEditing ? "Portal Configuration" : "Global Launch"}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-neutral-900 dark:text-neutral-50 flex items-center gap-4 uppercase italic">
                {isEditing ? "Edit Portal" : "New Console"}
              </h1>
              <p className="text-neutral-500 font-medium text-lg">
                {isEditing
                  ? "Refining verification parameters and security rules."
                  : "Architect a new premium check-in ecosystem for your event."}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12"
          >
            <div className="lg:col-span-8 space-y-12">
              {/* Basic Info Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-neutral-900 dark:bg-neutral-50 rounded-xl text-neutral-50 dark:text-neutral-900">
                    <Layout className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight italic">
                    Identity & Routing
                  </h2>
                </div>

                <Card className="rounded-[2rem] border-2 border-neutral-200 dark:border-neutral-800 shadow-2xl shadow-neutral-200/50 dark:shadow-none overflow-hidden">
                  <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-1 gap-8">
                      <div className="space-y-3">
                        <Label
                          htmlFor="title"
                          className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1"
                        >
                          Event Designation
                        </Label>
                        <Input
                          id="title"
                          placeholder="e.g. EXECUTIVE SUMMIT 2026"
                          value={formData.title}
                          onChange={(e) =>
                            handleInputChange("title", e.target.value)
                          }
                          className="h-14 rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 px-6 text-lg font-bold focus:border-yellow-400 focus:ring-0 transition-all"
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="slug"
                          className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1"
                        >
                          Public Access Route
                        </Label>
                        <div className="flex group">
                          <span className="inline-flex items-center px-6 text-sm font-black uppercase text-neutral-400 bg-neutral-50 dark:bg-neutral-900 border-2 border-r-0 rounded-l-2xl border-neutral-100 dark:border-neutral-800 transition-colors group-focus-within:border-yellow-400">
                            /checkin/
                          </span>
                          <Input
                            id="slug"
                            placeholder="event-handle"
                            value={formData.slug}
                            onChange={(e) =>
                              handleInputChange("slug", e.target.value)
                            }
                            className="rounded-l-none rounded-r-2xl h-14 border-2 border-neutral-100 dark:border-neutral-800 px-6 text-lg font-bold focus:border-yellow-400 focus:ring-0 transition-all"
                            required
                            disabled={isEditing}
                          />
                        </div>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider ml-1">
                          {isEditing
                            ? "ACCESS ROUTE IS LOCKED TO MAINTAIN LINK INTEGRITY."
                            : "CHOOSE A UNIQUE ALPHANUMERIC HANDLE."}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="description"
                          className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1"
                        >
                          Portal Description
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="Briefly describe the event scope and instructions for attendees..."
                          value={formData.description}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                          className="rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 p-6 text-lg font-medium focus:border-yellow-400 focus:ring-0 transition-all resize-none min-h-30"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Security & Logic Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-yellow-400 rounded-xl text-neutral-900">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight italic">
                    Verification Protocols
                  </h2>
                </div>

                <Card className="rounded-[2rem] border-2 border-neutral-200 dark:border-neutral-800 shadow-2xl shadow-neutral-200/50 dark:shadow-none">
                  <CardContent className="p-8 space-y-10">
                    {/* Self Registration Toggle */}
                    <div className="flex items-center justify-between p-6 bg-neutral-50 dark:bg-neutral-900/50 rounded-3xl border border-neutral-100 dark:border-neutral-800">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 font-black uppercase tracking-tight text-lg italic">
                          <UserPlus className="w-5 h-5 text-yellow-500" />
                          Self-Registration
                        </div>
                        <p className="text-sm text-neutral-500 font-medium">
                          Allow non-whitelisted attendees to register on the
                          fly.
                        </p>
                      </div>
                      <Switch
                        checked={formData.allowSelfRegistration}
                        onCheckedChange={(val) =>
                          handleInputChange("allowSelfRegistration", val)
                        }
                        className="data-[state=checked]:bg-yellow-400"
                      />
                    </div>

                    {/* Geofencing Controls */}
                    <div className="space-y-8">
                      <div className="flex items-center justify-between px-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 font-black uppercase tracking-tight text-lg italic">
                            <MapPin className="w-5 h-5 text-yellow-500" />
                            Geofencing Verification
                          </div>
                          <p className="text-sm text-neutral-500 font-medium">
                            Enforce check-ins within a specific geographic
                            radius.
                          </p>
                        </div>
                        <Switch
                          checked={formData.requireLocation}
                          onCheckedChange={(val) =>
                            handleInputChange("requireLocation", val)
                          }
                          className="data-[state=checked]:bg-yellow-400"
                        />
                      </div>

                      <AnimatePresence>
                        {formData.requireLocation && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden space-y-6 p-8 bg-neutral-50 dark:bg-neutral-900/50 rounded-[2rem] border border-neutral-100 dark:border-neutral-800"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-3">
                                <Label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">
                                  Latitude
                                </Label>
                                <Input
                                  placeholder="40.7128"
                                  value={formData.latitude}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "latitude",
                                      e.target.value,
                                    )
                                  }
                                  className="h-12 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 px-4 font-bold focus:border-yellow-400 focus:ring-0 bg-white dark:bg-neutral-950"
                                />
                              </div>
                              <div className="space-y-3">
                                <Label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">
                                  Longitude
                                </Label>
                                <Input
                                  placeholder="-74.0060"
                                  value={formData.longitude}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "longitude",
                                      e.target.value,
                                    )
                                  }
                                  className="h-12 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 px-4 font-bold focus:border-yellow-400 focus:ring-0 bg-white dark:bg-neutral-950"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-3">
                                <Label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">
                                  Radius (Meters)
                                </Label>
                                <Input
                                  type="number"
                                  placeholder="100"
                                  value={formData.radius}
                                  onChange={(e) =>
                                    handleInputChange("radius", e.target.value)
                                  }
                                  className="h-12 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 px-4 font-bold focus:border-yellow-400 focus:ring-0 bg-white dark:bg-neutral-950"
                                />
                              </div>
                              <div className="flex items-end">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={handleGetLocation}
                                  className="w-full h-12 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 font-black uppercase tracking-widest text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                >
                                  <Map className="w-4 h-4 mr-2 text-yellow-500" />{" "}
                                  Use Current Location
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Success Message */}
                    <div className="space-y-4 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center gap-2 mb-4">
                        <MessageSquare className="w-5 h-5 text-yellow-500" />
                        <h3 className="font-black uppercase tracking-tight italic">
                          Success Feedback
                        </h3>
                      </div>
                      <div className="space-y-3">
                        <Label
                          htmlFor="successMessage"
                          className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1"
                        >
                          Custom Confirmation Text
                        </Label>
                        <Input
                          id="successMessage"
                          placeholder="You have been verified. Welcome to the event!"
                          value={formData.successMessage}
                          onChange={(e) =>
                            handleInputChange("successMessage", e.target.value)
                          }
                          className="h-14 rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 px-6 font-bold focus:border-yellow-400 focus:ring-0 transition-all shadow-inner"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Schedule Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-neutral-900 dark:bg-neutral-50 rounded-xl text-neutral-50 dark:text-neutral-900">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight italic">
                    Temporal Constraints
                  </h2>
                </div>

                <Card className="rounded-[2rem] border-2 border-neutral-200 dark:border-neutral-800 shadow-2xl shadow-neutral-200/50 dark:shadow-none overflow-hidden">
                  <CardContent className="p-8 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <Label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">
                          Event Date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full h-14 justify-start text-left font-bold text-lg rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 px-6",
                                !formData.eventDate && "text-neutral-400",
                              )}
                            >
                              <CalendarIcon className="mr-3 h-5 w-5 text-yellow-500" />
                              {formData.eventDate ? (
                                format(new Date(formData.eventDate), "PPP")
                              ) : (
                                <span>Select Date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0 rounded-3xl overflow-hidden border-2 shadow-2xl"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={
                                formData.eventDate
                                  ? new Date(formData.eventDate)
                                  : undefined
                              }
                              onSelect={(date) =>
                                handleInputChange(
                                  "eventDate",
                                  date ? format(date, "yyyy-MM-dd") : "",
                                )
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <Label
                            htmlFor="startTime"
                            className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1 flex items-center gap-2"
                          >
                            <Clock className="w-3.5 h-3.5" /> Start
                          </Label>
                          <Input
                            id="startTime"
                            type="time"
                            value={formData.startTime}
                            onChange={(e) =>
                              handleInputChange("startTime", e.target.value)
                            }
                            className="h-14 rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 px-4 font-bold text-lg"
                          />
                        </div>
                        <div className="space-y-4">
                          <Label
                            htmlFor="endTime"
                            className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1 flex items-center gap-2"
                          >
                            <Clock className="w-3.5 h-3.5" /> End
                          </Label>
                          <Input
                            id="endTime"
                            type="time"
                            value={formData.endTime}
                            onChange={(e) =>
                              handleInputChange("endTime", e.target.value)
                            }
                            className="h-14 rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 px-4 font-bold text-lg"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-dashed border-neutral-200 dark:border-neutral-800">
                      <div className="flex items-center justify-between group">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 font-black uppercase tracking-tight text-lg italic">
                            <Repeat className="w-5 h-5 text-yellow-500" />
                            Recurrence Pattern
                          </div>
                          <p className="text-sm text-neutral-500 font-medium">
                            Automatic cycle for repeating events.
                          </p>
                        </div>
                        <Switch
                          checked={formData.isRecurring}
                          onCheckedChange={(val) =>
                            handleInputChange("isRecurring", val)
                          }
                          className="data-[state=checked]:bg-yellow-400"
                        />
                      </div>

                      <AnimatePresence>
                        {formData.isRecurring && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-8 space-y-8 p-8 bg-neutral-50 dark:bg-neutral-900/50 rounded-[2rem] border border-neutral-100 dark:border-neutral-800"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                              <div className="space-y-4">
                                <Label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">
                                  Frequency
                                </Label>
                                <div className="flex gap-3">
                                  {["DAILY", "WEEKLY", "MONTHLY"].map((p) => (
                                    <Button
                                      key={p}
                                      type="button"
                                      variant={
                                        formData.recurrencePattern === p
                                          ? "default"
                                          : "outline"
                                      }
                                      onClick={() =>
                                        handleInputChange(
                                          "recurrencePattern",
                                          p,
                                        )
                                      }
                                      className={cn(
                                        "flex-1 h-12 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                                        formData.recurrencePattern === p
                                          ? "bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-900 shadow-xl"
                                          : "border-2 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100",
                                      )}
                                    >
                                      {p}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-4">
                                <Label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">
                                  Final Occurance
                                </Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full h-12 justify-start text-left font-bold rounded-xl border-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950",
                                        !formData.recurrenceEnd &&
                                          "text-neutral-400",
                                      )}
                                    >
                                      <CalendarIcon className="mr-3 h-4 w-4 text-yellow-500" />
                                      {formData.recurrenceEnd ? (
                                        format(
                                          new Date(formData.recurrenceEnd),
                                          "PPP",
                                        )
                                      ) : (
                                        <span>Set End Date</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0 rounded-3xl overflow-hidden border-2"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={
                                        formData.recurrenceEnd
                                          ? new Date(formData.recurrenceEnd)
                                          : undefined
                                      }
                                      onSelect={(date) =>
                                        handleInputChange(
                                          "recurrenceEnd",
                                          date
                                            ? format(date, "yyyy-MM-dd")
                                            : "",
                                        )
                                      }
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>

            <div className="lg:col-span-4 space-y-12">
              {/* Attendee Fields Section */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-yellow-400 rounded-xl text-neutral-900">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight italic">
                    Schema
                  </h2>
                </div>

                <Card className="rounded-[2rem] border-2 border-neutral-200 dark:border-neutral-800 shadow-2xl shadow-neutral-200/50 dark:shadow-none">
                  <CardContent className="p-8 space-y-8">
                    <div className="space-y-4">
                      <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 flex items-center justify-between opacity-60">
                        <span className="text-sm font-black uppercase tracking-wider text-neutral-400">
                          Email (ID)
                        </span>
                        <Badge variant="secondary">LOCKED</Badge>
                      </div>
                      <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 flex items-center justify-between opacity-60">
                        <span className="text-sm font-black uppercase tracking-wider text-neutral-400">
                          Identity Name
                        </span>
                        <Badge variant="secondary">LOCKED</Badge>
                      </div>

                      <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                        <Label
                          htmlFor="collectPhone"
                          className="text-sm font-black uppercase tracking-widest text-neutral-500 cursor-pointer italic"
                        >
                          Mobile Access
                        </Label>
                        <Switch
                          id="collectPhone"
                          checked={formData.collectPhone}
                          onCheckedChange={(v) =>
                            handleInputChange("collectPhone", v)
                          }
                          className="data-[state=checked]:bg-yellow-400"
                        />
                      </div>

                      <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                        <Label
                          htmlFor="collectDOB"
                          className="text-sm font-black uppercase tracking-widest text-neutral-500 cursor-pointer italic"
                        >
                          DOB Verification
                        </Label>
                        <Switch
                          id="collectDOB"
                          checked={formData.collectDOB}
                          onCheckedChange={(v) =>
                            handleInputChange("collectDOB", v)
                          }
                          className="data-[state=checked]:bg-yellow-400"
                        />
                      </div>
                    </div>

                    <div className="pt-6 space-y-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="capacity"
                          className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1 flex items-center gap-2"
                        >
                          <Users className="w-4 h-4 text-yellow-500" /> Max
                          Capacity
                        </Label>
                        <Input
                          id="capacity"
                          type="number"
                          placeholder="Unlimited"
                          value={formData.capacity}
                          onChange={(e) =>
                            handleInputChange("capacity", e.target.value)
                          }
                          className="h-14 rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 px-6 text-lg font-bold"
                        />
                      </div>

                      <div className="flex items-center justify-between p-6 bg-neutral-900 dark:bg-neutral-50 rounded-3xl">
                        <Label
                          htmlFor="isActive"
                          className="text-sm font-black uppercase tracking-widest text-neutral-50 dark:text-neutral-900"
                        >
                          Live Status
                        </Label>
                        <Switch
                          id="isActive"
                          checked={formData.isActive}
                          onCheckedChange={(checked) =>
                            handleInputChange("isActive", checked)
                          }
                          className="data-[state=checked]:bg-yellow-400"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Action Buttons */}
              <div className="sticky top-12 space-y-6">
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

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-20 text-xl font-black uppercase tracking-[0.2em] italic rounded-[2rem] bg-yellow-400 text-neutral-900 shadow-2xl shadow-yellow-400/30 transition-all hover:scale-[1.03] active:scale-[0.97] hover:bg-yellow-500 border-none"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin mr-3" />
                  ) : (
                    <Zap className="w-6 h-6 mr-3" />
                  )}
                  {isEditing ? "Sync Portal" : "Initialize"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-14 rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 font-black uppercase tracking-widest text-xs"
                  onClick={() => router.push("/dashboard")}
                  disabled={loading}
                >
                  Terminate Session
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

// Add Badge component locally if not available
function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary";
}) {
  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest",
        variant === "default"
          ? "bg-yellow-400 text-neutral-900"
          : "bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
      )}
    >
      {children}
    </span>
  );
}

export default function CreateCheckInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <CreateCheckInPageContent />
    </Suspense>
  );
}
