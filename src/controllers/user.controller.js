import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/Cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;

    // check if all fields are provided by user 

    // option 1 - my solution
    // if(!fullName || !email || !username || !password) {
    //     throw new ApiError(400, "All input is required");
    // }

    // option 2
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // check if user exists before
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    // checking for username and email
    // option 1 - my solution
    // if ([existedUser.email, existedUser.username].includes(email)) {
    //     throw new ApiError(400, `User with email already exists`);
    // }
    // else if ([existedUser.email, existedUser.username].includes(username)) {
    //     throw new ApiError(400, `User with username already exists`);
    // }

    // option 2
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // checking for images
    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log(req.files);

    let cover = "";
    if (req.files && req.files.coverImage && req.files.coverImage.length > 0) {
        const coverImageLocalPath = req.files.coverImage[0].path;
        cover = await uploadCloudinary(coverImageLocalPath);
        if (!cover) {
            throw new ApiError(500, "Something went wrong while uploading cover image");
        }
    }
    console.log(req.files);

    // let coverImageLocalPath;
    // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path
    // }

    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    // console.log(coverImageLocalPath);

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    // uploading images in cloudinary
    const avatar = await uploadCloudinary(avatarLocalPath);
    // const coverImage = await uploadCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(500, "Something went wrong while uploading avatar");
    }

    // saving user to database
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: cover.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    // the select method is used to remove the password and refreshToken from the user object
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    // checking the user is created
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User created successfully")
    );
});

export { registerUser };