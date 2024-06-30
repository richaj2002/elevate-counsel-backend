import UserModel from './userModel.js';
import SlotModel from './slotModel.js';
import AppointmentModel from './appointmentModel.js';
import { sequelize } from '../config/database.js';

const User = UserModel(sequelize);
const Slot = SlotModel(sequelize);
const Appointment = AppointmentModel(sequelize);

User.hasMany(Slot, { foreignKey: 'counselorId' });
Slot.belongsTo(User, { foreignKey: 'counselorId' });

User.hasMany(Appointment, { foreignKey: 'userId' });
Appointment.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Appointment, { foreignKey: 'counselorId' });
Appointment.belongsTo(User, { foreignKey: 'counselorId' });

Slot.hasMany(Appointment, { foreignKey: 'slotId' });
Appointment.belongsTo(Slot, { foreignKey: 'slotId' });

const models = {
    User,
    Slot,
    Appointment,
};

export default models;
