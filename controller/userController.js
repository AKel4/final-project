const router = require("express").Router();
const { models } = require("../model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UniqueConstraintError } = require("sequelize/lib/errors");

//! SIGNUP
router.post("/signup", async (req, res) => {
  const { email, password, admin, houseCode } = req.body;

  if (admin == true) {
    let adminUser = await models.UserModel.findAll({
      where: { houseCode: houseCode, admin: true },
    });

    if (adminUser.length > 0) {
      res.status(406).json({
        message: "This house code is already in use.",
      });
      return;
    }
  }

  try {
    await models.UserModel.create({
      email: email,
      password: bcrypt.hashSync(password, 10),
      admin: admin,
      houseCode: houseCode,
    }).then((user) => {
      let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: 60 * 60 * 24,
      });
      res.status(201).json({
        user: user,
        message: "User has been created",
        sessionToken: `${token}`,
      });
    });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({
        message: "Username is already in use.",
      });
    } else {
      res.status(500).json({
        error: `Failed to register user: ${err}`,
      });
    }
  }
});

//! LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    await models.UserModel.findOne({
      where: {
        email: email,
      },
    }).then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, matches) => {
          if (matches) {
            let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
              expiresIn: 60 * 60 * 24,
            });
            res.json({
              user: user,
              message: "You are logged in!",
              sessionToken: `${token}`,
            });
          } else {
            res.status(401).send({
              message: "Email or password does not match",
            });
          }
        });
      } else {
        res.status(500).send({
          error: "Failed to authenticate",
        });
      }
    });
  } catch (err) {
    res.status(501).send({
      message: `Failed to log in: ${err}`,
    });
  }
});

//! GET USER INFO
router.get("/userinfo", async (req, res) => {
  try {
    await models.UserModel.findAll({
      include: [
        {
          model: models.RoomModel,
          include: [
            {
              model: models.ChoreModel,
            },
          ],
        },
      ],
    }).then((users) => {
      res.status(200).json({
        users: users,
      });
    });
  } catch (err) {
    res.status(500).json({
      error: `Failed to retrieve users: ${err}`,
    });
  }
});

module.exports = router;
