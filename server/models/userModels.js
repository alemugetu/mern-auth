import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
verifyotp: {
    type: String,
    default: null,},
    verifyotpExpiryAt: {
        type: Number,
        default: 0,
    },

    isAccountVerified: {
        type: Boolean,
        default: false,
    },
    resetotp: {
        type: String,
        default: null,
    },
    resetotpExpiryAt: {
        type: Number,
        default: 0,
    },

});

const  userModels = mongoose.models.user || mongoose.model("user", userSchema);

export default userModels;