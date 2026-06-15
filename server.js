const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let latestSignal = {
  pair: 'XAUUSD',
  phase: 'waiting',
  bias: 'neutral',
  price: null,
  session_high: null,
  session_low: null,
  entry: null,
  sl: null,
  tp: null,
  message: 'Waiting for signal...',
  timestamp: new Date().toISOString()
};

app.post('/webhook', (req, res) => {
  const data = req.body;
  console.log('Alert received:', JSON.stringify(data));
  latestSignal = {
    pair: data.pair || 'XAUUSD',
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

app.get('/signal', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.json(latestSignal);
});

app.get('/test', (req, res) => {
  latestSignal = {
    pair: 'XAUUSD',
    phase: 'distribution',
    bias: 'bullish',
    price: 4344.50,
    session_high: 4380.00,
    session_low: 4310.00,
    entry: '4344.80',
    sl: '4309.50',
    tp: '4380.00',
    message: 'Test — AMD distribution detected on Gold!',
    timestamp: new Date().toISOString()
  };
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ status: 'test signal fired!', signal: latestSignal });
});

app.get('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({
    status: 'AMD Webhook Server running',
    uptime: process.uptime(),
    endpoints: { signal: '/signal', webhook: '/webhook', test: '/test' }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AMD Webhook Server running on port ${PORT}`);
});
