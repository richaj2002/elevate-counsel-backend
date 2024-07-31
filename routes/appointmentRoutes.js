import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { validateBookAppointment } from '../middleware/validators/appointmentValidator.js';
import {
    bookAppointment,
    getAppointmentsForUserDashboard,
    cancelAppointment,
} from '../controllers/appointmentController.js';

const appointmentRouter = express.Router();

appointmentRouter.post(
    '/book',
    authenticateJWT,
    authorizeRoles('user'),
    validateBookAppointment,
    bookAppointment
);
appointmentRouter.get(
    '/user/dashboard',
    authenticateJWT,
    authorizeRoles('user'),
    getAppointmentsForUserDashboard
);

appointmentRouter.put(
    '/cancel/:id',
    authenticateJWT,
    authorizeRoles('user'),
    cancelAppointment
);

export default appointmentRouter;
