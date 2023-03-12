const bcrypt = require("bcryptjs");

const hashPasswordOrText = async (value) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(value, salt);
  } catch (error) {
    console.log(error);
  }
};


const comparePasswordOrText = async (value, hashedValue) => {
  try {
    return await bcrypt.compare(value, hashedValue);
  } catch (error) {
    console.log(error);
  }
}


module.exports = { hashPasswordOrText, comparePasswordOrText };
