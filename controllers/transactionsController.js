const Transaction = require('../models/Product');

const getTransactions = async (req, res) => {
    try {
      const { page = 1, perPage = 10, search = '', monthYear = '' } = req.query;
  
      let query = {};
  
      if (search) {
        const isNumber = !isNaN(search); // Check if the search is a number
        if (isNumber) {
          query.price = parseFloat(search); // Match exact price
        } else {
          query.$or = [
            { title: { $regex: search, $options: 'i' } }, // Partial match, case-insensitive
            { description: { $regex: search, $options: 'i' } },
          ];
        }
      }
  
      if (monthYear) {
        const [year, month] = monthYear.split('-'); // Extract year and month
        query.dateOfSale = {
          $gte: new Date(`${year}-${month}-01`),
          $lt: new Date(`${year}-${month}-01T23:59:59.999Z`).setMonth(parseInt(month, 10)),
        };
      }
  
      const skip = (page - 1) * perPage; // Pagination logic
      const transactions = await Transaction.find(query).skip(skip).limit(parseInt(perPage));
      const total = await Transaction.countDocuments(query);
  
      res.json({ transactions, total });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };
  
 
  


//Graph

const getBarChartData = async (req, res) => {
    const { monthYear } = req.query;

    if (!monthYear) {
        return res.status(400).json({ error: 'Month and year are required.' });
    }

    const [year, month] = monthYear.split('-'); // Extract year and month

    try {
        // Fetch transactions for the given month and year
        const transactions = await getTransactionsForMonthYear(year, month);
       // console.log(transactions)
        const priceRanges = ['0-100', '101-200', '201-300', '301-400', '401-500', '501-600', '601-700', '701-800', '801-900', '901-above'];
        const counts = Array(priceRanges.length).fill(0);

        transactions.forEach((transaction) => {
            const price = transaction.price;
            if (price <= 100) counts[0]++;
            else if (price <= 200) counts[1]++;
            else if (price <= 300) counts[2]++;
            else if (price <= 400) counts[3]++;
            else if (price <= 500) counts[4]++;
            else if (price <= 600) counts[5]++;
            else if (price <= 700) counts[6]++;
            else if (price <= 800) counts[7]++;
            else if (price <= 900) counts[8]++;
            else counts[9]++;
        });
       //console.log(priceRanges, counts)
        res.json({ priceRanges, counts });
    } catch (error) {
        console.error('Error fetching bar chart data:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Helper function to fetch transactions for a specific month and year
const getTransactionsForMonthYear = async (year, month) => {
    const startOfMonth = new Date(year, month - 1, 1); // Start of the month
    const endOfMonth = new Date(year, month, 0); // End of the month

    // Query to fetch transactions within the month
    return await Transaction.find({
        dateOfSale: {
            $gte: startOfMonth,
            $lt: endOfMonth,
        },
    });
};
module.exports = { getTransactions,getBarChartData };
