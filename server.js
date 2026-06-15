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

let accountInfo = {
  balance: null,
  equity: null,
  profit: null,
  positions: []
};

app.post('/webhook', (req, res) => {
  const data = req.body;
  console.log('Signal received:', JSON.stringify(data));
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

app.post('/account', (req, res) => {
  const data = req.body;
  accountInfo = {
    balance: data.balance || null,
    equity: data.equity || null,
    profit: data.profit || null,
    positions: data.positions || []
  };
  res.json({ status: 'ok' });
});

app.get('/signal', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ ...latestSignal, account: accountInfo });
});

app.get('/test', (req, res) => {
  latestSignal = {
    pair: 'XAUUSD',
    phase: 'distribution',
    bias: 'bullish',
    price: 4326.33,
    session_high: 4369.26,
    session_low: 4300.90,
    entry: null,
    sl: null,
    tp: null,
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
    endpoints: { signal: '/signal', webhook: '/webhook', account: '/account', test: '/test' }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AMD Webhook Server running on port ${PORT}`);
});
