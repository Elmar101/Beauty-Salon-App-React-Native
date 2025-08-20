import { NextFunction, Request, Response } from "express";
import dotenv from 'dotenv';
import axios from "axios";

dotenv.config();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:8080/api/v1/users';

export const getUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        const response = await axios.get(`${USER_SERVICE_URL}/${userId}`);
        res.status(response.status).json({
            status: 'success',
            data: response.data,
            errors: null,
            statusCode: response.status
        });
    } catch (error) {
        next(error);
    }
}

export const getUsersController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await axios.get(USER_SERVICE_URL);
        res.status(response.status).json({
            status: 'success',
            data: response.data,
            errors: null,
            statusCode: response.status
        });
    } catch (error) {
        next(error);
    }
}

export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        const response = await axios.put(`${USER_SERVICE_URL}/${userId}`, req.body);
        res.status(response.status).json({
            status: 'success',
            data: response.data,
            errors: null,
            statusCode: response.status
        });
    } catch (error) {
        next(error);
    }
}

export const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        const response = await axios.put(`${USER_SERVICE_URL}/${userId}/delete`, req.body);
        res.status(response.status).json({
            status: 'success',
            data: response.data,
            errors: null,
            statusCode: response.status
        });
    } catch (error) {
        next(error);
    }
}

export const deleteAllUsersController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await axios.delete(USER_SERVICE_URL);
        res.status(response.status).json({
            status: 'success',
            data: null,
            errors: null,
            statusCode: response.status
        });
    } catch (error) {
        next(error);
    }
}