const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const e = require('express');

const router = express.Router();

const validateSignup = [
  check('firstName')
    .exists({ checkFalsy: true }),
  check('lastName')
    .exists({ checkFalsy: true }),
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];


// ================================= Sign up =================================
router.post(
  '/',
  validateSignup,
  async (req, res, next) => {
    const { firstName, lastName, email, password, username } = req.body;

    const userEmails = await User.findAll({
      attributes: ["email"]
    })
    let emailObjList = []
    userEmails.forEach(userEmail => {emailObjList.push(userEmail.toJSON()) })
    let emailList = []
    emailObjList.forEach(userEmail => {
      emailList.push(Object.values(userEmail))
    })

    // EMAIL ERROR HANDLER
    for (let userEmail of emailList) {
      for (let currentEmail of userEmail) {
        if (currentEmail === email) {
          const err = new Error('User already exists')
          err.errors = ["User with that email already exists"]
          err.status = 403
          return next(err)
        }
      }
    }

    const userUsernames = await User.findAll({
      attributes: ["username"]
    })
    let usernamesObjList = []
    userUsernames.forEach(userUsername => {usernamesObjList.push(userUsername.toJSON()) })
    let usernameList = []
    usernamesObjList.forEach(userUsername => {usernameList.push(Object.values(userUsername))})

    // USERNAME ERROR HANDLER
    for (let userUsername of usernameList) {
      for (let currentUsername of userUsername) {
        if (currentUsername === username) {
          const err = new Error("User already exists")
          err.status = 403
          err.errors = ["User with that username already exists"]
          return next(err)
        }
      }
    }

    const user = await User.signup({ firstName, lastName, email, username, password });

    const token = await setTokenCookie(res, user);
    user.dataValues.token = token
    return res.json({
      user: user
    });
  }
);


module.exports = router;
