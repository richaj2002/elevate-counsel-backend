import { DataTypes } from 'sequelize';

const UserModel = (sequelize) => {
    const User = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            role: {
                type: DataTypes.ENUM('admin', 'user', 'counselor'),
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            password: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            counselorTitle: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            counselorDescription: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            isEmailVerified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            country: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            profilePhoto: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            status: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                onUpdate: DataTypes.NOW,
            },
        },
        {
            timestamps: false,
        }
    );

    return User;
};

export default UserModel;
