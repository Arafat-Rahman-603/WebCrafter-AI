import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationCode: {
            type: String,
        },
        verificationCodeExpiresAt: {
            type: Date,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpiresAt: {
            type: Date,
        },
        credits: {
            type: Number,
            default: 100,
            min: 0,
        },
        plan: {
            type: String,
            enum: ["free", "pro", "enterprise"],
            default: "free",
        },
        
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;
