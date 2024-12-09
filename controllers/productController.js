const axios = require('axios');
const Product = require('../models/Product');

// Initialize the database
const initializeDatabase = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = response.data;
        console.log(response.data);
        await Product.deleteMany(); // Clear existing data
        await Product.insertMany(data);

        res.status(201).json({ message: 'Database initialized with seed data.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get products by month
const getProductsByMonth = async (req, res) => {
    const { month } = req.params;

    if (!month) {
        return res.status(400).json({ error: 'Month parameter is required.' });
    }

    const monthIndex = new Date(`${month} 1, 2020`).getMonth(); // Get month index
    if (isNaN(monthIndex)) {
        return res.status(400).json({ error: 'Invalid month.' });
    }

    try {
        const products = await Product.find({
            dateOfSale: {
                $gte: new Date(2022, monthIndex, 1),
                $lt: new Date(2022, monthIndex + 1, 1),
            },
        });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { initializeDatabase, getProductsByMonth };
