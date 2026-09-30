export type AppointmentContext = {
  userId: string;
  patientName: string;
  organizationName: string;
  appointmentTypeId: string;
  serviceName: string;
  durationMinutes: number;
};

export type AppointmentDate = {
  value: string;
};

export type AppointmentType = {
  id: string;
  name: string;
  duration_minutes: number;
  description: string;
};

export type AvailabilitySlot = {
  id: string;
  start: string;
  end: string;
  available: boolean;
};

export type AvailabilityResponse = {
  date: string;
  slots: AvailabilitySlot[];
};

export type AppointmentRequest = {
  user_id: string;
  appointment_type_id: string;
  date: string;
  slot_id: string;
};

export type AppointmentRecord = AppointmentRequest & {
  id: string;
  status: "confirmed";
  appointment_type_name: string;
  start: string;
  end: string;
};
