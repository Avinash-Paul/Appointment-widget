import type { AppointmentContext, AppointmentDate } from "@/types/appointment";

export const appointmentContext: AppointmentContext = {
  userId: "user-123",
  patientName: "Alex Morgan",
  organizationName: "Northstar Health",
  appointmentTypeId: "consultation",
  serviceName: "Primary care consultation",
  durationMinutes: 30,
};

export const appointmentDates: AppointmentDate[] = [
  { value: "2026-10-01" },
  { value: "2026-10-02" },
  { value: "2026-10-03" },
  { value: "2026-10-05" },
  { value: "2026-10-06" },
];
