import models from '../models/index.js';
import { responseRenderer } from '../utils/responseRenderer.js';
const { User } = models;

export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        responseRenderer(res, 200, '', users);
    } catch (error) {
        responseRenderer(res, 500, 'Failed to fetch users.', null, error.message);
    }
};

export const getCounselors = async (req, res) => {
    try {
        const counselors = await User.findAll({ attributes: ['id', 'name', 'counselorTitle', 'counselorDescription', 'country', 'profilePhoto'], where: { role: 'counselor', isEmailVerified: true, status: true } });
        responseRenderer(res, 200, '', counselors);
    } catch (error) {
        responseRenderer(res, 500, 'Failed to fetch counselors.', null, error.message);
    }
};

export const getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);
        if (!user) {
            return responseRenderer(res, 404, 'User not found.');
        }
        responseRenderer(res, 200, '', user);
    } catch (error) {
        responseRenderer(res, 500, 'Failed to fetch user.', null, error.message);
    }
};

export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, country } = req.body;
        const user = await User.findByPk(userId);
        if (!user) {
            return responseRenderer(res, 404, 'User not found.');
        }
        user.name = name;
        user.country = country;
        await user.save();
        responseRenderer(res, 200, 'User updated successfully.', user);
    } catch (error) {
        responseRenderer(res, 500, 'Failed to update user.', null, error.message);
    }
}

export const updateUserStatus = async (req, res) => {
    try {
        const userId = req.params.id;
        const { status } = req.body;
        const user = await User.findByPk(userId);

        if (!user) {
            return responseRenderer(res, 404, 'User not found.');
        }

        if ((status === 'active' && user.status) || (status === 'inactive' && !user.status)) {
            return responseRenderer(res, 400, `User already ${status}.`);
        }

        user.status = status === 'active';
        await user.save();

        responseRenderer(res, 200, 'User status updated successfully.', { status: user.status });
    } catch (error) {
        responseRenderer(res, 500, 'Failed to update user status.', null, error.message);
    }
};

export const updateUserProfilePhoto = async (req, res) => {
    try {
        const userId = req.user.id;
        const profilePhotoPath = req.file.path;

        const user = await User.findByPk(userId);
        if (!user) {
            return responseRenderer(res, 404, 'User not found.');
        }

        user.profilePhoto = profilePhotoPath;
        await user.save();

        responseRenderer(res, 200, 'Profile photo updated successfully.', { profilePhoto: profilePhotoPath });

    } catch (error) {
        responseRenderer(res, 500, 'Failed to upload profile.', null, error.message);
    }
};