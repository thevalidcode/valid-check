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

export const mockCheckInPages: CheckInPage[] = [
  {
    id: "1",
    title: "Tech Conference 2026",
    slug: "tech-conf-2026",
    description: "Annual technology conference for developers",
    eventDate: "2026-02-15",
    startTime: "09:00",
    endTime: "18:00",
    capacity: 500,
    isActive: true,
    totalCheckIns: 234,
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    title: "Music Festival",
    slug: "music-festival",
    description: "Summer music festival with multiple stages",
    eventDate: "2026-07-20",
    startTime: "14:00",
    endTime: "23:00",
    capacity: 2000,
    isActive: true,
    totalCheckIns: 1456,
    createdAt: "2026-01-10",
  },
  {
    id: "3",
    title: "Workshop: React Advanced",
    slug: "react-workshop",
    description: "Advanced React development workshop",
    eventDate: "2026-03-05",
    startTime: "10:00",
    endTime: "16:00",
    capacity: 50,
    isActive: false,
    totalCheckIns: 0,
    createdAt: "2026-01-20",
  },
];