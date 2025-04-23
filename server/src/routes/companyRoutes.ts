import express from "express";
import { changeJobVisibility, companyLogin, getCompanyData, getCompanyPostedJobs, postJob, registerCompany } from "../controllers/companyController";
import upload from "../config/multer";

const router = express.Router();

// Register new company
router.post("/register", upload.single("image"), registerCompany);

// Company Login
router.post("/login", companyLogin);

// Post Job
router.post("/post-job", postJob);

// Get company data
router.get("/company-data", getCompanyData);

// Get company posted jobs
router.get("/company-jobs", getCompanyPostedJobs);

// Change job visibility
router.post("/change-visibility", changeJobVisibility);
