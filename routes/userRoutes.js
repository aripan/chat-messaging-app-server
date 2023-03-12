const express = require("express");
const router = express.Router();
const {registerUser, authUser, confirmUser, resetPassword, getUsers} = require("../controller/userController");
const { protect } = require("../middleware/authMiddleware");

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/forgotPassword', confirmUser);
router.put('/resetPassword', resetPassword);
router.get('/', protect, getUsers)

module.exports = router;