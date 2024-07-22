import models from '../models/index.js';
import { responseRenderer } from '../utils/responseRenderer.js';
const { User, Specialization } = models;

export const getSpecializations = async (req, res) => {
    try {
        const specializations = await Specialization.findAll({
            order: [['name', 'ASC']],
        });
        responseRenderer(res, 200, '', specializations);
    } catch (error) {
        responseRenderer(
            res,
            500,
            'Failed to fetch specializations.',
            null,
            error.message
        );
    }
};

export const getCounselorSpecializations = async (req, res) => {
    try {
        const counselorId = req.user.id;

        const counselor = await User.findByPk(counselorId, {
            include: {
                model: Specialization,
                through: 'UserSpecializations',
                as: 'specializations',
                attributes: ['id', 'name'],
            },
        });

        if (!counselor) {
            return responseRenderer(res, 404, 'Counselor not found.');
        }

        const specializations = counselor.specializations.map((spec) => ({
            id: spec.id,
            name: spec.name,
        }));

        responseRenderer(
            res,
            200,
            'Counselor specializations fetched successfully.',
            specializations
        );
    } catch (error) {
        responseRenderer(
            res,
            500,
            'Failed to fetch counselor specializations.',
            null,
            error.message
        );
    }
};

export const addSpecialization = async (req, res) => {
    try {
        const { name } = req.body;
        const specialization = await Specialization.create({ name });
        responseRenderer(
            res,
            201,
            'Specialization created successfully.',
            specialization
        );
    } catch (error) {
        responseRenderer(
            res,
            500,
            'Failed to add specialization.',
            null,
            error.message
        );
    }
};

export const updateSpecialization = async (req, res) => {
    try {
        const specializationId = req.params.id;
        const updates = req.body;

        const specialization = await Specialization.findByPk(specializationId);
        if (!specialization) {
            return responseRenderer(res, 404, 'Specialization not found.');
        }

        await specialization.update(updates);
        responseRenderer(
            res,
            200,
            'Specialization updated successfully.',
            specialization
        );
    } catch (error) {
        responseRenderer(
            res,
            500,
            'Failed to update specialization.',
            null,
            error.message
        );
    }
};

export const deleteSpecialization = async (req, res) => {
    try {
        const specializationId = req.params.id;

        const specialization = await Specialization.findByPk(specializationId);
        if (!specialization) {
            return responseRenderer(res, 404, 'Specialization not found.');
        }

        await specialization.destroy();
        responseRenderer(res, 200, 'Specialization deleted successfully.');
    } catch (error) {
        responseRenderer(
            res,
            500,
            'Failed to delete specialization.',
            null,
            error.message
        );
    }
};
