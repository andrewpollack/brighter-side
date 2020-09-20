const express = require('express');
const app = express();
const mongoose = require('mongoose'); // Helps connection to MongoDB
const logger = require('./utils/logging');

// Environmental variable configurations
require('dotenv').config();
const PORT = process.env.PORT || 5000; // PORT if specified, else 5000
const URI = process.env.ATLAS_URI;

// Middleware
app.use(express.json()); // Parse JSON


// MongoDB Atlas Connection
mongoose.connect(URI, {useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true},
);
const connection = mongoose.connection;
connection.once('open', () => {
  logger.timestampedLog('MongoDB Atlas connection successful');
});

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

// BEGIN: Express/NodeJS Server Listening
app.listen(PORT, () => {
  logger.timestampedLog(`Express server running on port: ${PORT}.`);
});
