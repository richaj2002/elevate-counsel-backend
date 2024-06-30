import models from '../models/index.js';
import { responseRenderer } from '../utils/responseRenderer.js';
import { sequelize } from '../config/database.js';
const { User, Slot, Appointment } = models;


export const bookAppointment = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const userId = req.user.id;
        const slotId = req.body.slotId;
        const slot = await Slot.findByPk(slotId, {
            include: [
                {
                    model: User,
                    as: 'counselor',
                    attributes: ['id', 'email'],
                    where: { isEmailVerified: true, status: true },
                    required: true,
                },
                {
                    model: Appointment,
                    as: 'appointments',
                    attributes: ['id', 'status'],
                    where: { status: 'booked' },
                    required: false,
                },
            ],
        });
        if (!slot) {
            return responseRenderer(res, 404, 'Slot not found.');
        }

        if (slot.isOneOnOneSession && slot.appointments && slot.appointments.length >= 1) {
            return responseRenderer(res, 409, 'Session already booked.');
        }
        if (!slot.isOneOnOneSession && slot.appointments && (slot.maxSlotSize <= slot.appointments.length)) {
            return responseRenderer(res, 409, 'Session fully booked.');
        }

        const appointment = await Appointment.create({ userId, counselorId: slot.counselor.id, slotId, status: 'booked' });

        await transaction.commit();
        responseRenderer(res, 201, 'Appointment Booked successfully.', appointment);

    } catch (error) {
        await transaction.rollback();
        responseRenderer(res, 500, 'Failed to book appointment.', null, error.message);
    }
}