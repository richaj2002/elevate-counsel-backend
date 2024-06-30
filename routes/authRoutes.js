import express from 'express';
import { register, login, verifyEmail, refreshToken, resetPassword } from '../controllers/authController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { validateLogin, validateRegister, validateResetPassword } from '../middleware/validators/authValidator.js';

const authRouter = express.Router();

authRouter.post('/register', validateRegister, register);
authRouter.post('/login', validateLogin, login);
authRouter.get('/verify/:token', verifyEmail);
authRouter.post('/refresh-token', refreshToken);
authRouter.post('/reset-password', authenticateJWT, authorizeRoles('user', 'counselor'), validateResetPassword, resetPassword);

export default authRouter;
