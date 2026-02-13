import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter } from "lucide-react";

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: "all" | "active" | "inactive";
  onStatusFilterChange: (filter: "all" | "active" | "inactive") => void;
}

export function SearchAndFilter({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: SearchAndFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search pages..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            {statusFilter === "all"
              ? "All Status"
              : statusFilter === "active"
                ? "Active Only"
                : "Inactive Only"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onStatusFilterChange("all")}>
            All Status
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusFilterChange("active")}>
            Active Only
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatusFilterChange("inactive")}>
            Inactive Only
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}