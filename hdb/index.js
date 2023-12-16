require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const routes = require('./routes/index');
const PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Handlebars settings.
const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'index',
    layoutsDir: 'views/layouts',
    partialsDir: 'views/partials',
});

// Handlebars helper
hbs.handlebars.registerHelper('isUnavailable', function(stock_status) {
    return stock_status !== 'Available' ? 'unavailable' : '';
  });

// Set Handlebars as the default template engine.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.listen(PORT, function() {
    console.log(`🌎 Server listening on http://localhost:${PORT}`);
});

// Routes
app.use('/', routes);