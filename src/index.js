import dotenv from "dotenv";
dotenv.config({ path: "./env" }); // ✅ Correct for ES Modules
import connectDB from "./db/index.js";



connectDB();


