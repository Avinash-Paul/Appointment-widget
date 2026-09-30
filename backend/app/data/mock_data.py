from datetime import date

from app.models.appointment import Appointment, AppointmentSlot, AppointmentType

APPOINTMENT_TYPES = [
    AppointmentType(
        id="consultation",
        name="Primary care consultation",
        duration_minutes=30,
        description="A 30-minute appointment with a primary care provider.",
    ),
]

SLOTS_BY_DATE = {
    date(2026, 10, 1): [
        AppointmentSlot(id="slot-1", start="09:00", end="09:30"),
        AppointmentSlot(id="slot-2", start="10:00", end="10:30"),
        AppointmentSlot(id="slot-3", start="13:00", end="13:30"),
        AppointmentSlot(id="slot-4", start="15:00", end="15:30"),
    ],
    date(2026, 10, 2): [
        AppointmentSlot(id="slot-1", start="09:30", end="10:00"),
        AppointmentSlot(id="slot-2", start="11:00", end="11:30"),
        AppointmentSlot(id="slot-3", start="14:00", end="14:30"),
    ],
    date(2026, 10, 3): [],
    date(2026, 10, 5): [
        AppointmentSlot(id="slot-1", start="09:00", end="09:30"),
        AppointmentSlot(id="slot-2", start="11:30", end="12:00"),
        AppointmentSlot(id="slot-3", start="14:30", end="15:00"),
    ],
    date(2026, 10, 6): [],
}

APPOINTMENTS: dict[str, Appointment] = {}
