import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  RefreshCcw,
  Users,
  History,
} from "lucide-react";
import { CheckInPage } from "./types";
import { motion } from "framer-motion";

interface CheckInPagesTableProps {
  pages: CheckInPage[];
  onPreview: (page: CheckInPage) => void;
  onToggleActive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CheckInPagesTable({
  pages,
  onPreview,
  onToggleActive,
  onDelete,
}: CheckInPagesTableProps) {
  return (
    <div className="hidden md:block w-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
      <Table>
        <TableHeader className="bg-neutral-50 dark:bg-neutral-800/50">
          <TableRow>
            <TableHead className="font-semibold text-neutral-600 dark:text-neutral-400">Event</TableHead>
            <TableHead className="font-semibold text-neutral-600 dark:text-neutral-400">Schedule</TableHead>
            <TableHead className="font-semibold text-neutral-600 dark:text-neutral-400 text-center">Check-ins</TableHead>
            <TableHead className="font-semibold text-neutral-600 dark:text-neutral-400">Status</TableHead>
            <TableHead className="font-semibold text-neutral-600 dark:text-neutral-400 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page, i) => (
            <motion.tr
              key={page.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors border-b last:border-0 border-neutral-100 dark:border-neutral-800"
            >
              <TableCell className="py-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-primary dark:group-hover:text-yellow-400 transition-colors underline-offset-4">
                    {page.title}
                  </span>
                  <span className="text-xs font-mono text-neutral-500 mt-1">
                    /{page.slug}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-sm text-neutral-700 dark:text-neutral-300">
                    <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                    {new Date(page.eventDate).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-medium text-neutral-600 dark:text-neutral-400">
                      {page.startTime} - {page.endTime}
                    </span>
                    {page.isRecurring && (
                      <Badge variant="outline" className="text-[10px] h-5 border-yellow-200 bg-yellow-50 text-primary dark:bg-yellow-900/20 dark:border-yellow-800 flex items-center gap-0.5 px-1.5 font-medium">
                        <RefreshCcw className="h-2.5 w-2.5" />
                        REC
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4 text-center">
                <div className="inline-flex flex-col items-center">
                  <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {page.totalCheckIns}
                  </span>
                  <div className="w-12 h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full bg-secondary" 
                      style={{ 
                        width: page.capacity 
                          ? `${Math.min((page.totalCheckIns / page.capacity) * 100, 100)}%` 
                          : '100%' 
                      }} 
                    />
                  </div>
                  {page.capacity && (
                    <span className="text-[10px] text-neutral-400 mt-1 font-medium">
                      MAX: {page.capacity}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-4">
                <Badge
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider",
                    page.isActive 
                      ? "bg-yellow-100/50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-400 dark:border-yellow-800" 
                      : "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700"
                  )}
                  variant="outline"
                >
                  {page.isActive ? "Active" : "Paused"}
                </Badge>
              </TableCell>
              <TableCell className="py-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-lg">
                    <DropdownMenuItem 
                      onClick={() => onPreview(page)}
                      className="rounded-lg cursor-pointer"
                    >
                      <Eye className="w-4 h-4 mr-2.5 text-neutral-400" />
                      View portal
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                      <Link href={`/dashboard/pages/${page.slug}/attendees`}>
                        <Users className="w-4 h-4 mr-2.5 text-neutral-400" />
                        See Attendees
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                      <Link href={`/dashboard/pages/${page.slug}/history`}>
                        <History className="w-4 h-4 mr-2.5 text-neutral-400" />
                        Check-in History
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                      <Link href={`/dashboard/create?id=${page.id}`}>
                        <Edit className="w-4 h-4 mr-2.5 text-neutral-400" />
                        Edit details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onToggleActive(page.id)}
                      className={cn(
                        "rounded-lg cursor-pointer font-semibold",
                        page.isActive ? "text-orange-600 dark:text-orange-400" : "text-yellow-600 dark:text-yellow-400"
                      )}
                    >
                      {page.isActive ? "Pause Event" : "Resume Event"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(page.id)}
                      className="text-red-600 dark:text-red-400 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 mr-2.5" />
                      Delete permanantely
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Helper function for cn if not available in this file scope (though we should import it)
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}