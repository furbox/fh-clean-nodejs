import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: true,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
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
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Category is required"],
    },
},{
    timestamps: true,
});

productSchema.set("toJSON", {
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});

export const ProductModel = mongoose.model("Product", productSchema);