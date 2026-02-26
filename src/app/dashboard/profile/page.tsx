"use client";

import { useOrganizer } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import {
  Loader2,
  User,
  Key,
  Mail,
  Shield,
  Camera,
  LayoutDashboard,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function ProfilePage() {
  const { meQuery } = useOrganizer();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const picture = formData.get("picture") as string;

    try {
      await api.patch("/organizer/profile", { name, picture });
      toast.success("Profile updated successfully");
      meQuery.refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordLoading(true);
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      setPasswordLoading(false);
      return;
    }

    try {
      await api.post("/organizer/change-password", {
        currentPassword,
        newPassword,
      });
      toast.success("Password changed successfully");
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (meQuery.isPending) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  const user = meQuery.data;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
      <Navbar />

      <main className="grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
              Profile Settings
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 mt-1">
              Manage your account information and security preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm bg-white dark:bg-neutral-900">
                <div className="h-24 bg-yellow-400 relative">
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                    <div className="relative group">
                      <Avatar className="h-24 w-24 border-4 border-white dark:border-neutral-900 shadow-lg ring-1 ring-neutral-100 dark:ring-neutral-800">
                        <AvatarImage src={user?.picture || ""} />
                        <AvatarFallback className="bg-yellow-100 text-yellow-700 text-2xl font-bold">
                          {user?.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
                <div className="pt-16 pb-6 px-6 text-center">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                    {user?.name || "Organizer"}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-1.5 mt-1 overflow-hidden overflow-ellipsis">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{user?.email}</span>
                  </p>
                  <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                      Account Active
                    </span>
                  </div>
                </div>
              </Card>

              <div className="bg-yellow-50/50 dark:bg-yellow-900/10 rounded-2xl p-6 border border-yellow-100 dark:border-yellow-900/20 border-dashed">
                <h4 className="font-bold text-yellow-900 dark:text-yellow-100 text-sm mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Security Tip
                </h4>
                <p className="text-xs text-yellow-800/80 dark:text-yellow-200/60 leading-relaxed">
                  Use a strong password and avoid reusing passwords across
                  different platforms to keep your event data secure.
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl dark:text-neutral-50">
                    <User className="h-5 w-5 text-yellow-600" /> Personal
                    Information
                  </CardTitle>
                  <CardDescription className="dark:text-neutral-400">
                    Update your public profile information.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          Display Name
                        </label>
                        <Input
                          name="name"
                          defaultValue={user?.name || ""}
                          placeholder="Enter your name"
                          className="h-11 rounded-lg focus:ring-yellow-500 dark:bg-neutral-800 dark:border-neutral-700"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
                          Profile Picture URL
                          <ExternalLink className="h-3 w-3 text-neutral-400" />
                        </label>
                        <Input
                          name="picture"
                          defaultValue={user?.picture || ""}
                          placeholder="https://example.com/photo.jpg"
                          className="h-11 rounded-lg focus:ring-yellow-500 dark:bg-neutral-800 dark:border-neutral-700"
                        />
                        <div className="flex items-start gap-2 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-neutral-700/50">
                          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-normal">
                            <span className="font-bold text-neutral-700 dark:text-neutral-300">
                              Warning:
                            </span>{" "}
                            Please make sure you provide a correct, direct image
                            link (e.g., ending in .jpg, .png). Incorrect links
                            will cause your avatar not to display.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 opacity-60">
                        <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          Email Address (Primary)
                        </label>
                        <Input
                          value={user?.email || ""}
                          disabled
                          className="h-11 bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700 rounded-lg"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold rounded-lg px-8 h-12"
                    >
                      {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Profile Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl dark:text-neutral-50">
                    <Key className="h-5 w-5 text-yellow-600" /> Security
                  </CardTitle>
                  <CardDescription className="dark:text-neutral-400">
                    Change your password periodically to keep your account safe.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                        Current Password
                      </label>
                      <Input
                        name="currentPassword"
                        type="password"
                        className="h-11 rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          New Password
                        </label>
                        <Input
                          name="newPassword"
                          type="password"
                          className="h-11 rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                          placeholder="Min 8 characters"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          Confirm New Password
                        </label>
                        <Input
                          name="confirmPassword"
                          type="password"
                          className="h-11 rounded-lg dark:bg-neutral-800 dark:border-neutral-700"
                          placeholder="Repeat new password"
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={passwordLoading}
                      variant="outline"
                      className="w-full sm:w-auto h-12 font-bold rounded-lg px-8 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 dark:text-neutral-300"
                    >
                      {passwordLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Update Password
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
