import express from 'express';
import dotenv from 'dotenv';
import {authRouter} from './routes';
import path from 'path';
import { connectDB } from './db';
import { uploadDir } from './utils/uploadFile';

dotenv.config({ path: './.env' });

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/v1/auth', authRouter);

connectDB();


app.listen(process.env.PORT || 8080, () => {
    console.log('Server is running on http://localhost:8080');
});