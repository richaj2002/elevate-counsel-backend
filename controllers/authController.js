import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import models from '../models/index.js';
import sendEmail from '../utils/email.js';
import path from 'path';
import { responseRenderer } from '../utils/responseRenderer.js';

const { User } = models;

export const register = async (req, res) => {
    const {
        name,
        email,
        password,
        role,
        country,
        counselorTitle,
        counselorDescription,
    } = req.body;
    try {
        const defaultProfile =
            'http://localhost:3000/uploads/default-profile.webp';
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            country,
            counselorTitle,
            counselorDescription,
            profilePhoto: defaultProfile,
        });

        const verificationToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Define the path to the HTML template
        const templatePath = path.join(
            process.cwd(),
            '../server/utils/templates/verificationEmail.html'
        );

        // Send verification email
        await sendEmail(email, 'Please verify your email.', templatePath, {
            name: user.name,
            token: verificationToken,
        });

        responseRenderer(
            res,
            201,
            'User registered. Please check your email to verify your account.'
        );
    } catch (error) {
        responseRenderer(
            res,
            500,
            'Failed to register user.',
            null,
            error.message
        );
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return responseRenderer(res, 400, 'Invalid email or password.');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return responseRenderer(res, 400, 'Invalid email or password.');
        }

        if (!user.isEmailVerified) {
            return responseRenderer(res, 400, 'Please verify your email.');
        }

        if (!user.status) {
            return responseRenderer(res, 400, 'Account blocked.');
        }

        const accessToken = jwt.sign(
            { id: user.id, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );
        const refreshToken = jwt.sign(
            { id: user.id, name: user.name, role: user.role },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
        );

        responseRenderer(res, 200, 'Login successful.', {
            id: user.id,
            name: user.name,
            role: user.role,
            accessToken,
            refreshToken,
            accessExpireIn: 3600,
            refreshExpireIn: 604800,
        });
    } catch (error) {
        responseRenderer(res, 500, 'Failed to login.', null, error.message);
    }
};

export const verifyEmail = async (req, res) => {
    const { token } = req.params;
    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(id);
        if (!user) {
            return responseRenderer(res, 400, 'Invalid token.');
        }

        user.isEmailVerified = true;
        await user.save();

        responseRenderer(res, 200, 'Email verified successfully.');
    } catch (error) {
        responseRenderer(res, 400, 'Invalid token.', null, error.message);
    }
};

export const refreshToken = async (req, res) => {
    const { token } = req.body;
    if (!token) return responseRenderer(res, 401, 'Refresh Token is required.');

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const accessToken = jwt.sign(
            { id: decoded.id, name: decoded.name, role: decoded.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        responseRenderer(res, 200, 'Token refreshed.', {
            id: decoded.id,
            name: decoded.name,
            role: decoded.role,
            accessToken,
            refreshToken: token,
            accessExpireIn: 3600,
            refreshExpireIn: 604800,
        });
    } catch (error) {
        responseRenderer(
            res,
            403,
            'Invalid Refresh Token.',
            null,
            error.message
        );
    }
};

export const resetPassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
        // Fetch the user from the database
        const user = await User.findByPk(userId);

        if (!user) {
            return responseRenderer(res, 404, 'User not found.');
        }

        // Check if the previous password matches
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return responseRenderer(res, 400, 'Current password is incorrect.');
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        responseRenderer(res, 200, 'Password reset successfully.');
    } catch (error) {
        responseRenderer(res, 500, 'Server error.', null, error.message);
    }
};
