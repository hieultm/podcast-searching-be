import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db";

const authRoute = require("./routes/auth/authRoute");
const fileUploadRoute = require("./routes/data/fileUploadRoute");
const podcastRoute = require("./routes/data/podcastRoute");
const userRoute = require("./routes/auth/userRoute");
const postRoute = require("./routes/data/postRoute");

const app: Application = express();
const PORT = process.env.port || 5000;

connectDB();

// middleware apply cors and all request
app.use(express.json());
app.use(cors());

app.set("trust proxy", 1);

//routes

app.use("/api/auth", authRoute);
app.use("/api/data", fileUploadRoute);
app.use("/api/data", podcastRoute);
app.use("/api/auth", userRoute);
app.use("/api/data", postRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("APP IS RUNNING");
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

export default app;
