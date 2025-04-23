import mongoose, { mongo } from "mongoose";

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
});

const companyModel = mongoose.models.company || mongoose.model("company", companySchema);

export default companyModel;