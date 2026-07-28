import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import roomRoutes from "./routes/room";
import shapeRoutes from "./routes/shape";

const app = express();
app.use(express.json());
app.use(cors());

app.use(authRoutes);
app.use(roomRoutes);
app.use(shapeRoutes);

app.listen(3001);