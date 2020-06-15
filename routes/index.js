const express = require('express');
const router = express.Router();
const verifyToken = require('../services/middleware/verify-token');

router.get('/',verifyToken, (req, res, next) => {
    res.render('index.ejs');
  });
module.exports = router;
