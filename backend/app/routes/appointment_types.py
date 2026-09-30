from fastapi import APIRouter

from app.schemas.appointment import AppointmentTypeResponse
from app.services.appointment_service import list_appointment_types

router = APIRouter(prefix="/api/appointment-types", tags=["appointment types"])


@router.get("", response_model=list[AppointmentTypeResponse])
def get_appointment_types():
    return list_appointment_types()
