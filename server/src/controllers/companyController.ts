import { Request, Response } from "express";
import bcrypt from "bcrypt";
import companyModel from "../models/companyModel";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken";
import validator from "validator";

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

// Company Login 
export const loginCompany = async (req: Request, res: Response) => {

};

// Get Company Data
export const getCompanyData = async (req: Request, res: Response) => {

};

// Post a New Job
export const postJob = async (req: Request, res: Response) => {

};

// Get Company Job Applicants
export const getCompanyJobApplicants = async (req: Request, res: Response) => {

};

// Get Company Posted Jobs
export const getCompanyPostedJobs = async (req: Request, res: Response) => {

};

// Change Job Application Status
export const changeJobApplicationStatus = async (req: Request, res: Response) => {

};

// Change Job Visibility
export const changeJobVisibility = async (req: Request, res: Response) => {

};