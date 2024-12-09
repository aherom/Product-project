const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    category: { type: String },
    image: { type: String },
    sold: { type: Boolean },
    dateOfSale: { type: Date }
});

module.exports = mongoose.model('Product', productSchema);
