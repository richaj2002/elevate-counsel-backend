import models from '../models/index.js';
import { responseRenderer } from '../utils/responseRenderer.js';
import { sequelize } from '../config/database.js';
const { User, Slot, Appointment, Specialization } = models;

export const bookAppointment = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const userId = req.user.id;
        const slotId = req.body.slotId;
        const alreadyAppoinmentBooked = await Appointment.findAll({
            where: { slotId, userId },
        });
        if (alreadyAppoinmentBooked.length > 0) {
            return responseRenderer(res, 400, 'Session alraedy booked.');
        }
        const slot = await Slot.findByPk(slotId, {
            include: [
                {
                    model: User,
                    as: 'counselor',
                    attributes: ['id', 'email'],
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
        if (!slot || slot.status !== 'active') {
            return responseRenderer(res, 404, 'Session not found.');
        }

        if (
            slot.isOneOnOneSession &&
            slot.appointments &&
            slot.appointments.length >= 1
        ) {
            return responseRenderer(
                res,
                409,
                'Session already booked by other.'
            );
        }
        if (
            !slot.isOneOnOneSession &&
            slot.appointments &&
            slot.maxSlotSize <= slot.appointments.length
        ) {
            return responseRenderer(res, 409, 'Session fully booked.');
        }

        const appointment = await Appointment.create({
            userId,
            counselorId: slot.counselor.id,
            slotId,
            status: 'booked',
        });

        await transaction.commit();
        responseRenderer(
            res,
            201,
            'Appointment Booked successfully.',
            appointment
        );
    } catch (error) {
        await transaction.rollback();
        responseRenderer(
            res,
            500,
            'Failed to book appointment.',
            null,
            error.message
        );
    }
};

export const getAppointmentsForUserDashboard = async (req, res) => {
    try {
        const userId = req.user.id;
        const appointments = await Appointment.findAll({
            attributes: ['id', 'status', 'createdAt', 'updatedAt'],
            where: { userId },
            include: [
                {
                    model: Slot,
                    as: 'slot',
                    attributes: [
                        'id',
                        'startTime',
                        'endTime',
                        'isOneOnOneSession',
                        'status',
                    ],
                    include: [
                        {
                            model: Specialization,
                            as: 'specialization',
                            required: true,
                        },
                    ],
                    required: true,
                },
                {
                    model: User,
                    as: 'counselor',
                    attributes: ['id', 'name'],
                    required: true,
                },
            ],
        });

        const appointmentStatusCategories = {
            booked: [],
            cancelled: [],
            completed: [],
        };

        appointments.forEach((appointment) => {
            appointmentStatusCategories[appointment.status].push(appointment);
        });

        responseRenderer(
            res,
            200,
            'Appoinments fetched successfully',
            appointmentStatusCategories
        );
    } catch (error) {
        responseRenderer(
            res,
            500,
            'Failed to fetch counselor slots.',
            null,
            error.message
        );
    }
};

export const cancelAppointment = async (req, res) => {
    try {
        const userId = req.user.id;
        const appointmentId = req.params.id;

        if (!appointmentId) {
            return responseRenderer(res, 400, 'Something went wrong.');
        }

        const appointment = await Appointment.findByPk(appointmentId);
        if (!appointment || appointment.userId !== userId) {
            return responseRenderer(res, 404, 'Invalid request.');
        }

        appointment.status = 'cancelled';
        await appointment.save();

        responseRenderer(
            res,
            200,
            'Appointment Cancelled Successfully.',
            appointment
        );
    } catch (error) {
        responseRenderer(
            res,
            500,
            'Failed to cancel appointment.',
            null,
            error.message
        );
    }
};
