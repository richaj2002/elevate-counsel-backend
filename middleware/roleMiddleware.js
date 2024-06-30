import { responseRenderer } from "../utils/responseRenderer.js";

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return responseRenderer(res, 403, 'You do not have permission to perform this action');
        }
        next();
    };
};
