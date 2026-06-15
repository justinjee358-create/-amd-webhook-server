const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Store the latest signal in memory
let latestSignal = {
  pair: 'EURUSD',
  phase: 'waiting',
  bias: 'neutral',
  price: null,
  session_high: null,
  session_low: null,
  entry: null,
  sl: null,
  tp: null,
  message: 'Waiting for TradingView alert...',
  timestamp: new Date().toISOString()
};

// TradingView sends alerts here
app.post('/webhook', (req, res) => {
  const data = req.body;
  console.log('Alert received:', data);

  // Update the latest signal
  latestSignal = {
    pair: data.pair || 'EURUSD',
    phase: data.phase || 'unknown',
    bias: data.bias || 'neutral',
    price: data.price || null,
    session_high: data.session_high || null,
    session_low: data.session_low || null,
    entry: data.entry || null,
    sl: data.sl || null,
    tp: data.tp || null,
    message: data.message || 'Alert received',
    timestamp: new Date().toISOString()
  };

  res.json({ status: 'ok', received: latestSignal });
});

// Dashboard polls this to get latest signal
app.get('/signal', (req, res) => {
  res.json(latestSignal);
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'AMD Webhook Server running', uptime: process.uptime() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AMD Webhook Server running on port ${PORT}`);
});
