import { Request, Response, NextFunction } from "express";

export const responseWrapper = (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json;
    res.json = function(data: any)  {
        const statusCode = data.statusCode;
        if(statusCode > 400) {
            return originalJson.call(this, data);
        } 
        if(data && typeof data === 'object' &&'data' in data && 'errors' in data) {
           return originalJson.call(this, data);
        } else {
            return originalJson.call(this, {data, errors: null, status: 'success', statusCode: res.statusCode});
        }
    };
    next();
};