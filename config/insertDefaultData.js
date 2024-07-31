import models from '../models/index.js';
import bcrypt from 'bcryptjs';
import { counselorDemoData } from './counselorDemoData.js';
const { User, Specialization } = models;

export const insertDefaultSpecializationData = async () => {
    try {
        const count = await Specialization.count();

        if (count === 0) {
            await Specialization.bulkCreate([
                { name: 'Career Counseling' },
                { name: 'Academic Counseling' },
                { name: 'Personal Counseling' },
                { name: 'Relationship Counseling' },
                { name: 'Mental Health Counseling' },
                { name: 'Substance Abuse Counseling' },
                { name: 'Financial Counseling' },
                { name: 'Health and Wellness Counseling' },
                { name: 'Marriage and Family Counseling' },
                { name: 'Workplace Counseling' },
            ]);
            console.log('Default specializations have been inserted.');
        } else {
            console.log('Specializations table already has data.');
        }
    } catch (error) {
        console.error('Error inserting default data:', error);
    }
};

export const createAdmin = async () => {
    try {
        const admin = await User.findAll({ where: { role: 'admin' } });
        if (admin.length === 0) {
            await User.create({
                name: 'Super Admin',
                email: 'elevate.counsel90@gmail.com',
                password: await bcrypt.hash('Yahoo@123', 10),
                role: 'admin',
                country: 'India',
                profilePhoto: `http://localhost:3000/uploads/default-profile.webp`,
                isEmailVerified: true,
            });
            console.log('Admin created successfully.');
        } else {
            console.log('Admin already created.');
        }
    } catch (error) {
        console.error('Error creating admin:', error);
    }
};

export const createDemoCounselors = async () => {
    try {
        const counselors = await User.findAll({ where: { role: 'counselor' } });
        if (counselors.length <= 5) {
            for (const [index, counselor] of counselorDemoData.entries()) {
                try {
                    const user = await User.create({
                        name: counselor.name,
                        email: `bindabhishek22+${index + 1}@gmail.com`,
                        password: await bcrypt.hash('Yahoo@123', 10),
                        role: 'counselor',
                        country: 'India',
                        counselorTitle: counselor.counselorTitle,
                        counselorDescription: counselor.counselorDescription,
                        profilePhoto:
                            'http://localhost:3000/uploads/default-profile.webp',
                        isEmailVerified: true,
                    });

                    if (
                        counselor.specializations &&
                        counselor.specializations.length > 0
                    ) {
                        const specializations = await Specialization.findAll({
                            where: {
                                id: counselor.specializations,
                            },
                        });
                        await user.addSpecializations(specializations);
                    }
                } catch (error) {
                    console.error(
                        `Error creating counselor ${counselor.name}:`,
                        error
                    );
                }
            }
        }
    } catch (error) {
        console.error('Error creating counselors:', error);
    }
};
