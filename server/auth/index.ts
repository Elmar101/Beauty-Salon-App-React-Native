import express from 'express';
import dotenv from 'dotenv';
import {authRouter, userRouter} from './routes';
import path from 'path';
import { connectDB } from './db';

dotenv.config({ path: './.env' });

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

connectDB();


app.listen(process.env.PORT || 8080, () => {
    console.log('Server is running on http://localhost:8080');
});