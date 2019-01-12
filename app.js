const express = require('express');
const app = express();

// sets up middleware
app.use((req, res, next) => {
  res.status(200).json({
    message: 'Dammit Jim, I\'m a Doctor, not an engineer!'
  });
});

module.exports = app;