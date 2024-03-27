import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: true,
    },
    available: {
        type: Boolean,
        default: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
},{
    timestamps: true,
});

categorySchema.set("toJSON", {
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});

export const CategoryModel = mongoose.model("Category", categorySchema);