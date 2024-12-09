const express = require('express');
const router = express.Router();
const { getBarChartData } = require('../controllers/transactionsController');

// Route to fetch bar chart data
router.get('/barChart', getBarChartData);

module.exports = router;
