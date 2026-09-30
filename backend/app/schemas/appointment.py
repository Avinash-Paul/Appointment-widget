from datetime import date
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class AppointmentTypeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    duration_minutes: int
    description: str


class AvailabilitySlotResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    start: str
    end: str
    available: bool


class AvailabilityResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    date: date
    slots: list[AvailabilitySlotResponse]


class AppointmentCreateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    user_id: str = Field(min_length=1)
    appointment_type_id: str = Field(min_length=1)
    date: date
    slot_id: str = Field(min_length=1)


class AppointmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    status: Literal["confirmed"]
    user_id: str
    appointment_type_id: str
    appointment_type_name: str
    date: date
    slot_id: str
    start: str
    end: str
