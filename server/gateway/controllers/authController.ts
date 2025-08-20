import { NextFunction, Request, Response } from "express";
import dotenv from 'dotenv';
import axios from "axios";

dotenv.config();

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:8080/api/v1/auth';

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await axios.post(`${AUTH_SERVICE_URL}/register`, req.body);
        if (response.status !== 201) {
            return res.status(response.status).json({ message: 'Registration failed' });
        }
        // Assuming the response contains user data or a token
        const userData = response.data;
        // Handle registration logic here
        res.json({ message: 'Registration successful', data: userData });
    } catch (error) {
        next(error);
    }
}

export const verifyTokenController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await axios.post(`${AUTH_SERVICE_URL}/verify`, req.body);
        if (response.status !== 200) {
        return res.status(response.status).json({ message: 'Token verification failed' });
        }
        // Assuming the response contains user data or a token
        const userData = response.data;
        // Handle token verification logic here
        res.json({ message: 'Token verified successfully', data: userData });
    } catch (error) {
        next(error);
    }
}

export const loginController =  async (req: Request<any, any, { email: string; password: string }>, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/login`, { email, password });
    if (response.status !== 200) {
      return res.status(response.status).json({ message: 'Login failed' });
    }
    // Assuming the response contains user data or a token
    const userData = response.data;
    // Handle login logic here
    res.json({ message: 'Login successful', data: userData });
  } catch (error) {
    next(error);
  }
}


export const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await axios.post(`${AUTH_SERVICE_URL}/refresh`, req.body);
        if (response.status !== 200) {
            return res.status(response.status).json({ message: 'Token refresh failed' });
        }
        // Assuming the response contains a new token
        const newToken = response.data;
        // Handle token refresh logic here
        res.json({ message: 'Token refreshed successfully', data: newToken });
    } catch (error) {
        next(error);
    }
}

export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await axios.post(`${AUTH_SERVICE_URL}/logout`, req.body);
        if (response.status !== 200) {
            return res.status(response.status).json({ message: 'Logout failed' });
        }
        // Handle logout logic here
        res.json({ message: 'Logout successful' });
    } catch (error) {
        next(error);
    }
}

export const forgotPasswordController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await axios.post(`${AUTH_SERVICE_URL}/forgot-password`, req.body);
        if (response.status !== 200) {
            return res.status(response.status).json({ message: 'Forgot password request failed' });
        }
        // Handle forgot password logic here
        res.json({ message: 'Forgot password request successful' });
    } catch (error) {
        next(error);
    }
}

export const verifyForgotPasswordController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await axios.post(`${AUTH_SERVICE_URL}/verify-forgot-password`, req.body);
        if (response.status !== 200) {
            return res.status(response.status).json({ message: 'Verification failed' });
        }
        // Handle verification logic here
        res.json({ message: 'Verification successful' });
    } catch (error) {
        next(error);
    }
}

export const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await axios.post(`${AUTH_SERVICE_URL}/reset-password`, req.body);
        if (response.status !== 200) {
            return res.status(response.status).json({ message: 'Password reset failed' });
        }
        // Handle password reset logic here
        res.json({ message: 'Password reset successful' });
    } catch (error) {
        next(error);
    }
}

