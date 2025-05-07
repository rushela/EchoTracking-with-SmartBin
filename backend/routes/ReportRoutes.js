// backend/routes/ReportRoutes.js
import express from "express";
import { generateFullReport } from "../controllers/ReportController.js";

const router = express.Router();

router.get("/generate", generateFullReport);

export default router;
