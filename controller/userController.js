const generateToken = require("../utils/generateToken");
const {
  hashPasswordOrText,
  comparePasswordOrText,
} = require("../utils/dataBcryption");
const { connectToDB, getCollection } = require("../utils/db");

// connect to the database
connectToDB().catch((err) => console.log(err));

// @desc    Register a new user
// @route   POST /api/users/register
// @access  public
const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword, selectedQuestion, answer } =
    req.body;

  const dataCollection = getCollection();

  const userExists = await dataCollection?.findOne({ email: email });

  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ message: "Passwords do not match" });
    return;
  }

  // hash password and confirm password
  const bcryptPassword = await hashPasswordOrText(password);
  const bcryptConfirmPassword = await hashPasswordOrText(confirmPassword);

  // hash selectedQuestion and answer
  const hashedQuestion = await hashPasswordOrText(selectedQuestion);
  const hashedAnswer = await hashPasswordOrText(answer);

  const user = {
    name,
    email,
    bcryptPassword,
    bcryptConfirmPassword,
    selectedQuestion: hashedQuestion,
    answer: hashedAnswer,
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
    res.status(400).json({ message: "Invalid user data" });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const dataCollection = getCollection();

  const user = await dataCollection?.findOne({ email });

  if (!user) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  const isMatch = await comparePasswordOrText(
    password,
    user.bcryptConfirmPassword
  );
  if (user && isMatch) {
    const tokenPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(tokenPayload),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

// @desc    Confirm user's identity
// @route   POST /api/users/forgotPassword
// @access  public
const confirmUser = async (req, res) => {
  const { email, selectedQuestion, answer } = req.body;

  if (!email || !selectedQuestion || !answer) {
    res.status(400).json({ message: "Please provide all fields" });
    return;
  }

  const dataCollection = getCollection();

  const user = await dataCollection?.findOne({ email });

  if (!user) {
    res.status(401).json({ message: "Invalid user" });
    return;
  }

  const isSelectedQuestionMatched = await comparePasswordOrText(
    selectedQuestion,
    user.selectedQuestion
  );
  const isAnswerMatched = await comparePasswordOrText(
    answer,
    user.answer
  );
  if (user && isSelectedQuestionMatched && isAnswerMatched) {
    res.status(200).json({
      message: "User has been confirmed",
    });
  } else {
    res.status(401).json({ message: "Invalid user" });
  }
};

// @desc    Reset user's password
// @route   PUT /api/users/resetPassword
// @access  public
const resetPassword = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    res.status(400).json({ message: "Please provide all fields" });
    return;
  }

  const dataCollection = getCollection();

  const user = await dataCollection?.findOne({ email });

  if (!user) {
    res.status(401).json({ message: "Invalid user" });
    return;
  }

  // hash password and confirm password
  const bcryptPassword = await hashPasswordOrText(password);
  const bcryptConfirmPassword = await hashPasswordOrText(confirmPassword);

  // update user password and confirm password
  //@ example: query = { 'username': 'john.doe' }
  //@example: new_values = { '$set': { 'password': 'newPassword', 'confirmPassword': 'newConfirmPassword' } }
  //@example: result = collection.update_one(query, new_values)
  query = { email };
  new_values = { $set: { bcryptPassword, bcryptConfirmPassword } };
  result = await dataCollection.updateOne(query, new_values);

  if (result.modifiedCount == 1) {
    res.status(200).json({
     message: "User password and confirm password updated successfully."
    });
  } else {
    res.status(401).json({ message: "Invalid user" });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
  const dataCollection = getCollection();
  const users = await dataCollection.find({}, { projection: { bcryptPassword: 0, bcryptConfirmPassword: 0 } }).toArray();


  console.log("🚀 ~ file: userController.js:189 ~ getUsers ~ users:", users)

  res.json(users);
}

module.exports = { authUser, registerUser, confirmUser, resetPassword, getUsers  };
