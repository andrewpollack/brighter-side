const express = require('express');
const app = express();
const mongoose = require('mongoose'); // Helps connection to MongoDB
const logger = require('./utils/logging');

// Environmental variable configurations
require('dotenv').config();
const PORT = process.env.PORT || 5000; // PORT if specified, else 5000
const URI = process.env.ATLAS_URI;


// MongoDB Atlas Connection
mongoose.connect(URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  logger.timestampedLog('MongoDB Atlas connection successful.')
})

app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.listen(PORT, function () {
  logger.timestampedLog(`Server running on Port ${PORT}!`);
});