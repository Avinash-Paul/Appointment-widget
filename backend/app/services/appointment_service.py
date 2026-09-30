from datetime import date
from uuid import uuid4

from app.data.mock_data import APPOINTMENT_TYPES, APPOINTMENTS, SLOTS_BY_DATE
from app.models.appointment import (
    Appointment,
    AppointmentAvailability,
    SlotAvailability,
)


class SlotUnavailableError(Exception):
    """Raised when a requested slot has already been booked."""


def list_appointment_types():
    return APPOINTMENT_TYPES


def parse_appointment_date(value: str) -> date:
    try:
        parsed_date = date.fromisoformat(value)
    except ValueError as error:
        raise ValueError("date must use YYYY-MM-DD format") from error

    if parsed_date.isoformat() != value:
        raise ValueError("date must use YYYY-MM-DD format")

    return parsed_date


def get_availability(appointment_date: date) -> AppointmentAvailability:
    slots = SLOTS_BY_DATE.get(appointment_date, [])
    booked_slot_ids = {
        (appointment.date, appointment.slot_id)
        for appointment in APPOINTMENTS.values()
        if appointment.status == "confirmed"
    }

    return AppointmentAvailability(
        date=appointment_date,
        slots=[
            SlotAvailability(
                id=slot.id,
                start=slot.start,
                end=slot.end,
                available=(appointment_date, slot.id) not in booked_slot_ids,
            )
            for slot in slots
        ],
    )


def create_appointment(
    *, user_id: str, appointment_type_id: str, appointment_date: date, slot_id: str
) -> Appointment:
    appointment_type = next(
        (item for item in APPOINTMENT_TYPES if item.id == appointment_type_id), None
    )
    if appointment_type is None:
        raise LookupError("Appointment type not found")

    slot = next(
        (item for item in SLOTS_BY_DATE.get(appointment_date, []) if item.id == slot_id),
        None,
    )
    if slot is None:
        raise LookupError("Slot not found for this date")

    availability = get_availability(appointment_date)
    selected_slot = next(item for item in availability.slots if item.id == slot_id)
    if not selected_slot.available:
        raise SlotUnavailableError("Slot is no longer available")

    appointment = Appointment(
        id=f"apt-{uuid4().hex[:8]}",
        status="confirmed",
        user_id=user_id,
        appointment_type_id=appointment_type.id,
        appointment_type_name=appointment_type.name,
        date=appointment_date,
        slot_id=slot.id,
        start=slot.start,
        end=slot.end,
    )
    APPOINTMENTS[appointment.id] = appointment
    return appointment


def get_appointment(appointment_id: str) -> Appointment:
    appointment = APPOINTMENTS.get(appointment_id)
    if appointment is None:
        raise LookupError("Appointment not found")
    return appointment
