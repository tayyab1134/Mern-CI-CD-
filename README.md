# Doctor Appointment Website (React + Vite + Node.js)

This project contains:
- `frontend`: React + Vite doctor appointment website UI
- `backend`: Node.js + Express API for doctors and appointments

## Features
- Beautiful, image-rich landing page
- Featured doctors section
- Appointment booking form
- Real-time appointment list updates after booking
- Backend APIs with validation

## Project Structure

```
Mern-Ci_CD/
  frontend/
  backend/
```

## Run Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs at `http://localhost:4000`

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## API Endpoints

- `GET /api/doctors` - list all doctors
- `GET /api/appointments` - list all appointments
- `POST /api/appointments` - create appointment

### Example POST Body

```json
{
  "name": "Ali",
  "email": "ali@example.com",
  "phone": "+92-300-1234567",
  "doctorId": "doc-1",
  "date": "2026-04-25",
  "time": "10:30",
  "note": "General checkup"
}
```
