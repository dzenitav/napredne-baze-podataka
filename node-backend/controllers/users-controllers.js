const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user')

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password')
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a user',
      500
    );
    return next(error);
  }

  res.json({ users: users.map(user => user.toObject({getters: true})) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }
  const { name, email, password } = req.body;

  let existingUser
  try {
    existingUser = await User.findOne({email: email})
  } catch(err) {
    const error = new HttpError(
      'Signing up failed, please try again later',
      500
    );
    return next(error);
  }
  
  if(existingUser) {
    const error = new HttpError(
      'User already exists, please log in instead.',
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password,
    imageUrl: "https://media.glide.mailplus.co.uk/prod/images/670_670/gm-6cb8df9f-cb25-434f-9800-c75c9da302da-sarahvine08.jpg",
    products: [],
  })

  try {
    await createdUser.save()
  } catch (err) {
    const error = new HttpError(
      'Signup failed, please try again.',
      500
    )
    return next(error);
  }

  res.status(201).json({user: createdUser.toObject({getters: true})});
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser
  try {
    existingUser = await User.findOne({email: email})
  } catch(err) {
    const error = new HttpError(
      'Login failed, please try again later',
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      'Login failed, please try again later',
      500
    );
    return next(error);
  }
  res.json({message: 'Logged in!', user: existingUser.toObject({getters: true})});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
