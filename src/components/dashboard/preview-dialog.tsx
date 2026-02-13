import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Globe, Layout, Calendar, Clock, ExternalLink } from "lucide-react";
import { CheckInPage } from "./types";
import { format } from "date-fns";

interface PreviewDialogProps {
  page: CheckInPage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PreviewDialog({
  page,
  open,
  onOpenChange,
}: PreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-[2.5rem] border-2 border-neutral-100 dark:border-neutral-800 shadow-2xl p-0 overflow-hidden bg-white dark:bg-neutral-950">
        <div className="p-10 pb-6 border-b border-neutral-50 dark:border-neutral-900">
          <DialogHeader className="space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-neutral-900 dark:bg-neutral-50 rounded-2xl text-white dark:text-neutral-900">
                <Globe className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-6 bg-yellow-400 rounded-full" />
                  <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">
                    Live Portal Preview
                  </span>
                </div>
                <DialogTitle className="text-3xl font-black text-neutral-900 dark:text-neutral-50 tracking-tighter uppercase italic">
                  Event Check-in
                </DialogTitle>
              </div>
            </div>
            <DialogDescription className="text-neutral-400 font-medium text-sm">
              This is how your check-in ecosystem appears to public
              participants. All interactions are verified in real-time.
            </DialogDescription>
          </DialogHeader>
        </div>

        {page && (
          <div className="p-10 space-y-8 bg-neutral-50/50 dark:bg-neutral-950">
            <div className="relative p-8 rounded-[2rem] bg-white dark:bg-neutral-900 border-2 border-neutral-100 dark:border-neutral-800 shadow-xl overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Layout className="w-16 h-16" />
              </div>

              <div className="relative space-y-6">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight uppercase italic">
                    {page.title}
                  </h3>
                  <p className="text-neutral-400 font-medium text-sm line-clamp-2">
                    {page.description ||
                      "No description provided for this session."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-neutral-50 dark:border-neutral-800">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-yellow-500" /> Date
                    </p>
                    <p className="font-bold text-neutral-800 dark:text-neutral-200">
                      {format(new Date(page.eventDate), "PPP")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                      <Clock className="w-3 h-3 text-yellow-500" /> Window
                    </p>
                    <p className="font-bold text-neutral-800 dark:text-neutral-200">
                      {page.startTime || "00:00"} — {page.endTime || "23:59"}
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="h-14 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 flex items-center px-6 border-2 border-dashed border-neutral-200 dark:border-neutral-700">
                    <span className="text-neutral-400 font-black uppercase text-[10px] tracking-widest italic">
                      Mock Participant Entry Point
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button
                asChild
                className="h-16 w-full rounded-[2rem] bg-neutral-900 hover:bg-black text-white dark:bg-yellow-400 dark:hover:bg-yellow-500 dark:text-neutral-900 font-black text-lg shadow-xl transition-all uppercase italic tracking-widest"
              >
                <Link href={`/checkin/${page.slug}`} target="_blank">
                  <ExternalLink className="w-5 h-5 mr-3" />
                  View Live Portal
                </Link>
              </Button>
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="h-12 font-black uppercase text-[10px] tracking-widest text-neutral-400 rounded-full"
              >
                Close Preview
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
