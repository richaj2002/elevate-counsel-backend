import models from '../models/index.js';
import { responseRenderer } from '../utils/responseRenderer.js';
const { User, Slot, Appointment } = models;

export const getSlots = async (req, res) => {
    try {
        let slots;
        if (req.user.role === 'admin') {
            slots = await Slot.findAll({
                include: {
                    model: User,
                    as: 'counselorDetails',
                    attributes: ['id', 'name']
                },
            });
        } else {
            slots = await Slot.findAll({
                where: { counselorId: req.user.id }
            });
        }
        responseRenderer(res, 200, '', slots);
    } catch (error) {
        responseRenderer(res, 500, 'Failed to fetch slots.', null, error.message);
    }
}

export const getCounselorSlots = async (req, res) => {
    try {
        const counselorId = req.params.id;
        const counselor = await User.findByPk(counselorId, {
            attributes: ['id', 'name', 'counselorTitle', 'counselorDescription', 'country', 'profilePhoto'],
            include: {
                model: Slot,
                as: 'slots',
                attributes: ['id', 'startTime', 'endTime', 'description', 'maxSlotSize', 'isOneOnOneSession', 'status'],
                where: { status: 'active' },
                required: false,
                include: {
                    model: Appointment,
                    as: 'appointments',
                    attributes: ['id'],
                    where: { status: 'booked' },
                    required: false
                }
            }
        });

        if (!counselor) {
            return responseRenderer(res, 404, 'Counselor not found');
        }

        counselor.individualSlots = [];
        counselor.groupSlots = [];

        counselor.slots.forEach(slot => {
            const appointmentsBooked = slot.appointments ? slot.appointments.length : 0;
            const bookingPercentage = (appointmentsBooked / slot.maxSlotSize) * 100;

            const slotWithBookingInfo = {
                ...slot.get({ plain: true }),
                appointmentsBooked,
                bookingPercentage
            };

            if (slot.isOneOnOneSession) {
                counselor.individualSlots.push(slotWithBookingInfo);
            } else {
                counselor.groupSlots.push(slotWithBookingInfo);
            }
        });

        responseRenderer(res, 200, 'Counselor slots fetched successfully', {
            id: counselor.id,
            name: counselor.name,
            counselorTitle: counselor.counselorTitle,
            counselorDescription: counselor.counselorDescription,
            country: counselor.country,
            profilePhoto: counselor.profilePhoto,
            individualSlots: counselor.individualSlots,
            groupSlots: counselor.groupSlots
        });
    } catch (error) {
        responseRenderer(res, 500, 'Failed to fetch counselor slots.', null, error.message);
    }
}

export const getSlot = async (req, res) => {
    try {
        const slotId = req.params.id;
        const slot = await Slot.findByPk(slotId);
        if (!slot) {
            return responseRenderer(res, 404, 'Slot not found.');
        }
        responseRenderer(res, 200, '', slot);
    } catch (error) {
        responseRenderer(res, 500, 'Failed to fetch slot.', null, error.message);
    }
}

export const addSlot = async (req, res) => {
    try {
        const counselorId = req.user.id;
        const { appointmentURL, startTime, endTime, description, maxSlotSize } = req.body;
        const slot = await Slot.create({ counselorId, appointmentURL, startTime, endTime, description, maxSlotSize });
        responseRenderer(res, 201, 'Slot created successfully.', slot);
    } catch (error) {
        responseRenderer(res, 500, 'Failed to add slot.', null, error.message);
    }
}

export const updateSlot = async (req, res) => {
    try {
        const slotId = req.params.id;
        const updates = req.body;

        const slot = await Slot.findByPk(slotId);
        if (!slot) {
            return responseRenderer(res, 404, 'Slot not found.');
        }

        if (slot.counselor !== req.user.id) {
            return responseRenderer(res, 403, 'You do not have permission to update this slot.');
        }

        await slot.update(updates);

        // Send email if startTime or endTime is updated to appointments
        if (updates.startTime || updates.endTime) {
            //
        }

        responseRenderer(res, 200, 'Slot updated successfully.', slot);
    } catch (error) {
        responseRenderer(res, 500, 'Failed to update slot.', null, error.message);
    }
};