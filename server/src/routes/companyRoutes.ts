import express from "express";
import { changeJobVisibility, companyLogin, getCompanyData, getCompanyJobs, postJob, registerCompany } from "../controllers/companyController";
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

export default router;
