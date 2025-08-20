import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { authRouter, userRouter } from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { responseWrapper } from './middlewares/responseWrapper';
// import { connectDB } from './db';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(responseWrapper);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.use(errorHandler);

// connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
