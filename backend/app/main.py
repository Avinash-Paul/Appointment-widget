from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.appointment_types import router as appointment_types_router
from app.routes.appointments import router as appointments_router

app = FastAPI(title="Appointment Scheduler API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

app.include_router(appointment_types_router)
app.include_router(appointments_router)


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}
