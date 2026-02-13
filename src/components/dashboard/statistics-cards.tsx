import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BarChart3, Users, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatisticsCardsProps {
  totalCheckIns: number;
  activePages: number;
  totalPages: number;
  successRate: number;
}

export function StatisticsCards({
  totalCheckIns,
  activePages,
  totalPages,
  successRate,
}: StatisticsCardsProps) {
  const stats = [
    { label: "Check-Ins", value: totalCheckIns, icon: Users, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-900/20", description: "Successful attendee flow" },
    { label: "Live Events", value: activePages, icon: Calendar, color: "text-neutral-600 dark:text-neutral-400", bg: "bg-neutral-100 dark:bg-neutral-800", description: "Currently active portals" },
    { label: "Engagement", value: `${successRate}%`, icon: BarChart3, color: "text-neutral-600 dark:text-neutral-400", bg: "bg-neutral-100 dark:bg-neutral-800", description: "Portal activity rate" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
        >
          <Card className="group hover:border-yellow-400 border-2 border-transparent transition-all duration-300 shadow-sm hover:shadow-xl rounded-[2.5rem] bg-white dark:bg-neutral-900 p-2 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110", stat.bg)}>
                  <stat.icon className={cn("h-7 w-7", stat.color)} />
                </div>
                <div className="h-1.5 w-8 bg-neutral-100 dark:bg-neutral-800 rounded-full" />
              </div>
              
              <div className="space-y-1">
                <div className="text-5xl font-black tracking-tighter text-neutral-900 dark:text-neutral-50 italic">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">
                  {stat.label}
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-neutral-50 dark:border-neutral-800">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-tight">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}