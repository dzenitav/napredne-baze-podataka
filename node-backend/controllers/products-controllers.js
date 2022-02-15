const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Product = require('../models/product');
const User = require('../models/user');
const mongoose = require('mongoose');

const getProductById = async (req, res, next) => {
  const productId = req.params.pid; // { pid: 'p1' }

  let product
  try {
    product = await Product.findById(productId)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a product',
      500
    );
    return next(error);
  }

  res.json({ product: product.toObject({ getters: true}) });
};

const getProducts = async (req, res, next) => {

  let products;
  try {
    products = await Product.find()
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a product',
      500
    );
    return next(error);
  }

  res.json({ products: products.map(product => product.toObject()) });
};

const getProductsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let products;
  try {
    products = await Product.find( {creator: userId})
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a product',
      500
    );
    return next(error);
  }

  res.json({ products: products.map(product => product.toObject()) });
};

const createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, imageUrl, creator } = req.body;

  const createdProduct = new Product({
    title,
    description,
    imageUrl: 'https://media.glide.mailplus.co.uk/prod/images/950_633/gm-fc6a87db-c3fd-4151-8a4c-d44c8ccdfed2-webl4237676.jpg',
    creator
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      'Creating product failed, please try again',
      500
    )
    return next(error);
  }

  if(!user) {
    const error = new HttpError(
      'Could not find user for provided id',
      404
    )
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdProduct.save({ session: sess});
    user.products.push(createdProduct);
    await user.save({ session: sess});
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Creating product failed',
      500
    )
    return next(error);
  }


  res.status(201).json({ product: createdProduct });
};

const updateProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title, description, imageUrl } = req.body;
  const productId = req.params.pid;

  let product
  try {
    product = await Product.findById(productId)
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a product',
      500
    );
    return next(error);
  }

  product.title = title;
  product.description = description;
  product.imageUrl = imageUrl;

  try {
    await product.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update a product',
      500
    );
    return next(error);
  }

  res.status(200).json({ product: product.toObject({getters: true}) });
};

const deleteProduct = async (req, res, next) => {

  const productId = req.params.pid;

  let product
  try {
    product = await Product.findById(productId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a product',
      500
    );
    return next(error);
  }

  if(!product) {
    const error = new HttpError(
      'Could not find the product with this id',
      404
    );
    return next(error);
  }

  try {
    
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await product.remove({ session: sess});
    product.creator.products.pull(product)
    await product.creator.save({ session: sess});
    await sess.commitTransaction();
    
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update a product',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Product is deleted.' });
};

exports.getProductById = getProductById;
exports.getProductsByUserId = getProductsByUserId;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.getProducts = getProducts;
