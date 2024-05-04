require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const requestLogger = require('morgan');

const app = express();

const SERVER_PORT = process.env.PORT || 3000;
const DATABASE_CONNECTION_URI = process.env.MONGODB_URI;

app.use(express.json());
app.use(cors());
app.use(requestLogger('common'));

mongoose
  .connect(DATABASE_CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection established'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

app.get('/api/sample', (req, res) => {
  res.json({ message: 'API is operational!' });
});

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send('Internal Server Error occurred!');
});

app.listen(SERVER_PORT, () => console.log(`Server is up and listening on port ${SERVER_PORT}`));