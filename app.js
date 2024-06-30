import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import slotRouter from './routes/slotRoutes.js';
import appointmentRouter from './routes/appointmentRoutes.js';
import { sequelize } from './config/database.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/slot', slotRouter);
app.use('/appointment', appointmentRouter);

sequelize.sync()
    .then(() => {
        console.log('Database connected');
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
