import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useAudit } from "@/hooks";
import { Button } from "@/components/ui/button";

export function RecentActivity() {
  const [page, setPage] = useState(1);
  const limit = 8;
  const { useList } = useAudit();
  const list = useList({ page, limit });

  const items = (list.data?.data || []) as any[];
  const totalPages = list.data?.pagination?.totalPages || 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 min-h-100">
        {list.isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-10 text-center">
             <Activity className="w-8 h-8 text-neutral-200 mx-auto mb-3" />
             <p className="text-xs font-black text-neutral-400 uppercase tracking-widest leading-relaxed">No signals detected on the network</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {items.map((item, idx) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 hover:border-yellow-400/30 rounded-2xl p-4 flex items-start gap-4 transition-all hover:shadow-sm"
                  >
                    <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 shadow-[0_0_8px_rgba(34,197,94,0.6)] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-neutral-900 dark:text-neutral-50 leading-tight mb-1 truncate group-hover:text-yellow-600 transition-colors capitalize">
                        {item.action.toLowerCase().replace(/_/g, " ")}
                      </p>
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-tighter">
                        {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "---"}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1 || list.isLoading}
            className="h-8 rounded-xl font-black uppercase text-[10px] tracking-widest text-neutral-500 hover:text-yellow-600 transition-colors"
          >
            <ChevronLeft className="w-3 h-3 mr-1" /> Prev
          </Button>
          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
            {page} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages || list.isLoading}
            className="h-8 rounded-xl font-black uppercase text-[10px] tracking-widest text-neutral-500 hover:text-yellow-600 transition-colors"
          >
            Next <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      )}
    </motion.div>
  );
}
