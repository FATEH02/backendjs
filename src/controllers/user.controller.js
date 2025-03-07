import { asynchHandler } from "../utils/asychhandler.js";
import { ApiError } from "../utils/Apierror.js";
import { User } from "../models/user.model.js";
import { uploadOnCoudinary } from "../utils/coudnery.js";
import { ApiResponse } from "../utils/Apiresponse.js";

const registerUser = asynchHandler(async (req, res) => {
  //get user details from frontend
  //validation-not empty
  //check if user already exist:username or email
  //check for images check for avatar
  //if exist upload to cloudinary,avatar
  //create user object-crate entry in db
  //rewmove password and refresh tojen from response
  //check for user creatoin
  //return response

  const { fullname, email, username, password } = req.body;

  console.log("email:", email);
  if (
    [fullname, email, username, password].some((field) => field?.trim == "")
  ) {
    throw new ApiError(400, "all fiels are require");
  }

  if (fullname == "") {
    throw new ApiError(400, "fullname is required");
  }
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with this email already exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatarfile is required");
  }

  const avatar = await uploadOnCoudinary(avatarLocalPath);
  const coverImage = await uploadOnCoudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    converImage: coverImage?.url || " ",
    email,
    password,
    username: username.roLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "something went wrrong while registring user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registerd sucessfully "));
});

export { registerUser };
