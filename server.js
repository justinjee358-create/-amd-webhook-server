const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  console.log('Alert received:', JSON.stringify(data));
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

// Dashboard polls this
app.get('/signal', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(latestSignal);
});

// Test endpoint — manually trigger a signal
app.get('/test', (req, res) => {
  latestSignal = {
    pair: 'EURUSD',
    phase: 'manipulation',
    bias: 'bullish',
    price: 1.0842,
    session_high: 1.0861,
    session_low: 1.0819,
    entry: '1.0821-1.0828',
    sl: '1.0812',
    tp: '1.0861',
    message: 'Test signal — AMD manipulation detected!',
    timestamp: new Date().toISOString()
  };
  res.json({ status: 'test signal fired!', signal: latestSignal });
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'AMD Webhook Server running', uptime: process.uptime(), signal_endpoint: '/signal', webhook_endpoint: '/webhook', test_endpoint: '/test' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AMD Webhook Server running on port ${PORT}`);
});
