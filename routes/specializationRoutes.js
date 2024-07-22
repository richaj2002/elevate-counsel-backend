import express from 'express';
import {
    getSpecializations,
    getCounselorSpecializations,
    addSpecialization,
    updateSpecialization,
    deleteSpecialization,
} from '../controllers/specializationController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const specializationRouter = express.Router();

specializationRouter.get('/', getSpecializations);
specializationRouter.get(
    '/counselor',
    authenticateJWT,
    authorizeRoles('counselor'),
    getCounselorSpecializations
);
specializationRouter.post(
    '/',
    authenticateJWT,
    authorizeRoles('admin'),
    addSpecialization
);
specializationRouter.patch(
    '/:id',
    authenticateJWT,
    authorizeRoles('admin'),
    updateSpecialization
);

specializationRouter.delete(
    '/:id',
    authenticateJWT,
    authorizeRoles('admin'),
    deleteSpecialization
);

export default specializationRouter;
