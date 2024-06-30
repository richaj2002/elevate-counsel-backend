import { body, validationResult } from 'express-validator';
import { responseRenderer } from '../../utils/responseRenderer.js';

export const validateRegister = [
    body('name')
        .notEmpty()
        .withMessage('Please enter name.'),
    body('email')
        .isEmail()
        .withMessage('Please enter valid email.')
        .notEmpty()
        .withMessage('Please enter email.'),
    body('password')
        .notEmpty()
        .withMessage('Please enter password.')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long.')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter.')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter.')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number.')
        .matches(/[\W_]/)
        .withMessage('Password must contain at least one special character.'),
    body('role')
        .notEmpty()
        .withMessage('Please choose role.')
        .isIn(['admin', 'user', 'counselor'])
        .withMessage('Please choose valid role.'),
    body('country')
        .notEmpty()
        .withMessage('Please choose country.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseRenderer(res, 400, 'Validation error.', errors.array());
        }
        next();
    },
];


export const validateLogin = [
    body('email')
        .isEmail()
        .withMessage('Please enter valid email.')
        .notEmpty()
        .withMessage('Please enter email.'),
    body('password')
        .notEmpty()
        .withMessage('Please enter password.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseRenderer(res, 400, 'Validation error.', errors.array());
        }
        next();
    },
];

export const validateResetPassword = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Please enter current password.'),
    body('newPassword')
        .notEmpty()
        .withMessage('Please enter new password.'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return responseRenderer(res, 400, 'Validation error.', errors.array());
        }
        next();
    },
];
