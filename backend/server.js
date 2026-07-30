import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import { initializeDatabase } from "./models/db.js";
import path from 'path';
import { fileURLToPath } from 'url';
const app = express();

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000"
}));

app.use('/api',authRoutes);
app.use("/api",healthRoutes);

// Serve frontend static files if available (built with `npm run build`)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDist = process.env.FRONTEND_DIST || path.join(__dirname, '..', 'dist');

try {
    app.use(express.static(frontendDist));
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendDist, 'index.html'));
    });
} catch (e) {
    // If dist isn't present, expose a simple root endpoint
    app.get('/', (req, res) => res.send('Hello from Diasense'));
}

async function startServer() {
    try {
        await initializeDatabase();
        app.listen(PORT,()=>{
            console.log(`Listening on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to initialize the database:', error);
        process.exit(1);
    }
}

startServer();