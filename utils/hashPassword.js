const bcrypt = require("bcryptjs");

const hashPassword = async (saltRounds, password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

module.exports = hashPassword;
