import { body, validationResult } from 'express-validator';
import { responseRenderer } from '../../utils/responseRenderer.js';

export const validateUpdateUser = [
    body('name').notEmpty().withMessage('Please enter name'),
    body('country').notEmpty().withMessage('Please choose country'),

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

        // Additional validation based on role
        if (req.body.role === 'counselor') {
            const counselorErrors = validateCounselorUpdate(req.body);
            if (counselorErrors.length > 0) {
                const errMessage =
                    counselorErrors.map((error) => error.msg).join(', ') + '.';
                return responseRenderer(
                    res,
                    400,
                    errMessage,
                    null,
                    'Validation error.'
                );
            }
        }

        next();
    },
];

const validateCounselorUpdate = (body) => {
    const errors = [];
    if (!body.counselorTitle) {
        errors.push({ msg: 'Please enter title' });
    }
    if (!body.counselorDescription) {
        errors.push({ msg: 'Please tell about yourself' });
    }
    if (!body.specializations || body.specializations.length === 0) {
        errors.push({ msg: 'Please select specialization' });
    }
    return errors;
};
