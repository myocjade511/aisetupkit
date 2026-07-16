// Vercel serverless function: /api/create-payment-intent
const https = require('https');

const SK = Buffer.from('c2tfdGVzdF81MVRYZktWTEp5MUoxd3ROcHN2a0dhUElQZ3lBZmlPV1Z0c3Y3VjFkNmhNR001OVNHWElsNHozekU4N0VHOTdGdzV2dnRyZXlUTGM2RVY4UWdremc0T0diMzAwMjFCYXo5d2g=', 'base64').toString();
const PRICE_ID = 'price_1TtzAzLJy1J1wtNpUFKuDszI';

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { paymentMethodId } = req.body || {};
  if (!paymentMethodId) {
    return res.status(400).json({ error: 'Payment method ID is required' });
  }

  try {
    const data = new URLSearchParams({
      amount: '9700',
      currency: 'usd',
      'payment_method_types[]': 'card',
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: 'true',
      description: 'AISetupKit Complete Kit - $97'
    }).toString();

    const result = await new Promise((resolve, reject) => {
      const req = https.request('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + SK,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }, (response) => {
        let d = '';
        response.on('data', c => d += c);
        response.on('end', () => {
          try { resolve(JSON.parse(d)); } catch(e) { reject(d); }
        });
      });
      req.on('error', reject);
      req.write(data);
      req.end();
    });

    if (result.error) {
      return res.status(400).json({ error: result.error.message });
    }

    return res.json({
      clientSecret: result.client_secret,
      paymentIntentId: result.id,
      status: result.status
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
