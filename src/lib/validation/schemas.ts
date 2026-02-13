import { z } from "zod";

// Organizer schemas
export const createOrganizerSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const updateOrganizerSchema = z.object({
  email: z.email("Invalid email format").optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
});

export const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// CheckInPage schemas
export const createCheckInPageSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug too long")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
  description: z.string().max(1000, "Description too long").optional(),
  eventDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  capacity: z.coerce
    .number()
    .int()
    .positive("Capacity must be positive")
    .optional(),
  isActive: z.boolean().default(true),

  // Recurring Events
  isRecurring: z.boolean().optional().default(false),
  recurrencePattern: z.string().optional(), // DAILY, WEEKLY, MONTHLY
  recurrenceEnd: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), "Invalid date format"),

  // Custom Fields
  collectPhone: z.boolean().optional().default(false),
  collectDOB: z.boolean().optional().default(false),

  // New Features
  allowSelfRegistration: z.boolean().optional().default(true),
  requireLocation: z.boolean().optional().default(false),
  locationName: z.string().optional().nullable(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  radius: z.coerce.number().int().optional().default(100).nullable(),
  successMessage: z.string().optional().default("Thank you for checking in!").nullable(),
});

export const updateCheckInPageSchema = createCheckInPageSchema
  .extend({
    id: z.coerce.string(),
  })
  .partial();

// Attendee schemas
export const createAttendeeSchema = z.object({
  email: z.email("Invalid email format"),
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(200, "Name too long"),
  phone: z.string().max(20, "Phone number too long").optional().nullable(),
  dateOfBirth: z
    .string()
    .optional()
    .nullable()
    .refine((date) => !date || !isNaN(Date.parse(date)), "Invalid date format"),
});

export const updateAttendeeSchema = createAttendeeSchema
  .extend({
    id: z.coerce.string(),
  })
  .partial();

// CheckIn schemas
export const createCheckInSchema = z.object({
  checkInPageId: z.uuid("Invalid check-in page ID"),
  attendeeId: z.uuid("Invalid attendee ID"),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

// AuditLog schemas (read-only for most operations)
export const auditLogFilterSchema = z.object({
  organizerId: z.uuid().optional(),
  action: z.string().optional(),
  startDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date")
    .optional(),
  endDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid date")
    .optional(),
});

// Generic pagination schema
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateOrganizerInput = z.infer<typeof createOrganizerSchema>;
export type UpdateOrganizerInput = z.infer<typeof updateOrganizerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateCheckInPageInput = z.infer<typeof createCheckInPageSchema>;
export type UpdateCheckInPageInput = z.infer<typeof updateCheckInPageSchema>;
export type CreateAttendeeInput = z.infer<typeof createAttendeeSchema>;
export type UpdateAttendeeInput = z.infer<typeof updateAttendeeSchema>;
export type CreateCheckInInput = z.infer<typeof createCheckInSchema>;
export type AuditLogFilterInput = z.infer<typeof auditLogFilterSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
