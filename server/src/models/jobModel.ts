import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    visible: {
        type: Boolean,
        default: true
    },
    date: {
        type: Number,
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "company",
        required: true
    }
});

const jobModel = mongoose.models.job || mongoose.model("job", jobSchema);

export default jobModel;
