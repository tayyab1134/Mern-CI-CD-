import express from 'express';
import cors from 'cors';
import doctorRouter from './routes/doctorRoutes.js';
import appointmentRouter from './routes/appointmentRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: ['http://localhost:5173']
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Doctor Appointment API is running.' });
});

app.use('/api/doctors', doctorRouter);
app.use('/api/appointments', appointmentRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
