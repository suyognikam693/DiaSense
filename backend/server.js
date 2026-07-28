import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
const app = express();

const PORT = 5000;
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000"
}));

app.use('/api',authRoutes);
app.use("/api",healthRoutes);
app.get("/",(req,res)=>{
    res.send("Hello from Diasense");
})

app.listen(PORT,()=>{
    console.log("Listening on port 5000");
})