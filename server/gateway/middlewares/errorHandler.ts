import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.response?.status || err.statusCode || err.status || 500;
  const message = err.response?.data?.message || err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    errors: [message],
    data: null,
  });
};