import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[2.5rem] border-2 border-neutral-100 dark:border-neutral-800 shadow-2xl p-0 overflow-hidden bg-white dark:bg-neutral-950">
        <div className="p-10 pb-6 border-b border-neutral-50 dark:border-neutral-900">
          <DialogHeader className="space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-600 dark:text-red-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-6 bg-red-400 rounded-full" />
                  <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em]">
                    Critical Action
                  </span>
                </div>
                <DialogTitle className="text-3xl font-black text-neutral-900 dark:text-neutral-50 tracking-tighter uppercase italic">
                  Destructive
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-10 space-y-8 bg-neutral-50/50 dark:bg-neutral-950">
          <DialogDescription className="text-neutral-600 dark:text-neutral-400 font-medium text-lg leading-relaxed text-left">
            Are you sure you want to delete this check-in page? All associated
            attendee records and analytics will be permanently purged.{" "}
            <strong className="text-neutral-900 dark:text-neutral-200">
              This action is irreversible.
            </strong>
          </DialogDescription>

          <div className="flex flex-col gap-4">
            <Button
              onClick={onConfirm}
              className="h-16 w-full rounded-[2rem] bg-red-600 hover:bg-red-700 text-white font-black text-lg shadow-xl shadow-red-500/20 transition-all uppercase italic tracking-widest"
            >
              <Trash2 className="w-5 h-5 mr-3" />
              Confirm Deletion
            </Button>
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="h-12 font-black uppercase text-[10px] rounded-full tracking-widest text-neutral-400 hover:text-neutral-900"
            >
              No, keep it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
