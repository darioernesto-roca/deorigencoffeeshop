const express = require('express');
const router = express.Router();
const db = require('../db');

// Create
router.post('/add', (req, res) => {
  let sql = 'INSERT INTO products SET ?';
  let query = db.query(sql, req.body, (err, product) => {
    if(err) throw err;
    res.send('Product added...');
  });
});

// Read
router.get('/get', (req, res) => {
  let sql = 'SELECT * FROM products';
  let query = db.query(sql, (err, products) => {
    if(err) throw err;
    res.send(products);
  });
});

// Update
router.put('/update/:id', (req, res) => {
  let sql = `UPDATE products SET ? WHERE id = ${req.params.id}`;
  let query = db.query(sql, req.body, (err, product) => {
    if(err) throw err;
    res.send('Product updated...');
  });
});

// Delete
router.delete('/delete/:id', (req, res) => {
  let sql = `DELETE FROM products WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, product) => {
    if(err) throw err;
    res.send('Product deleted...');
  });
});

module.exports = router;