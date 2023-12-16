const mongoose = require('mongoose');

// Connection to the database
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB database'))
  .catch(err => console.log(err));

module.exports = mongoose;

