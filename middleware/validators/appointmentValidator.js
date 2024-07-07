import { body, validationResult } from 'express-validator';
import { responseRenderer } from '../../utils/responseRenderer.js';

export const validateBookAppointment = [
    body('slotId').notEmpty().withMessage('Please choose slot'),

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
