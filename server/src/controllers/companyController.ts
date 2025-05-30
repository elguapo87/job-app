import { Request, Response } from "express";
import bcrypt from "bcrypt";
import companyModel from "../models/companyModel";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken";
import validator from "validator";
import { AuthRequest } from "../middlewares/companyAuth";
import jobModel from "../models/jobModel";
import jobApplyModel from "../models/jobApplyModel";

// Function to register company
export const registerCompany = async (req: Request, res: Response): Promise<any> => {
    const { name, email, password } = req.body;
    const imageFile = req.file;

    if (!name || !email || !password) return res.json({ success: false, message: "Missing Details" });

    try {
        // Check if company already exists
        const isCompanyExists = await companyModel.findOne({ email });
        if (isCompanyExists) return res.json({ success: false, message: "Company already registered" });

        // Check password length
        if (password.length < 8) return res.json({ success: false, message: "Password must have at least 8 characters" });

        // Hashing Password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Checking is email valid
        const isEmailValid = validator.isEmail(email);
        if (!isEmailValid) return res.json({ success: false, message: "Email address format is not valid" });

        // Check if image file exists before uploading
        let imageUrl = "";
        if (imageFile?.path) {
            // Upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile?.path, { resource_type: "image" });
            imageUrl = imageUpload.secure_url;
        }

        const company = await companyModel.create({
            name,
            email,
            password: hashPassword,
            image: imageUrl
        });

        res.json({
            success: true,
            message: "Company registered successfully",
            company: {
                _id: company._id.toString(),
                name: company.name,
                email: company.email,
                image: company.image
            },
            token: generateToken(company._id.toString())
        });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occured";
        res.json({ success: false, message: errMessage });
    }
};

// Function for company login
export const companyLogin = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    try {
        const company = await companyModel.findOne({ email });
        if (!company) return res.json({ success: false, message: "Company is not registered" });

        // Matching password with password from DB
        const isPasswordMatching = await bcrypt.compare(password, company.password);
        if (!isPasswordMatching) return res.json({ success: false, message: "Invalid Credentials" });

        res.json({
            success: true,
            message: "Successfully Logged in",
            company: {
                name: company.name,
                email: company.email,
                image: company.image
            },
            token: generateToken(company._id.toString())
        });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occured";
        res.json({ success: false, message: errMessage });
    }
};

// Function for post a new job
export const postJob = async (req: AuthRequest, res: Response): Promise<any> => {
    const { title, description, location, category, level, salary } = req.body;

    if (!req.companyId) return res.json({ success: false, message: "Unauthorized, no company data" });
    const companyId = req.companyId;

    try {
        const newJob = new jobModel({
            title,
            description,
            location,
            category,
            level,
            salary,
            date: Date.now(),
            companyId: companyId
        });

        const savedJob = await newJob.save();
        res.json({ success: true, message: "Job added successfully", savedJob });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occured";
        res.json({ success: false, message: errMessage });
    }
};

// Function to get company data
export const getCompanyData = async (req: AuthRequest, res: Response): Promise<any> => {
    if (!req.companyId) return res.json({ success: false, message: "Unauthorized, no company data" });
    const companyId = req.companyId;

    try {
        const companyData = await companyModel.findById(companyId);

        const { password, ...companyRest } = companyData._doc;

        res.json({ success: true, companyRest });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occured";
        res.json({ success: false, message: errMessage });
    }
};


// Function to get company posted jobs
export const getCompanyJobs = async (req: AuthRequest, res: Response): Promise<any> => {
    if (!req.companyId) return res.json({ success: false, message: "Unauthorized, no company data" });
    const companyId = req.companyId;

    try {
        const companyJobs = await jobModel.find({ companyId });

        // Adding number of applicants info in data
        const jobsData = await Promise.all(companyJobs.map(async (job) => {
            const applicants = await jobApplyModel.find({ jobId: job._id });
            return { ...job.toObject(), applicantsNumber: applicants.length };
        }))

        res.json({ success: true, jobsData });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occured";
        res.json({ success: false, message: errMessage });
    }
};

// Function to change job visibility
export const changeJobVisibility = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        if (!req.companyId) return res.json({ success: false, message: "Unauthorized, no company data" });
        const companyId = req.companyId;

        const { id } = req.body;
        if (!id) return res.json({ success: false, message: "Job ID is required" });

        const job = await jobModel.findById(id);

        if (companyId.toString() === job.companyId.toString()) {
            job.visible = !job.visible;

        } else {
            return res.json({ success: false, message: "Unauthorized to change this job visibility" });
        }

        await job.save();

        res.json({ success: true, message: "Visibility Changed", job });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occured";
        res.json({ success: false, message: errMessage });
    }
};


// Function to get company jobs applicants 
export const getApplicants = async (req: AuthRequest, res: Response): Promise<any> => {
    if (!req.companyId) return res.json({ success: false, message: "Unauthorized, no company data" });
    const companyId = req.companyId;

    try {
        const applicants = await jobApplyModel.find({ companyId })
            .populate("userId", "name email image resume")
            .populate("jobId", "title location category level salary")
            .exec();

        res.json({ success: true, applicants });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occured";
        res.json({ success: false, message: errMessage });
    }
};


// Function to change job status
export const changeJobStatus = async (req: Request, res: Response): Promise<any> => {
    const { id, status } = req.body;

    try {
        await jobApplyModel.findOneAndUpdate({ _id: id }, { status });
        res.json({ success: true, message: "Status Changed" });

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occured";
        res.json({ success: false, message: errMessage });
    }
};


// Function to update job
export const updateJob = async (req: Request, res: Response) => {
    const { id, title, description, location, level, category, salary } = req.body;

    try {
        await jobModel.findByIdAndUpdate(id, {
            title, 
            description,
            location,
            category,
            level,
            salary
        });

        res.json({ success: true, message: "Job Updated" })

    } catch (error) {
        const errMessage = error instanceof Error ? error.message : "An unknown error occured";
        res.json({ success: false, message: errMessage });
    }
};