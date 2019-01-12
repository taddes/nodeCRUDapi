const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Order found'
  });
});

router.post('/', (req, res, next) => {
  res.status(201).json({
    message: 'Order created'
  });
});

router.post('/:orderId', (req, res, next) => {
  res.status(201).json({
    message: `Order ${req.params.orderId} created`,
    orderId: req.params.orderId
  });
});

router.delete('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: 'order deleted',
    orderId: req.params.orderId
  });
});

module.exports = router;