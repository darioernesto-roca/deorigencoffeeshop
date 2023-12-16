const express = require('express');
const router = express.Router();

const Product = require("../models/Products");
const Category = require("../models/Categories");



// Insert data
router.post('/', async (req, res) => {
    try {
        const { productData, categoryData } = req.body;

        if (productData && productData.length > 0) {
            await Product.insertMany(productData);
        }

        if (categoryData && categoryData.length > 0) {
            await Category.insertMany(categoryData);
        }

        res.send('Data inserted successfully!');
    } catch (err) {
        res.status(500).send('Server error: ' + err.message);
    }
});

// Get data
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        const categories = await Category.find();

        res.json({ products, categories });
    } catch (err) {
        res.status(500).send('Server error: ' + err.message);
    }
});

// Delete data
router.delete('/', async (req, res) => {
    try {
        await Product.deleteMany();
        await Category.deleteMany();

        res.send('Data deleted successfully!');
    } catch (err) {
        res.status(500).send('Server error: ' + err.message);
    }
});

// Update data
router.put('/', async (req, res) => {
    try {
        const { productData, categoryData } = req.body;

        if (productData && productData.length > 0) {
            for (let i = 0; i < productData.length; i++) {
                const { _id, ...rest } = productData[i];
                await Product.findByIdAndUpdate(_id, rest);
            }
        }

        if (categoryData && categoryData.length > 0) {
            for (let i = 0; i < categoryData.length; i++) {
                const { _id, ...rest } = categoryData[i];
                await Category.findByIdAndUpdate(_id, rest);
            }
        }

        res.send('Data updated successfully!');
    } catch (err) {
        res.status(500).send('Server error: ' + err.message);
    }
});




module.exports = router;