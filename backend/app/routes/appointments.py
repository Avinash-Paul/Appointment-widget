from datetime import date

from fastapi import APIRouter, HTTPException, Query, status

from app.models.appointment import AppointmentAvailability, Appointment
from app.schemas.appointment import (
    AppointmentCreateRequest,
    AppointmentResponse,
    AvailabilityResponse,
)
from app.services.appointment_service import (
    SlotUnavailableError,
    create_appointment,
    get_appointment,
    get_availability,
    parse_appointment_date,
)

router = APIRouter(prefix="/api/appointments", tags=["appointments"])


@router.get("/availability", response_model=AvailabilityResponse)
def appointment_availability(date_value: str = Query(alias="date")) -> AppointmentAvailability:
    try:
        appointment_date = parse_appointment_date(date_value)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error

    return get_availability(appointment_date)


@router.post(
    "",
    response_model=AppointmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def book_appointment(request: AppointmentCreateRequest) -> Appointment:
    try:
        return create_appointment(
            user_id=request.user_id,
            appointment_type_id=request.appointment_type_id,
            appointment_date=request.date,
            slot_id=request.slot_id,
        )
    except LookupError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    except SlotUnavailableError as error:
        raise HTTPException(status_code=409, detail=str(error)) from error


@router.get("/{appointment_id}", response_model=AppointmentResponse)
def appointment_by_id(appointment_id: str) -> Appointment:
    try:
        return get_appointment(appointment_id)
    except LookupError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
