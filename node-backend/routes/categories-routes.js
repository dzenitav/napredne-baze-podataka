const express = require('express');
const { check } = require('express-validator');

const categoriesControllers = require('../controllers/categories-controllers');

const router = express.Router();

router.get('/', categoriesControllers.getCategories);
router.get('/:cid', categoriesControllers.getCategoryById);

router.post(
  '/',
  [
    check('name')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 }),
  ],
  categoriesControllers.createCategory
);

router.patch(
  '/:cid',
  [
    check('name')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  categoriesControllers.updateCategory
);

module.exports = router;
