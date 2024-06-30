import jwt from 'jsonwebtoken'
import { responseRenderer } from '../utils/responseRenderer.js';
import models from '../models/index.js';
const { User } = models;

export const authenticateJWT = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return responseRenderer(res, 401, 'Access Denied')
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findByPk(verified.id);

        if (!req.user) {
            return responseRenderer(res, 401, 'User not found')
        }
        next();
    } catch (error) {
        responseRenderer(res, 400, 'Invalid Token', null, error.message)
    }
};


