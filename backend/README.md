# Appointment Scheduler API

A small FastAPI backend for the scheduler POC. It uses in-memory data only. Restarting the Python process clears created appointments.

## Run locally on macOS

From the repository root:

```sh
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

`python3 -m venv .venv` creates an isolated Python environment in `backend/.venv`. `source .venv/bin/activate` makes that environment's Python and `pip` the active commands in this terminal. `pip install -r requirements.txt` installs FastAPI and Uvicorn into that environment.

In `uvicorn app.main:app`, the first `app` is the Python package directory, `main` is `main.py`, and the last `app` is the FastAPI object created inside `main.py`. Uvicorn imports that object and serves it. `--reload` restarts the server when Python files change; `--port 8000` chooses its local port.

Open `http://localhost:8000/docs` for FastAPI's interactive API documentation.

## Files

- `app/main.py` creates the FastAPI app, sets the local CORS allowlist, registers routers, and defines `GET /health`.
- `app/routes/appointment_types.py` exposes `GET /api/appointment-types`.
- `app/routes/appointments.py` exposes availability, booking, and appointment lookup endpoints. It translates service errors into HTTP status codes.
- `app/schemas/appointment.py` defines Pydantic request and response shapes. FastAPI validates request bodies against these schemas and serializes response models to JSON.
- `app/services/appointment_service.py` contains the appointment rules: parse a date, list slots, create an ID, prevent double booking, and find a booking.
- `app/models/appointment.py` defines simple Python dataclasses for appointment types, slots, availability, and appointments. These are internal records, separate from the JSON schemas.
- `app/data/mock_data.py` holds the fixed appointment type and slot schedule plus the in-memory appointment dictionary.
- `requirements.txt` lists the two direct packages needed to run the app: FastAPI and Uvicorn. Pydantic is installed as a FastAPI dependency.

The separation is intentionally small: routes translate HTTP into service calls, services enforce rules, models describe Python records, schemas describe the API contract, and mock data provides the POC's storage.

## Endpoints and status codes

- `GET /health` returns `200` and `{"status":"ok"}`.
- `GET /api/appointment-types` returns `200` and the static appointment type list.
- `GET /api/appointments/availability?date=2026-10-01` returns `200` and that date's slots. A valid date with no slots returns an empty array. A malformed date returns `400`.
- `POST /api/appointments` validates a JSON booking request and returns `201` with the created appointment.
- `GET /api/appointments/{appointment_id}` returns `200` for an existing in-memory booking or `404` when it is unknown.

Malformed JSON fields or a missing required body field return `422` through Pydantic/FastAPI. Unknown appointment types and slot IDs return `404`; a slot already booked returns `409 Conflict`. A `500` means an unexpected server error, not an expected validation result.

Example booking body:

```json
{
  "user_id": "user-123",
  "appointment_type_id": "consultation",
  "date": "2026-10-01",
  "slot_id": "slot-1"
}
```

## CORS for local development

The browser frontend at `http://localhost:3000` and API at `http://localhost:8000` have different origins because the port is part of an origin. `main.py` allows the local frontend origin for GET and POST requests. When deployed, replace that entry with the real frontend origin(s). Do not use a wildcard allowlist in production: it permits arbitrary websites to make browser requests to the API.

## Request flow

```text
Availability:
User selects date -> Next.js page -> services/appointment-api.ts ->
GET /api/appointments/availability -> route -> service -> mock schedule ->
JSON response -> Next.js displays slots

Booking:
User confirms -> Next.js -> services/appointment-api.ts ->
POST /api/appointments -> route/Pydantic validation -> service ->
create in-memory appointment -> JSON response with ID ->
Next.js success page -> GET /api/appointments/{id} -> display booking
```
