const express = require('express');
const { initializeDatabase, getProductsByMonth } = require('../controllers/productController');

const router = express.Router();

// Route to initialize the database
router.get('/initialize', initializeDatabase);

// Route to get products by month
router.get('/products/:month', getProductsByMonth);


module.exports = router;
