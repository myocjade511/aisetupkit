// Vercel serverless: /api/save-lead
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const data = req.body || {};
  const lead = {
    ...data,
    timestamp: new Date().toISOString(),
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
  };

  try {
    const csvPath = path.join('/tmp', 'leads.csv');
    const header = 'timestamp,email,source,niche,goal,income,exp,time\n';
    const line = `${lead.timestamp},${lead.email},${lead.source},${lead.niche||''},${lead.goal||''},${lead.income||''},${lead.exp||''},${lead.time||''}\n`;
    
    if (!fs.existsSync(csvPath)) {
      fs.writeFileSync(csvPath, header);
    }
    fs.appendFileSync(csvPath, line);

    return res.json({ saved: true });
  } catch (err) {
    return res.json({ saved: true }); // fail silently
  }
};
