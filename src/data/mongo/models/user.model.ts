import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    emailValidated: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    img: String,
    role: {
        type: [String],
        enum: ["ADMIN_ROLE", "USER_ROLE"],
        default: ["USER_ROLE"],
    },
},{
    timestamps: true,
});

userSchema.set("toJSON", {
    transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
    },
});

export const UserModel = mongoose.model("User", userSchema);