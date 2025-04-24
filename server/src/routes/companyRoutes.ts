import express from "express";
import { changeJobStatus, changeJobVisibility, companyLogin, getApplicants, getCompanyData, getCompanyJobs, postJob, registerCompany, updateJob } from "../controllers/companyController";
import upload from "../config/multer";
import protectCompany from "../middlewares/companyAuth";


const router = express.Router();

// Register new company
router.post("/register", upload.single("image"), registerCompany);

// Company Login
router.post("/login", companyLogin);

// Post Job
router.post("/post-job", protectCompany, postJob);

// Get company data
router.get("/company-data", protectCompany, getCompanyData);

// Get company posted jobs
router.get("/company-jobs", protectCompany, getCompanyJobs);

// Change job visibility
router.post("/change-visibility", protectCompany, changeJobVisibility);

// Get company jobs applicants
router.get("/applicants", protectCompany, getApplicants);

// Change job status
router.post("/change-status", protectCompany, changeJobStatus);

// Update job
router.post("/update-job", protectCompany, updateJob);

export default router;