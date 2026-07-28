import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

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

// Test the connection immediately on startup
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Failed to connect to the database:', err.message);
    } else {
        console.log('Successfully connected to the database.');
    }
});

pool.on('error', (err) => {
    console.error("Unexpected pg pool error", err);
    process.exit(-1); // It is good practice to exit if the pool fails completely
});

export default pool;