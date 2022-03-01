const router = require('express').Router();
const { models } = require('../model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require('sequelize/lib/errors');


//! SIGNUP
router.post('/signup', async (req, res) => {
  const { email, password, admin } = req.body;
  try {
    await models.UserModel.create({
      email: email,
      password: bcrypt.hashSync(password, 10),
      admin: admin
    })
    .then(
      user => {
        let token = jwt.sign({id: user.id}, process.env.JWT_SECRET_KEY, {expiresIn: 60*60*24});
        res.status(201).json({
          user: user,
          message: 'User has been created',
          sessionToken:  `${token}`
        });
      }
    )
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({
        message: 'Username already in use'
      });
    } else {
      res.status(500).json({
        error: `Failed to register user: ${err}`
      });
    };
  };
});



//! LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    await models.UserModel.findOne({
      where: {
        email: email
      }
    })
    .then(
      user => {
        if (user) {
          bcrypt.compare(password, user.password, (err, matches) => {
            if (matches) {
              let token = jwt.sign({id: user.id}, process.env.JWT_SECRET_KEY, {expiresIn: 60*60*24})
              res.json({
                user: user,
                message: 'You are logged in!',
                sessionToken: `${token}`
              })
            } else {
              res.status(502).send({
                error: 'bad gateway'
              })
            }
          })
        } else {
          res.status(500).send({
            error: 'Failed to authenticate'
          })
        }
      }
    )
  } catch (err) {
    res.status(501).send({
      error: `${err}`
    })
  }
})



//! GET USER INFO
router.get('/userinfo', async (req, res) => {

  try {
    await models.UserModel.findAll({
      include: [
        {
          model: models.RoomModel,
          include: [
            {
              model: models.ChoreModel
            }
          ]
        }
      ]
    })
      .then(
        users => {
          res.status(200).json({
            users: users
          });
        }
      )
  } catch (err) {
    res.status(500).json({
      error: `Failed to retrieve users: ${err}`
    });
  };
});



module.exports = router;