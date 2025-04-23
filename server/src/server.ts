import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoDBConnect from "./config/dbConnect";
import { clerkWebhooks } from "./controllers/webhooks";
import companyRoutes from "./routes/companyRoutes";
import connectCloudinary from "./config/cloudinary";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post("/webhooks", clerkWebhooks);
app.use("/api/company", companyRoutes);

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