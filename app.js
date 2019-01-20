const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect(`mongodb://taddes:${process.env.MONGO_ATLAS_PW}@node-store-shard-00-00-m7osp.mongodb.net:27017,node-store-shard-00-01-m7osp.mongodb.net:27017,node-store-shard-00-02-m7osp.mongodb.net:27017/test?ssl=true&replicaSet=Node-Store-shard-0&authSource=admin&retryWrites=true`,
{ useNewUrlParser: true }
);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

app.use((res, req, next) => {
  res.header('Access=Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    // Browser always sends an options request first when sending a POST or PUT REQ
    // Unavoidable. Browser checks if you can 
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({})
    }
    next();
});

// sets up middleware where all requests filtered thru
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
  const error = new Error(`Not Found`);
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;