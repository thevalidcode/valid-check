import type { Organizer, CheckInPage, Attendee, CheckIn, AuditLog } from "@prisma/client";

export type { Organizer, CheckInPage, Attendee, CheckIn, AuditLog };

export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
