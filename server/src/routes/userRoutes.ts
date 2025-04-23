import express from "express";
import { getUserData } from "../controllers/userController";

const router = express.Router();

// Get clerk user data
router.get("/user", getUserData);

export default router;