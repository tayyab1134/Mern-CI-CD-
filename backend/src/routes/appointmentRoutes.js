import { Router } from 'express';
import { doctors } from '../data/doctors.js';

const appointmentRouter = Router();

const appointments = [
  {
    id: 'apt-1',
    name: 'Fatima Noor',
    email: 'fatima@example.com',
    phone: '+92-300-1234567',
    doctorId: 'doc-1',
    doctorName: 'Dr. Aisha Khan',
    date: '2026-04-22',
    time: '11:30',
    note: 'Follow-up for blood pressure review'
  }
];

appointmentRouter.get('/', (req, res) => {
  res.status(200).json(appointments);
});

appointmentRouter.post('/', (req, res) => {
  const { name, email, phone, doctorId, date, time, note } = req.body;

  if (!name || !email || !phone || !doctorId || !date || !time) {
    return res.status(400).json({ message: 'Please fill all required fields.' });
  }

  const doctor = doctors.find((item) => item.id === doctorId);

  if (!doctor) {
    return res.status(404).json({ message: 'Selected doctor does not exist.' });
  }

  const newAppointment = {
    id: `apt-${appointments.length + 1}`,
    name,
    email,
    phone,
    doctorId,
    doctorName: doctor.name,
    date,
    time,
    note: note || ''
  };

  appointments.unshift(newAppointment);

  return res.status(201).json(newAppointment);
});

export default appointmentRouter;
