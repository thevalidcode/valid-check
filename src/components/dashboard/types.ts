export interface CheckInPage {
  id: string;
  title: string;
  slug: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  capacity: number | null;
  isActive: boolean;
  totalCheckIns: number;
  createdAt: string;
  isRecurring: boolean;
  recurrencePattern?: string | null;
  recurrenceEnd?: string | null;
  collectPhone: boolean;
  collectDOB: boolean;
}
