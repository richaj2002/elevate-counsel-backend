import { DataTypes } from 'sequelize';

const SpecializationModel = (sequelize) => {
    const Specialization = sequelize.define(
        'Specialization',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            timestamps: false,
        }
    );

    return Specialization;
};

export default SpecializationModel;
