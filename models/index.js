import UserModel from './userModel.js';
import SlotModel from './slotModel.js';
import AppointmentModel from './appointmentModel.js';
import SpecializationModel from './specializationModel.js';
import { sequelize } from '../config/database.js';

const Specialization = SpecializationModel(sequelize);
const User = UserModel(sequelize);
const Slot = SlotModel(sequelize);
const Appointment = AppointmentModel(sequelize);

User.hasMany(Slot, { foreignKey: 'counselorId' });
Slot.belongsTo(User, { foreignKey: 'counselorId' });

Slot.belongsTo(Specialization, {
    as: 'specialization',
    foreignKey: 'specializationId',
});

User.hasMany(Appointment, { foreignKey: 'userId' });
Appointment.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Appointment, { foreignKey: 'counselorId' });
Appointment.belongsTo(User, { foreignKey: 'counselorId' });

Slot.hasMany(Appointment, { as: 'appointments', foreignKey: 'slotId' });
Appointment.belongsTo(Slot, { foreignKey: 'slotId' });

User.belongsToMany(Specialization, {
    through: 'UserSpecializations',
    as: 'specializations',
    foreignKey: 'userId',
});
Specialization.belongsToMany(User, {
    through: 'UserSpecializations',
    as: 'users',
    foreignKey: 'specializationId',
});

const models = {
    User,
    Slot,
    Appointment,
    Specialization,
};

export default models;
