from dataclasses import dataclass
from datetime import date


@dataclass(frozen=True)
class AppointmentType:
    id: str
    name: str
    duration_minutes: int
    description: str


@dataclass(frozen=True)
class AppointmentSlot:
    id: str
    start: str
    end: str


@dataclass(frozen=True)
class SlotAvailability:
    id: str
    start: str
    end: str
    available: bool


@dataclass(frozen=True)
class AppointmentAvailability:
    date: date
    slots: list[SlotAvailability]


@dataclass
class Appointment:
    id: str
    status: str
    user_id: str
    appointment_type_id: str
    appointment_type_name: str
    date: date
    slot_id: str
    start: str
    end: str
