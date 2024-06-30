import express from 'express';
import { getCounselors, getUser, getUsers, updateUser, updateUserProfilePhoto, updateUserStatus } from '../controllers/userController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import upload from '../middleware/upload.js';

const userRouter = express.Router();

userRouter.get('/', authenticateJWT, authorizeRoles('admin'), getUsers);
userRouter.get('/counselors', getCounselors);
userRouter.get('/:id', authenticateJWT, authorizeRoles('admin', 'user', 'counselor'), getUser);
userRouter.put('/:id', authenticateJWT, authorizeRoles('admin', 'user', 'counselor'), updateUser);
userRouter.put('/:id/status', authenticateJWT, authorizeRoles('admin'), updateUserStatus);
userRouter.post('/profile-photo', authenticateJWT, authorizeRoles('admin', 'user', 'counselor'), upload.single('profilePhoto'), updateUserProfilePhoto);

export default userRouter;
