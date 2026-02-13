"use client";

import { Toaster } from "sonner";
import { CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react";

export default function CustomToaster() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors={false}
      closeButton={true}
      duration={4000}
      visibleToasts={4}
      offset={20}
      gap={12}
      theme="light"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: `
            group relative flex w-full max-w-[360px] items-center gap-3 rounded-lg
            bg-card text-card-foreground p-4 shadow-xs border border-border
            transition-all duration-200 ease-out
            data-[mounted=true]:animate-in data-[mounted=true]:slide-in-from-right-full
            data-[mounted=true]:fade-in-0 data-[mounted=true]:duration-200
            data-[closed=true]:animate-out data-[closed=true]:slide-out-to-right-full
            data-[closed=true]:fade-out-0 data-[closed=true]:duration-150
            data-[swipe=end]:slide-out-to-right-full
            hover:shadow-sm data-[front=false]:scale-95 data-[front=false]:opacity-70
            dark:bg-card dark:border-border
          `,
          title: `
            text-sm font-semibold leading-tight text-foreground
          `,
          description: `
            text-xs leading-relaxed text-muted-foreground
          `,
          actionButton: `
            ml-auto shrink-0 rounded-md bg-primary px-3 py-1.5
            text-xs font-semibold text-primary-foreground
            transition-all duration-200 hover:bg-primary/90
            active:scale-95 shadow-xs
          `,
          cancelButton: `
            shrink-0 rounded-md border border-border bg-background
            px-3 py-1.5 text-xs font-medium text-foreground
            transition-all duration-200 hover:bg-accent
            active:scale-95
          `,
          closeButton: `
            absolute right-2 top-2 rounded-md p-1
            text-muted-foreground transition-all duration-200
            hover:text-foreground hover:bg-accent
            active:scale-90 opacity-0 group-hover:opacity-100
          `,
          success: `
            group/success border-l-4 border-l-yellow-500 bg-card
          `,
          error: `
            group/error border-l-4 border-l-destructive bg-card
          `,
          warning: `
            group/warning border-l-4 border-l-amber-500 bg-card
          `,
          info: `
            group/info border-l-4 border-l-secondary bg-card
          `,
          default: `
            group/default border-l-4 border-l-primary bg-card
          `,
          loading: `
            group/loading border-l-4 border-l-primary bg-card
          `,
        },
      }}
      icons={{
        success: (
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
            <CheckCircle2
              className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400"
              strokeWidth={2.5}
            />
          </div>
        ),
        error: (
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <XCircle
              className="h-3.5 w-3.5 text-destructive dark:text-destructive"
              strokeWidth={2.5}
            />
          </div>
        ),
        warning: (
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <AlertCircle
              className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400"
              strokeWidth={2.5}
            />
          </div>
        ),
        info: (
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
            <Info
              className="h-3.5 w-3.5 text-primary dark:text-yellow-400"
              strokeWidth={2.5}
            />
          </div>
        ),
        loading: (
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          </div>
        ),
      }}
    />
  );
}
