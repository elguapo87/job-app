import { Request, Response } from "express";
import jobModel from "../models/jobModel";

// Function to get all jobs
export const getJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await jobModel.find({}).populate({ path: "companyId", select: "-password" });
        res.json({ success: true, jobs });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.json({ success: false, message: errMessage });
    }
};

// Function to get a single job by ID
export const getJobById = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    try {
        const job = await jobModel.findById(id).populate({ path: "companyId", select: "-password" });

        if (!job) return res.json({ success: false, message: "Job not found" });
            
        res.json({ success: true, job });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.json({ success: false, message: errMessage });
    }
};