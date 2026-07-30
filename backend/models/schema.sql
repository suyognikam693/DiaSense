-- Enable UUID generation used by the table defaults
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    profile_picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;

-- Health Assessments Table
CREATE TABLE IF NOT EXISTS health_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    risk_score DECIMAL(5,2),
    
    -- Vitals & Medical Conditions
    diabetes_status VARCHAR(50),
    high_bp BOOLEAN,
    high_chol BOOLEAN,
    stroke BOOLEAN,
    heart_disease BOOLEAN,
    bmi DECIMAL(5,2),
    glucose_before_fasting DECIMAL(5,2),
    glucose_after_fasting DECIMAL(5,2),
    
    -- Lifestyle & Diet
    smoker BOOLEAN,
    physical_activity BOOLEAN,
    fruits BOOLEAN,
    veggies BOOLEAN,
    heavy_alcohol BOOLEAN,
    sleep_hours DECIMAL(4,2),
    sleep_quality VARCHAR(50),
    sugar_intake VARCHAR(50),
    exercise_frequency VARCHAR(50),
    
    -- Symptoms (The 3 Ps)
    polyuria VARCHAR(50),
    polydipsia VARCHAR(50),
    polyphagia VARCHAR(50),
    
    -- General Health Metrics
    gen_health INT,
    mental_health INT,
    phys_health INT,
    stress_level VARCHAR(50),
    
    -- Demographics & Background
    family_history VARCHAR(50),
    healthcare_coverage BOOLEAN,
    no_doc_bc_cost BOOLEAN,
    diff_walk BOOLEAN,
    age_category INT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);