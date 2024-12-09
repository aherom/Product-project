const Product = require('../models/Product');

const getStatistics = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required.' });
    }

    // Convert `month` and `year` to integers
    const monthIndex = parseInt(month, 10) - 1; // Convert 1-based month to 0-based
    const yearInt = parseInt(year, 10);

    // Fetch all products
    const products = await Product.find();
   // console.log('Products:', products);

    // Filter products by month and year
    const filteredProducts = products.filter(product => {
      const saleDate = new Date(product.dateOfSale); // Parse `dateOfSale`
      if (isNaN(saleDate)) {
        console.warn(`Invalid date for product: ${product}`);
        return false; // Skip invalid dates
      }

      // Ensure date is compared in UTC, as stored in database
      const saleMonth = saleDate.getUTCMonth();  // Get month in UTC
      const saleYear = saleDate.getUTCFullYear(); // Get year in UTC

      // Compare month and year in UTC
      return saleMonth === monthIndex && saleYear === yearInt;
    });

   // console.log('Filtered Products:', filteredProducts);

    // Calculate statistics
    const totalSaleAmount = filteredProducts
      .filter(product => product.sold)
      .reduce((sum, product) => sum + product.price, 0);

    const totalSoldItems = filteredProducts.filter(product => product.sold).length;
    const totalNotSoldItems = filteredProducts.filter(product => !product.sold).length;

    console.log('Statistics:', {
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    });

    // Send response
    res.json({
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.error('Error in getStatistics:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getStatistics,
};
