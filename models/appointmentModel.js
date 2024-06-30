import { DataTypes } from 'sequelize';

const AppointmentModel = (sequelize) => {
	const Appointment = sequelize.define('Appointment', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			references: {
				model: 'Users',
				key: 'id',
			},
		},
		counselorId: {
			type: DataTypes.INTEGER,
			references: {
				model: 'Users',
				key: 'id',
			},
		},
		slotId: {
			type: DataTypes.INTEGER,
			references: {
				model: 'Slots',
				key: 'id',
			},
		},
		status: {
			type: DataTypes.ENUM('booked', 'cancelled', 'completed'),
			allowNull: false,
			defaultValue: 'booked',
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

	return Appointment;
};

export default AppointmentModel;
