import jwt from 'jsonwebtoken';
import { responseRenderer } from '../utils/responseRenderer.js';
import models from '../models/index.js';
const { User } = models;

export const authenticateJWT = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return responseRenderer(res, 401, 'Access Denied');
    }
    const token = authHeader.split(' ')[1];
    try {
        console.log(token);
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findByPk(verified.id);

        if (!req.user) {
            return responseRenderer(res, 401, 'User not found');
        }
        next();
    } catch (error) {
        responseRenderer(res, 401, 'Invalid Token', null, error.message);
    }
};
