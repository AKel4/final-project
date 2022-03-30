const jwt = require("jsonwebtoken");
const { models } = require("../model");

const validateSession = async (req, res, next) => {
  try {
    if (req.method === "OPTIONS") {
      return next();
    } else if (req.headers.authorization) {
      const { authorization } = req.headers;
      const payload = authorization
        ? jwt.verify(authorization, process.env.JWT_SECRET_KEY)
        : undefined;

      if (payload) {
        let foundUser = await models.UserModel.findOne({
          where: { id: payload.id },
        });

        if (foundUser) {
          req.user = foundUser;
          next();
        } else {
          res.status(400).json({
            message: "User not found",
          });
        }
      } else {
        res.status(401).json({
          message: "Invalid Token",
        });
      }
    } else {
      res.status(403).json({
        message: "Forbidden to enter",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "It's a 500 error",
    });
  }
};

module.exports = validateSession;
