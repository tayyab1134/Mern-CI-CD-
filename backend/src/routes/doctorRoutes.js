import { Router } from 'express';
import { doctors } from '../data/doctors.js';

const doctorRouter = Router();

doctorRouter.get('/', (req, res) => {
  res.status(200).json(doctors);
});

export default doctorRouter;
