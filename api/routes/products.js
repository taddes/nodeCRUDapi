const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
});

const Product = require('../models/product');

// Router to register different routes via Express
router.get('/', (req, res, next) => {
  Product.find()
  .select( 'name price _id')
  .exec()
  .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' 
            }
          }
        })
      };
      res.status(200).json(response)
    // } else {
    //   res.status(404).json({
    //     message: 'No entries found'
    //   });
    // }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

router.post('/', upload.single('productImage'), (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });
  product.save().then(result => {
    console.log(result);
    res.status(201).json({
      message: 'Created Product successfully',
      createdProduct: {
        name: result.name,
        price: result.price,
        _id: result._id,
        request: {
          type: 'POST',
          url: 'http://localhost:3000/products/' + result._id
        }
      }
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    })
  });

});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
  .select('name price _id')
  .exec()
  .then(doc => {
    console.log('From database: ' + doc);
    if (doc) {
      res.status(200).json({
        product: doc,
        request: {
          type: 'GET',
          url: 'http://localhost/products/' + doc._id
        }
      });
    } else {
      res.status(404).json({message:  `No valid entry found for provided ID`})
    }
    
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err})
  })
});

router.patch('/:productId', (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update( {_id: id}, { $set: updateOps })
  .exec()
  .then(result => {
    console.log(result);
    res.status(200).json({
      message: 'Product updated',
      request: {
        type: 'PATCH',
        url: 'http://localhost:3000/products/' + id
      }
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    })
  })
});


router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
  .exec()
  .then(result => {
    res.status(200).json({
      message: 'Product deleted',
      request: {
        type: 'POST',
        url: 'http://localhost:3000/products',
        body: { name: 'String', price: 'Number'}
      }
    })
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

module.exports = router;