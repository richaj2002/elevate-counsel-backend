import models from '../models/index.js';
import { responseRenderer } from '../utils/responseRenderer.js';
const { User, Specialization } = models;

export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        responseRenderer(res, 200, '', users);
    } catch (error) {
        responseRenderer(
            res,
            500,
            'Failed to fetch users.',
            null,
            error.message
        );
    }
};

export const getCounselors = async (req, res) => {
    try {
        const counselors = await User.findAll({
            attributes: [
                'id',
                'name',
                'counselorTitle',
                'counselorDescription',
                'country',
                'profilePhoto',
            ],
            where: { role: 'counselor', isEmailVerified: true, status: true },
        });
        responseRenderer(res, 200, '', counselors);
    } catch (error) {
        responseRenderer(
            res,
            500,
            'Failed to fetch counselors.',
            null,
            error.message
        );
    }
};

export const getUser = async (req, res) => {
    try {
        let userId;
        if (req.user.role === 'admin') {
            userId = req.params.id;
        } else {
            userId = req.user.id;
        }
        const user = await User.findByPk(userId, {
            attributes: [
                'id',
                'role',
                'name',
                'email',
                'counselorTitle',
                'counselorDescription',
                'country',
                'profilePhoto',
                'isEmailVerified',
                'status',
                'createdAt',
            ],
            include: {
                model: Specialization,
                through: 'UserSpecializations',
                as: 'specializations',
                attributes: ['id'],
            },
        });
        if (!user) {
            return responseRenderer(res, 404, 'User not found.');
        }

        const planUser = user.toJSON();

        const specializationIds = planUser.specializations.map(
            (spec) => spec.id
        );
        planUser.specializations = specializationIds;

        responseRenderer(res, 200, '', planUser);
    } catch (error) {
        responseRenderer(
            res,
            500,
            'Failed to fetch user.',
            null,
            error.message
        );
    }
};

export const updateUser = async (req, res) => {
    try {
        let userId;
        if (req.user.role === 'admin') {
            userId = req.params.id;
        } else {
            userId = req.user.id;
        }
        const {
            name,
            country,
            counselorTitle,
            counselorDescription,
            specializations,
        } = req.body;
        const user = await User.findByPk(userId);
        if (!user) {
            return responseRenderer(res, 404, 'User not found.');
        }
        user.name = name;
        user.country = country;
        user.counselorTitle = counselorTitle;
        user.counselorDescription = counselorDescription;
        await user.save();

        if (specializations && specializations.length > 0) {
            const foundSpecializations = await Specialization.findAll({
                where: {
                    id: specializations,
                },
            });
            await user.setSpecializations(foundSpecializations);
        } else {
            await user.setSpecializations([]);
        }
        responseRenderer(res, 200, 'User updated successfully.', user);
    } catch (error) {
        responseRenderer(
            res,
            500,
            'Failed to update user.',
            null,
            error.message
        );
    }
};

export const updateUserStatus = async (req, res) => {
    try {
        const userId = req.params.id;
        const { status } = req.body;
        const user = await User.findByPk(userId);

        if (!user) {
            return responseRenderer(res, 404, 'User not found.');
        }

        if (
            (status === 'active' && user.status) ||
            (status === 'inactive' && !user.status)
        ) {
            return responseRenderer(res, 400, `User already ${status}.`);
        }

        user.status = status === 'active';
        await user.save();

        responseRenderer(res, 200, 'User status updated successfully.', {
            status: user.status,
        });
    } catch (error) {
        responseRenderer(
            res,
            500,
            'Failed to update user status.',
            null,
            error.message
        );
    }
};

export const updateUserProfilePhoto = async (req, res) => {
    try {
        const userId = req.user.id;
        let profilePhotoPath = `${req.protocol}://${req.get('host')}/${
            req.file.path
        }`;
        profilePhotoPath = profilePhotoPath.replace(/\\/g, '/');
        const user = await User.findByPk(userId);
        if (!user) {
            return responseRenderer(res, 404, 'User not found.');
        }

        user.profilePhoto = profilePhotoPath;
        await user.save();

        responseRenderer(res, 200, 'Profile photo updated successfully.', {
            profilePhoto: profilePhotoPath,
        });
    } catch (error) {
        responseRenderer(
            res,
            500,
            'Failed to upload profile.',
            null,
            error.message
        );
    }
};
