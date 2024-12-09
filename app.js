const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const transactionsRoutes = require('./routes/transactionsRoutes');
const transactions = require('./routes/transactions');
const app = express();
const PORT = 3000;

// Connect to the database
connectDB();

app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());

// Routes
app.use('/api', productRoutes);
app.use('/api', statisticsRoutes);
app.use('/api', transactions);
app.use('/api', transactionsRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
