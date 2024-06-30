import { body, check, validationResult } from 'express-validator';
import { responseRenderer } from '../../utils/responseRenderer.js';

export const validateSlot = [
    body('appointmentURL')
        .isURL()
        .withMessage('Appointment URL must be a valid URL.')
        .notEmpty()
        .withMessage('Appointment URL is required.'),
    body('startTime')
        .isISO8601()
        .withMessage('Start time must be a valid ISO8601 date.')
        .notEmpty()
        .withMessage('Start time is required.'),
    body('endTime')
        .isISO8601()
        .withMessage('End time must be a valid ISO8601 date.')
        .notEmpty()
        .withMessage('End time is required.')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.startTime)) {
                throw new Error('End time must be after start time');
            }
            return true;
        }),
    body('maxSlotSize')
        .isInt({ gt: 0 })
        .withMessage('Slot size must be an integer greater than 0.')
        .notEmpty()
        .withMessage('Slot size is required.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseRenderer(res, 400, 'Validation error.', errors.array());
        }
        next();
    },
];

export const validateSlotUpdate = [
    check('startTime').optional().isISO8601().withMessage('Start time must be a valid ISO 8601 date'),
    check('endTime').optional().isISO8601().withMessage('End time must be a valid ISO 8601 date'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { startTime, endTime } = req.body;
        if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
            return res.status(400).json({ errors: [{ msg: 'End time must be after start time' }] });
        }
        next();
    },
];