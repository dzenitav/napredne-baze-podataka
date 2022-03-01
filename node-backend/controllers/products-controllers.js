const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Product = require('../models/product');
const User = require('../models/user');
const Category = require('../models/category')
const mongoose = require('mongoose');

const getProductById = async (req, res, next) => {
  const productId = req.params.pid; // { pid: 'p1' }

  let product
  try {
    product = await Product.findById(productId).populate('category');
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

  const price = req.query && req.query.price;
  const user = req.query && req.query.user;
  const category = req.query && req.query.category;

  let products;
  let query = {}
  try {
    if(price) {
      query = {...query, price: { $lte: price }};
    } 
    if(category) {
      query = {...query, category: category};
    }

    if(user) {
      query = {...query, creator: user};
    }

    products = await Product.find(query).exec();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a product',
      500
    );
    return next(error);
  }

  res.json({ products: products.map(product => product.toObject({getters: true})) });
};

const createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, imageUrl, category, price } = req.body;

  const createdProduct = new Product({
    title,
    description,
    imageUrl,
    creator: req.userData.userId,
    category,
    price
  });

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError(
      'Creating product failed, please try again 1',
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

  let productCategory;
  try {
    productCategory = await Category.findById(category);
  } catch (err) {
    const error = new HttpError(
      'Creating product failed, please try again 2',
      500
    )
    return next(error);
  }

  if(!productCategory) {
    const error = new HttpError(
      'Could not find category for provided id',
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
    productCategory.products.push(createdProduct);
    await productCategory.save({ session: sess});
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

  const { title, description, imageUrl, category, price } = req.body;
  const productId = req.params.pid;

  let product
  try {
    product = await Product.findById(productId).populate('category');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a product',
      500
    );
    return next(error);
  }

  if(product.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      'You are not allowed to edit this product',
      403
    );
    return next(error);
  }

  let productCategory;
  try {
    productCategory = await Category.findById(category);
  } catch (err) {
    const error = new HttpError(
      'Creating product failed, please try again 2',
      500
    )
    return next(error);
  }

  if(!productCategory) {
    const error = new HttpError(
      'Could not find category for provided id',
      404
    )
    return next(error);
  }


  product.title = title;
  product.description = description;
  product.imageUrl = imageUrl;
  product.price = price;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    if(category !== product.category.id) {
      // remove product from its current category
      product.category.products.pull(product)
      await product.category.save({ session: sess});
      // add product into new category
      productCategory.products.push(product);
      await productCategory.save({ session: sess});
      product.category = productCategory;
    }

    await product.save({ session: sess});
    await sess.commitTransaction();
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
    product = await Product.findById(productId).populate('creator category');
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

  if(product.creator.id !== req.userData.userId){
    const error = new HttpError(
      'You are not allowed to delete this product',
      403
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await product.remove({ session: sess});
    product.creator.products.pull(product)
    await product.creator.save({ session: sess});
    if(product.category) {
      product.category.products.pull(product)
      await product.category.save({ session: sess});
    }
  
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete a product',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Product is deleted.' });
};

exports.getProductById = getProductById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.getProducts = getProducts;
