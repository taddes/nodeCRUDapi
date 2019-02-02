const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
  User.find({email: req.body.email})
  .exec()
  .then(user => {
    if (user) {
      return res.status(409).json({
        message: 'Email exists',
        user: user
      });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err
          });
        } else {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hash
          });
          user.save()
          .then(result => {
            console.log(result)
            res.status(201).json({
              message: 'user created'
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            })
          });
        }
      });
    }
  })
  .catch(err => {
    console.log(err)
  })

});

module.exports = router;