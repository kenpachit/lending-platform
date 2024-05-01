require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json()); 
app.use(cors()); 
app.use(morgan('common')); 

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection successful'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.get('/api/sample', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).send('Something broke!'); 
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));