import express from "express";
import { getJobById, getJobs } from "../controllers/jobController";

const router = express.Router();

// Get all jobs
router.get("/jobs", getJobs);

// Get single job by id
router.get("/:id", getJobById);

export default router;