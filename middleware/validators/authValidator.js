import { body, validationResult } from 'express-validator';
import { responseRenderer } from '../../utils/responseRenderer.js';

export const validateRegister = [
    body('name').notEmpty().withMessage('Please enter name'),
    body('email')
        .isEmail()
        .withMessage('Please enter valid email')
        .notEmpty()
        .withMessage('Please enter email'),
    body('password')
        .notEmpty()
        .withMessage('Please enter password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[\W_]/)
        .withMessage('Password must contain at least one special character'),
    body('role')
        .notEmpty()
        .withMessage('Please choose role')
        .isIn(['user', 'counselor'])
        .withMessage('Please choose valid role'),
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
            const specializationErrors = validateSpecialization(
                req.body.specialization
            );
            if (specializationErrors.length > 0) {
                const errMessage =
                    specializationErrors.map((error) => error.msg).join(', ') +
                    '.';
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

const validateSpecialization = (specializations) => {
    const errors = [];
    if (!specializations || specializations.length === 0) {
        errors.push({ msg: 'Please select specialization' });
    }
    return errors;
};

export const validateLogin = [
    body('email')
        .notEmpty()
        .withMessage('Please enter email')
        .isEmail()
        .withMessage('Please enter valid email'),
    body('password').notEmpty().withMessage('Please enter password'),

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

export const validateResetPassword = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Please enter current password'),
    body('newPassword').notEmpty().withMessage('Please enter new password'),

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
