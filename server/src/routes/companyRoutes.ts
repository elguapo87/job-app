import express from "express";
import { changeJobApplicationStatus, changeJobVisibility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from "../controllers/companyController";

const router = express.Router();

// Register a New Company
router.post("/register", registerCompany);
// Company Login
router.post("/login", loginCompany);
// Get Company Data
router.get("/company", getCompanyData);
// Post a New Job
router.post("/post-job", postJob);
// Get Company Job Applicants
router.get("/applicatnts", getCompanyJobApplicants);
// Get Company Posted Jobs
router.get("/job-list", getCompanyPostedJobs);
// Change Job Application Status
router.post("/change-status", changeJobApplicationStatus);
// Change Job Visibility
router.post("/change-visibility", changeJobVisibility);

export default router