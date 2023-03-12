const jwt = require('jsonwebtoken');
const { connectToDB, getCollection } = require("../utils/db");

const protect = async (req, res, next) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const dataCollection = getCollection();
        req.user = await dataCollection.findOne({email: decoded.email})
        next();
      } catch (error) {
        res.status(401).json({ message: "Not authorized, token failed" });

      }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
  }

  module.exports ={protect}