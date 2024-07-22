import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/config";
import { IJwtTokenData } from "../../interfaces/IJwtData";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ status: false, message: 'Not authorized' });
        }
        const extracted_token = token.split(' ')[1];
        const decoded = jwt.verify(extracted_token, JWT_SECRET) as IJwtTokenData;
        
        req.user = decoded;
        next();
    } catch (err: Error | any) {
        console.log(err);
        res.status(401).json({ status: false, message: err.message })
    }
}