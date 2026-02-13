import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Users,
  RefreshCcw,
  History,
} from "lucide-react";
import { CheckInPage } from "./types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CheckInPageCardProps {
  page: CheckInPage;
  onPreview: (page: CheckInPage) => void;
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CheckInPageCard({
  page,
  onPreview,
  onToggleActive,
  onDelete,
}: CheckInPageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      layout
    >
      <Card className="mb-4 overflow-hidden border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
        <CardContent className="p-0">
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-50 truncate group-hover:text-primary transition-colors">
                    {page.title}
                  </h3>
                  {page.isRecurring && (
                    <div className="flex items-center text-secondary bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      <RefreshCcw className="h-3 w-3 mr-1" />
                    </div>
                  )}
                </div>
                <p className="text-xs font-mono text-neutral-400">/{page.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  className={cn(
                    "rounded-full px-2.5 py-0 text-[10px] font-bold",
                    page.isActive 
                      ? "bg-yellow-100/50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-400 dark:border-yellow-800" 
                      : "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
                  )}
                  variant="outline"
                >
                  {page.isActive ? "Active" : "Paused"}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl w-48 shadow-xl">
                    <DropdownMenuItem onClick={() => onPreview(page)} className="rounded-lg">
                      <Eye className="w-4 h-4 mr-2 text-neutral-400" />
                      Preview Portal
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg">
                      <Link href={`/dashboard/pages/${page.slug}/attendees`}>
                        <Users className="w-4 h-4 mr-2 text-neutral-400" />
                        See Attendees
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg">
                      <Link href={`/dashboard/pages/${page.slug}/history`}>
                        <History className="w-4 h-4 mr-2 text-neutral-400" />
                        Check-in History
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg">
                      <Link href={`/dashboard/create?id=${page.id}`}>
                        <Edit className="w-4 h-4 mr-2 text-neutral-400" />
                        Edit details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onToggleActive(page.id)}
                      className={cn("rounded-lg font-semibold", page.isActive ? "text-orange-600" : "text-yellow-600")}
                    >
                      {page.isActive ? "Pause Event" : "Resume Event"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(page.id)}
                      className="text-red-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete permanantely
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm mt-2">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Event Date
                </span>
                <span className="font-semibold text-neutral-700 dark:text-neutral-200">
                  {new Date(page.eventDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 flex items-center gap-1">
                  <Users className="h-3 w-3" /> Check-ins
                </span>
                <span className="font-semibold text-neutral-700 dark:text-neutral-200">
                  {page.totalCheckIns} <span className="text-neutral-400 font-normal">/ {page.capacity || "∞"}</span>
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Time Range
                </span>
                <span className="font-semibold text-neutral-700 dark:text-neutral-200">
                  {page.startTime} - {page.endTime}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-800/50 p-3 flex justify-between items-center text-[11px] font-medium border-t border-neutral-100 dark:border-neutral-800">
            <span className="text-neutral-500">
              Created {page.createdAt ? new Date(page.createdAt).toLocaleDateString() : 'N/A'}
            </span>
            <Link href={`/dashboard/pages/${page.slug}/history`}>
              <Button variant="link" size="sm" className="h-auto p-0 text-primary hover:text-yellow-700 font-bold">
                View Activity →
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
