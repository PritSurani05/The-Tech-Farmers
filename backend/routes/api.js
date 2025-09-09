const express = require('express');
const router = express.Router();
const prices = require('../mandi-prices.json');

// Route to fetch mandi prices
router.get('/mandi-prices', (req, res) => {
  res.json(prices);
});

module.exports = router;
