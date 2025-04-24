import express from "express";
import { applyForJob, getUserApplyData, getUserData } from "../controllers/userController";

const router = express.Router();

// Get clerk user data
router.get("/user", getUserData);

// Apply for job
router.post("/job-apply", applyForJob);

// Get applied jobs
router.get("/applied-jobs", getUserApplyData);

export default router;