import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";  // json web token
import bcrypt from "bcrypt"; // package that will encrypt the password before storing in the database.
import { ApiError } from "../utils/ApiError.js";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, // cloudnary url
            required: true
        },
        coverImage: {
            type: String // cloudnary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

// pre is a middleware that is available in mongoose, here it is used for encrypting the password and storing it before saving the user to the database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();  // if the password is not modified, then we will not encrypt it again.

    try {
        this.password = await bcrypt.hash(this.password, 10); // encrypt the password
        next();
    } catch (error) {
        throw new ApiError(500, "Something went wrong", error);
    }
});  // we cannot use arrow function here because we need to access the user object using this keyword and arrow function does not have this keyword in its scope.

// method to compare the password entered by the user with the password stored in the database
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// method to generate the jwt token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this.id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_GENERATE_TOKEN,
        {
            expiresIn: process.env.GENERATE_TOKEN_EXPIRY
        }
    );
}

// method to generate the refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this.id
        },
        process.env.ACCESS_REFRESH_TOKEN,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);