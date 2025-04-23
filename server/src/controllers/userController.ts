import { AuthObject } from "@clerk/express";
import { Request, Response } from "express";
import userModel from "../models/userModel";

interface AuthenticatedRequest extends Request {
    auth?: AuthObject;
}

// Function to get clerk user data
export const getUserData = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    if (!req.auth || !req.auth.userId) return res.json({ success: false, message: "Unauthorized" });
    const userId = req.auth.userId;

    try {
        const user = await userModel.findById(userId);
        if (!user) return res.json({ success: false, message: "User not found" });
        res.json({ success: true, user });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.json({ success: false, message: errMessage });
    }
};