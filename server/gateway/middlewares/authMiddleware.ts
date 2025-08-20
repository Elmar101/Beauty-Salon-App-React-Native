import { Request, Response, NextFunction } from "express";
import  jwt from 'jsonwebtoken';
export interface AuthRequest extends Request {
    user?: any;
};

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
   const token = req.headers.authorization?.split(' ')[1];
   if (!token) {
        return next({
            status: 401,
            message: 'Unauthorized: No token provided'
        });
   }
   try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = payload;
    next();
   } catch (error) {
     next({
        status: 401,
        message: 'Unauthorized: Invalid token'
     });
   }
}

