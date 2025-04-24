import mongoose, { mongo } from "mongoose";

const mongoDBConnect = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_DB_URI}/job-portal-v2`);
        console.log("Database Connected");
        
    } catch (error) {
        console.error("Connection Failed");
        process.exit(1);
    }
};

export default mongoDBConnect;