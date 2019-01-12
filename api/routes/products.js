const express = require('express');
const router = express.Router();

// Router to register different routes via Express
router.get('/', (req, res, next) => {
    res.status(200).json({
      message: 'Handling GET requests to /products'
    });
});
router.post('/', (req, res, next) => {
    res.status(201).json({
      message: 'Handling POST requests to /products'
    });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
    if (id === 'special') {
     res.status(200).json({
        message: 'You discovered the special ID',
        id: id
     });
   } else {
     res.status(200).json({
       message: `You passed an Id as ${id}`,
       id: id
     });
   }
});

router.patch('/:productId', (req, res, next) => {
  const id = req.params.productId;
  res.status(200).json({
    message: `updated product with id of: ${id}`
  });
});

router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId;
  res.status(200).json({
    message: `Deleted product.`
  });
});

module.exports = router;