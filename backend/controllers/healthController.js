import pool from "../models/db.js";

// Create a health assessment
export async function createAssessment(req, res) {
    try {
        const {
            user_id,
            risk_score = 0,
            diabetes_status = null,
            high_bp = false,
            high_chol = false,
            stroke = false,
            heart_disease = false,
            bmi = null,
            glucose_before_fasting = null,
            glucose_after_fasting = null,
            smoker = false,
            physical_activity = false,
            fruits = false,
            veggies = false,
            heavy_alcohol = false,
            sleep_hours = null,
            sleep_quality = null,
            sugar_intake = null,
            exercise_frequency = null,
            polyuria = null,
            polydipsia = null,
            polyphagia = null,
            gen_health = null,
            mental_health = null,
            phys_health = null,
            stress_level = null,
            family_history = null,
            healthcare_coverage = false,
            no_doc_bc_cost = false,
            diff_walk = false,
            age_category = null
        } = req.body;

        // Check if user already has an assessment
        const toNumber = (v) => (v === "" || v == null ? null : Number(v));
        const existing = await pool.query(
            "SELECT id FROM health_assessments WHERE user_id = $1",
            [user_id]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({
                error: "Assessment already exists",
                id: existing.rows[0].id,
            });
        }
        const result = await pool.query(
            `INSERT INTO health_assessments (
                user_id,
                risk_score,
                diabetes_status,
                high_bp,
                high_chol,
                stroke,
                heart_disease,
                bmi,
                glucose_before_fasting,
                glucose_after_fasting,
                smoker,
                physical_activity,
                fruits,
                veggies,
                heavy_alcohol,
                sleep_hours,
                sleep_quality,
                sugar_intake,
                exercise_frequency,
                polyuria,
                polydipsia,
                polyphagia,
                gen_health,
                mental_health,
                phys_health,
                stress_level,
                family_history,
                healthcare_coverage,
                no_doc_bc_cost,
                diff_walk,
                age_category
            )
            VALUES (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
                $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
                $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31
            )
            RETURNING *`,
            [
                user_id,
                risk_score,
                diabetes_status,
                high_bp,
                high_chol,
                stroke,
                heart_disease,
                toNumber(bmi),
                toNumber(glucose_before_fasting),
                toNumber(glucose_after_fasting),
                smoker,
                physical_activity,
                fruits,
                veggies,
                heavy_alcohol,
                toNumber(sleep_hours),
                sleep_quality,
                sugar_intake,
                exercise_frequency,
                polyuria,
                polydipsia,
                polyphagia,
                gen_health,
                toNumber(mental_health),
                toNumber(phys_health),
                stress_level,
                family_history,
                healthcare_coverage,
                no_doc_bc_cost,
                diff_walk,
                age_category
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create assessment" });
    }
}

// Get all assessments for a user
export async function getAssessments(req, res) {
    try {
        const { userId } = req.params;
        const result = await pool.query(
            "SELECT * FROM health_assessments WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch assessments" });
    }
}

export async function updateAssessment(req, res) {
    try {
        const { id } = req.params;

        const {
            risk_score,
            diabetes_status,
            high_bp,
            high_chol,
            stroke,
            heart_disease,
            bmi,
            glucose_before_fasting,
            glucose_after_fasting,
            smoker,
            physical_activity,
            fruits,
            veggies,
            heavy_alcohol,
            sleep_hours,
            sleep_quality,
            sugar_intake,
            exercise_frequency,
            polyuria,
            polydipsia,
            polyphagia,
            gen_health,
            mental_health,
            phys_health,
            stress_level,
            family_history,
            healthcare_coverage,
            no_doc_bc_cost,
            diff_walk,
            age_category
        } = req.body;
        const toNumber = (v) => (v === "" || v == null ? null : Number(v));
        const result = await pool.query(
            `UPDATE health_assessments
             SET
                risk_score=$1,
                diabetes_status=$2,
                high_bp=$3,
                high_chol=$4,
                stroke=$5,
                heart_disease=$6,
                bmi=$7,
                glucose_before_fasting=$8,
                glucose_after_fasting=$9,
                smoker=$10,
                physical_activity=$11,
                fruits=$12,
                veggies=$13,
                heavy_alcohol=$14,
                sleep_hours=$15,
                sleep_quality=$16,
                sugar_intake=$17,
                exercise_frequency=$18,
                polyuria=$19,
                polydipsia=$20,
                polyphagia=$21,
                gen_health=$22,
                mental_health=$23,
                phys_health=$24,
                stress_level=$25,
                family_history=$26,
                healthcare_coverage=$27,
                no_doc_bc_cost=$28,
                diff_walk=$29,
                age_category=$30
             WHERE id=$31
             RETURNING *`,
           [
            risk_score,
            diabetes_status,
            high_bp,
            high_chol,
            stroke,
            heart_disease,
            toNumber(bmi),
            toNumber(glucose_before_fasting),
            toNumber(glucose_after_fasting),
            smoker,
            physical_activity,
            fruits,
            veggies,
            heavy_alcohol,
            toNumber(sleep_hours),
            sleep_quality,
            sugar_intake,
            exercise_frequency,
            polyuria,
            polydipsia,
            polyphagia,
            gen_health,
            toNumber(mental_health),
            toNumber(phys_health),
            stress_level,
            family_history,
            healthcare_coverage,
            no_doc_bc_cost,
            diff_walk,
            age_category,
            id
        ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Assessment not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update assessment" });
    }
}