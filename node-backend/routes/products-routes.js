const express = require('express');
const { check } = require('express-validator');
const checkAuth = require('../middleware/check-auth')

const productControllers = require('../controllers/products-controllers');

const router = express.Router();

router.get('/', productControllers.getProducts);
router.get('/:pid', productControllers.getProductById);

router.use(checkAuth);

router.post(
  '/',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 }),
  ],
  productControllers.createProduct
);

router.patch(
  '/:pid',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  productControllers.updateProduct
);

router.delete('/:pid', productControllers.deleteProduct);

module.exports = router;
