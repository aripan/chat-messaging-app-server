const generateToken = require("../utils/generateToken");
const connectToDatabase = require("../utils/dbConnect");
const hashPassword = require("../utils/hashPassword");

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const dataCollection = await connectToDatabase(
    process.env.DB_NAME,
    process.env.USERS_COLLECTION_NAME
  );

  const user = await dataCollection?.findOne({ email });

  if (user ) {
    const tokenPayload = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(tokenPayload),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  public
const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword, securityQuestion, answer } =
    req.body;

  const dataCollection = await connectToDatabase(
    process.env.DB_NAME,
    process.env.USERS_COLLECTION_NAME
  );

  const userExists = await dataCollection?.findOne({ email: email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // hash the password and confirm password
  const bcryptPassword = await hashPassword(10, password);
  const bcryptConfirmPassword = await hashPassword(10, confirmPassword);

  const user = {
    name,
    email,
    bcryptPassword,
    bcryptConfirmPassword,
    securityQuestion,
    answer,
  };

  if (user) {
   await dataCollection?.insertOne(user);

    const tokenPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(tokenPayload),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};

module.exports = { authUser, registerUser };
