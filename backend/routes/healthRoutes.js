import express from "express";
import {
    createAssessment,
    getAssessments,
    updateAssessment
} from "../controllers/healthController.js";

const router = express.Router();

router.post("/assessment", createAssessment);

router.get("/assessment/:userId", getAssessments);

router.put("/assessment/:id", updateAssessment);

export default router;