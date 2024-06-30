import { DataTypes } from 'sequelize';

const SlotModel = (sequelize) => {
    const Slot = sequelize.define('Slot', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        counselorId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
        appointmentURL: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        maxSlotSize: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        isOneOnOneSession: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('active', 'running', 'cancelled', 'completed'),
            allowNull: false,
            defaultValue: 'active',
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
    }, {
        timestamps: false,
    });

    return Slot;
};

export default SlotModel;
