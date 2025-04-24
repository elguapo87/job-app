import express, { application } from "express";
import { applyForJob, getUserApplyData, getUserData, updateUserResume } from "../controllers/userController";
import upload from "../config/multer";

const router = express.Router();

// Get clerk user data
router.get("/user", getUserData);

// Apply for job
router.post("/job-apply", applyForJob);

// Get applied jobs
router.get("/applied-jobs", getUserApplyData);

// Update user resume
router.post("/update-resume", upload.single("resume"), updateUserResume);

export default router;