const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Product = require('../models/product');
const Category = require('../models/category');
const mongoose = require('mongoose');

const getCategoryById = async (req, res, next) => {
  const categoryId = req.params.cid;

  let category
  try {
    category = await Category.findById(categoryId)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a category',
      500
    );
    return next(error);
  }

  res.json({ category: category.toObject({ getters: true}) });
};

const getCategories = async (req, res, next) => {

  let categories;
  try {
    categories = await Category.find()
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a category',
      500
    );
    return next(error);
  }

  res.json({ categories: categories.map(category => category.toObject({getters: true})) });
};

const createCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, description } = req.body;

  const createdCategory = new Category({
    name,
    description,
  });

  try {
    await createdCategory.save();
  } catch (err) {
    const error = new HttpError(
      'Creating category failed',
      500
    )
    return next(error);
  }


  res.status(201).json({ category: createdCategory });
};

const updateCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { name, description } = req.body;
  const categoryId = req.params.cid;

  let category
  try {
    category = await Category.findById(categoryId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a category',
      500
    );
    return next(error);
  }

  category.name = name;
  category.description = description;

  try {
    await category.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update a category',
      500
    );
    return next(error);
  }

  res.status(200).json({ category: category.toObject({getters: true}) });
};

exports.getCategoryById = getCategoryById;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.getCategories = getCategories;
