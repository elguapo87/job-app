import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import companyModel from "../models/companyModel";

export interface AuthRequest extends Request {
    companyId?: typeof companyModel.prototype;
}

const protectCompany = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        const token = req.headers.token as string;;
        if (!token) {
            res.status(401).json({ success: false, message: "Not Authorized, Login Again" });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        req.companyId = decoded.id;

        next();

    } catch (error) {
        res.status(401).json({ success: false, message: "Token verification failed" });
    }
};

export default protectCompany;





























