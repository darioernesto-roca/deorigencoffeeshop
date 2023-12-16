const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    image: String,
    stock_status: String
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;