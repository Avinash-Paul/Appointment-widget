import type {
  AppointmentRecord,
  AppointmentRequest,
  AppointmentType,
  AvailabilityResponse,
} from "@/types/appointment";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_APPOINTMENT_API_URL ?? "http://localhost:8000";

export class AppointmentApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "AppointmentApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: init?.body ? { "Content-Type": "application/json" } : undefined,
      cache: "no-store",
    });
  } catch {
    throw new AppointmentApiError(
      "Could not reach the appointment service. Check that the API is running on port 8000.",
      0,
    );
  }

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const detail =
      typeof payload === "object" && payload !== null && "detail" in payload
        ? payload.detail
        : null;
    const message =
      typeof detail === "string" ? detail : `Appointment request failed (${response.status}).`;

    throw new AppointmentApiError(message, response.status);
  }

  return payload as T;
}

export function getAppointmentTypes() {
  return request<AppointmentType[]>("/api/appointment-types");
}

export function getAvailability(date: string) {
  return request<AvailabilityResponse>(
    `/api/appointments/availability?date=${encodeURIComponent(date)}`,
  );
}

export function createAppointment(appointment: AppointmentRequest) {
  return request<AppointmentRecord>("/api/appointments", {
    method: "POST",
    body: JSON.stringify(appointment),
  });
}

export function getAppointment(appointmentId: string) {
  return request<AppointmentRecord>(
    `/api/appointments/${encodeURIComponent(appointmentId)}`,
  );
}
