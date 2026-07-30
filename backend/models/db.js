import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.join(__dirname, 'schema.sql');
const requiredTables = ['users', 'health_assessments'];

// Check if we are in a production environment
const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool(
    process.env.DATABASE_URL 
    ? { 
        connectionString: process.env.DATABASE_URL,
        // SSL is usually required for hosted databases
        ssl: isProduction ? { rejectUnauthorized: false } : false
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        // Parse the port as an integer just to be safe
        port: parseInt(process.env.DB_PORT || '5432', 10),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'aamchi_mumbai',
    }
);

pool.on('error', (err) => {
    console.error("Unexpected pg pool error", err);
    process.exit(-1); // It is good practice to exit if the pool fails completely
});

export async function initializeDatabase() {
    const { rows } = await pool.query(
        `SELECT table_name
         FROM information_schema.tables
         WHERE table_schema = 'public'
           AND table_name = ANY($1::text[])`,
        [requiredTables]
    );

    const existingTables = new Set(rows.map((row) => row.table_name));
    const missingTables = requiredTables.filter((tableName) => !existingTables.has(tableName));

    if (missingTables.length > 0) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await pool.query(schemaSql);
        console.log(`Database schema initialized: ${missingTables.join(', ')}`);
    }

    await pool.query('SELECT NOW()');
    console.log('Successfully connected to the database.');
}

export default pool;