require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const PORT = process.env.PORT || 3030;
const routes = require('./routes/index');
const mongoose = require('./config/db');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json()); 
app.use(express.static('public'));

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.listen(PORT, function() {
    console.log(`🌎 Server listening on http://localhost:${PORT}`);
});

// Routes
app.use('/', routes);