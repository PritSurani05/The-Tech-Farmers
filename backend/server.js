const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend static files
const staticDir = path.join(__dirname, '../frontend');
app.use(express.static(staticDir));

// API: mandi prices (reads backend JSON)
app.get('/api/mandi-prices', (req, res) => {
  const prices = require('./mandi-prices.json');
  res.json(prices);
});

// Fallback: serve index
app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SmartAgri v2 server running at http://localhost:${PORT}`));
