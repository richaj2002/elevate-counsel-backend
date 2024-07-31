import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import slotRouter from './routes/slotRoutes.js';
import specializationRouter from './routes/specializationRoutes.js';
import appointmentRouter from './routes/appointmentRoutes.js';
import { sequelize } from './config/database.js';
import {
    insertDefaultSpecializationData,
    createAdmin,
    createDemoCounselors,
} from './config/insertDefaultData.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/uploads', express.static('uploads'));

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/slot', slotRouter);
app.use('/appointment', appointmentRouter);
app.use('/specialization', specializationRouter);

(async () => {
    try {
        await sequelize.sync();
        console.log('Database connected');

        await insertDefaultSpecializationData();
        await createAdmin();
        await createDemoCounselors();

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
})();
