import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { validateBookAppointment } from '../middleware/validators/appointmentValidator.js';
import { bookAppointment } from '../controllers/appointmentController.js';

const appointmentRouter = express.Router();

appointmentRouter.post('/book', authenticateJWT, authorizeRoles('user'), validateBookAppointment, bookAppointment);

export default appointmentRouter;
