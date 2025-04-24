import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoDBConnect from "./config/dbConnect";
import { clerkWebhooks } from "./controllers/webhooks";
import companyRoutes from "./routes/companyRoutes";
import connectCloudinary from "./config/cloudinary";
import jobRoutes from "./routes/jobRoutes";
import { clerkMiddleware } from "@clerk/express";
import userRoutes from "./routes/userRoutes";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use(clerkMiddleware());

// app.use(
//     clerkMiddleware({
//         publishableKey: process.env.PUBLIC_CLERK_PUBLISHABLE_KEY,
//         secretKey: process.env.CLERK_SECRET_KEY,
//     })
// );

// Routes
app.post("/webhooks", clerkWebhooks);

app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("API is working");
});

const startServer = async () => {
    try {
        await mongoDBConnect();
        await connectCloudinary();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server Connection failed");
        process.exit(1);
    }
};

startServer();