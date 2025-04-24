import { AuthObject } from "@clerk/express";
import { Request, Response } from "express";
import userModel from "../models/userModel";
import jobApplyModel from "../models/jobApplyModel";
import jobModel from "../models/jobModel";
import { v2 as cloudinary } from "cloudinary";

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

// Function for job apply
export const applyForJob = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const { jobId } = req.body;

    if (!req.auth || !req.auth.userId) return res.json({ success: false, message: "Unauthorized" });
    const userId = req.auth.userId;

    try {
        // Check if user is already applied for the job
        const isAlreadyApplied = await jobApplyModel.find({ userId, jobId });
        if (isAlreadyApplied.length > 0) return res.json({ success: false, message: "Already applied for this job" });

        const jobData = await jobModel.findById(jobId);
        if (!jobData) return res.json({ success: false, message: "Job not found" });

        await jobApplyModel.create({
            userId,
            companyId: jobData.companyId,
            jobId,
            date: Date.now()
        });

        res.json({ success: true, message: "Successfully applied for the job" });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.json({ success: false, message: errMessage });
    }
};


// Function for get user jobs applied data
export const getUserApplyData = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    if (!req.auth || !req.auth.userId) return res.json({ success: false, message: "Unauthorized" });
    const userId = req.auth.userId;

    try {
        const jobsApplied = await jobApplyModel.find({userId})
            .populate("jobId", "title description location level category salary")
            .populate("companyId", "name email image")
            .exec();

            if (!jobsApplied) return res.json({ success: false, message: "No jobs applications found" });

            res.json({ success: true, jobsApplied });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.json({ success: false, message: errMessage });
    }
};

// Function for update user resume (only)
export const updateUserResume = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    if (!req.auth || !req.auth.userId) return res.json({ success: false, message: "Unauthorized" });
    const userId = req.auth.userId;

    const resumeFile = req.file;

    try {
        const userData = await userModel.findById(userId);
        
        if (resumeFile) {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);
            userData.resume = resumeUpload.secure_url;
        }

        await userData.save();

        return res.json({ success: true, message: "Resume Updated" });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.json({ success: false, message: errMessage });
    }
};