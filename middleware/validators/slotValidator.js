import { body, check, validationResult } from 'express-validator';
import { responseRenderer } from '../../utils/responseRenderer.js';

export const validateSlot = [
    body('appointmentURL')
        .isURL()
        .withMessage('Invalid appointment URL')
        .notEmpty()
        .withMessage('Please enter appointment URL'),
    body('startTime')
        .isISO8601()
        .withMessage('Invalid start time')
        .notEmpty()
        .withMessage('Please select start time'),
    body('endTime')
        .isISO8601()
        .withMessage('Invalid end time')
        .notEmpty()
        .withMessage('Please select end time')
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.startTime)) {
                throw new Error('End time must be after start time');
            }
            return true;
        }),
    body('maxSlotSize')
        .isInt({ gt: 0 })
        .withMessage('Invalid slot size')
        .notEmpty()
        .withMessage('Please enter slot size'),
    body('specialization')
        .notEmpty()
        .withMessage('Please select specialization'),
    body('isOneOnOneSession')
        .isBoolean()
        .withMessage('Invalid slot type')
        .notEmpty()
        .withMessage('Please select slot type'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errMessage =
                errors
                    .array()
                    .map((error) => error.msg)
                    .join(', ') + '.';
            return responseRenderer(
                res,
                400,
                errMessage,
                null,
                'Validation error.'
            );
        }
        next();
    },
];

export const validateSlotUpdate = [
    check('startTime').optional().isISO8601().withMessage('Invalid start time'),
    check('endTime').optional().isISO8601().withMessage('Invalid end time'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errMessage =
                errors
                    .array()
                    .map((error) => error.msg)
                    .join(', ') + '.';
            return responseRenderer(
                res,
                400,
                errMessage,
                null,
                'Validation error.'
            );
        }
        const { startTime, endTime } = req.body;
        if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
            return responseRenderer(
                res,
                400,
                'End time must be after start time.',
                null,
                'Validation error.'
            );
        }
        next();
    },
];
