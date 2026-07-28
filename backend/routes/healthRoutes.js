import express from "express";
import {
    createAssessment,
    getAssessments,
    updateAssessment
} from "../controllers/healthController.js";
import axios from "axios";

const router = express.Router();

router.post("/assessment", createAssessment);

router.get("/assessment/:userId", getAssessments);

router.put("/assessment/:id", updateAssessment);

router.post('/predict', async (req, res) => {
    try {
        // req.body contains all the frontend form data.
        // We forward it directly to the Python FastAPI server running on port 8000
        const fastApiResponse = await axios.post('http://127.0.0.1:8000/predict', req.body);
        
        // Return FastAPI's JSON back to the React frontend
        res.json(fastApiResponse.data);
    } catch (error) {
        console.error("Error calling ML service:", error.message);
        res.status(500).json({ error: "Failed to generate prediction from ML server." });
    }
});

export default router;