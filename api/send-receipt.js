// Vercel serverless function: /api/send-receipt
// Sends AISetupKit access instructions via AgentMail after successful purchase

const AM_KEY = 'am_us_pod_6f05b873d33c7df1510aa84725fa71c5ed0a9a1403294fa2502a7c0ec0974451';
const FROM_EMAIL = 'blackchicken121@agentmail.to';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { email, intentId } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    const html = `
<!DOCTYPE html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0b0b14;color:#e2e8f0;padding:2rem;max-width:560px;margin:0 auto">
<div style="text-align:center;margin-bottom:2rem">
<div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#6366f1,#06b6d4);display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:900;color:#fff;margin:0 auto 1rem">AI</div>
<h1 style="color:#fff;font-size:1.5rem">Welcome to AISetupKit! 🎉</h1>
<p style="color:#8892a4">Thanks for your purchase. Here's everything you need.</p>
</div>

<div style="background:#14142a;border-radius:12px;padding:1.5rem;margin-bottom:1.5rem;border:1px solid rgba(255,255,255,.06)">
<h2 style="color:#f0d47a;font-size:1.1rem;margin-top:0">📦 Your AISetupKit Dashboard</h2>
<p style="color:#a0abbb;font-size:.9rem">Access all your deliverables — templates, scripts, pricing guide, and tools:</p>
<p style="text-align:center;margin:1.5rem 0">
<a href="https://www.aisetupkit.com/members" style="display:inline-block;padding:.8rem 2rem;border-radius:10px;background:linear-gradient(135deg,#6366f1,#06b6d4);color:#fff;text-decoration:none;font-weight:700">Access Your Dashboard →</a>
</p>
</div>

<div style="background:#14142a;border-radius:12px;padding:1.5rem;margin-bottom:1.5rem;border:1px solid rgba(255,255,255,.06)">
<h2 style="color:#f0d47a;font-size:1.1rem;margin-top:0">📋 What You Get</h2>
<table style="width:100%;border-collapse:collapse;font-size:.85rem;color:#a0abbb">
<tr><td style="padding:.5rem 0;border-bottom:1px solid rgba(255,255,255,.05)">✅ 10 Service Menu Templates</td><td style="padding:.5rem 0;border-bottom:1px solid rgba(255,255,255,.05)"><a href="https://www.aisetupkit.com/deliverables/templates" style="color:#6366f1">Open</a></td></tr>
<tr><td style="padding:.5rem 0;border-bottom:1px solid rgba(255,255,255,.05)">✅ 6 Client Acquisition Scripts</td><td style="padding:.5rem 0;border-bottom:1px solid rgba(255,255,255,.05)"><a href="https://www.aisetupkit.com/deliverables/scripts" style="color:#6366f1">Open</a></td></tr>
<tr><td style="padding:.5rem 0;border-bottom:1px solid rgba(255,255,255,.05)">✅ Pricing Guide + Calculator</td><td style="padding:.5rem 0;border-bottom:1px solid rgba(255,255,255,.05)"><a href="https://www.aisetupkit.com/deliverables/pricing" style="color:#6366f1">Open</a></td></tr>
<tr><td style="padding:.5rem 0;border-bottom:1px solid rgba(255,255,255,.05)">✅ 12 AI Tools Stack</td><td style="padding:.5rem 0;border-bottom:1px solid rgba(255,255,255,.05)"><a href="https://www.aisetupkit.com/deliverables/tools" style="color:#6366f1">Open</a></td></tr>
<tr><td style="padding:.5rem 0;border-bottom:1px solid rgba(255,255,255,.05)">✅ Proposal Builder</td><td style="padding:.5rem 0;border-bottom:1px solid rgba(255,255,255,.05)"><a href="https://www.aisetupkit.com/bonuses/proposals" style="color:#6366f1">Open</a></td></tr>
<tr><td style="padding:.5rem 0">✅ Objection Handler</td><td style="padding:.5rem 0"><a href="https://www.aisetupkit.com/bonuses/objections" style="color:#6366f1">Open</a></td></tr>
</table>
</div>

<div style="background:#14142a;border-radius:12px;padding:1.5rem;margin-bottom:1.5rem;border:1px solid rgba(255,255,255,.06)">
<h2 style="color:#f0d47a;font-size:1.1rem;margin-top:0">🚀 Quick Start</h2>
<ol style="color:#a0abbb;font-size:.85rem;line-height:1.8">
<li>Watch the <a href="https://www.aisetupkit.com/vsl" style="color:#6366f1">VSL walkthrough</a> (1.5 min)</li>
<li>Browse your <a href="https://www.aisetupkit.com/deliverables/templates" style="color:#6366f1">service templates</a> and pick one</li>
<li>Use the <a href="https://www.aisetupkit.com/deliverables/pricing" style="color:#6366f1">pricing calculator</a> to set your rates</li>
<li>Start reaching out with the <a href="https://www.aisetupkit.com/deliverables/scripts" style="color:#6366f1">acquisition scripts</a></li>
</ol>
</div>

<div style="background:#14142a;border-radius:12px;padding:1.5rem;border:1px solid rgba(255,255,255,.06)">
<h2 style="color:#f0d47a;font-size:1.1rem;margin-top:0">❓ Need Help?</h2>
<p style="color:#a0abbb;font-size:.85rem">Reply to this email or reach out anytime. We're here to help you launch successfully.</p>
</div>

<p style="text-align:center;color:#4a5568;font-size:.75rem;margin-top:2rem">AISetupKit · Launch your AI agency in 7 days</p>
</body></html>`;

    // Send via AgentMail
    const payload = JSON.stringify({
      to: email,
      from: FROM_EMAIL,
      subject: '🎉 Welcome to AISetupKit — Your Access & Deliverables',
      html: html
    });

    const result = await new Promise((resolve, reject) => {
      const req = https.request('https://api.agentmail.to/v1/email/send', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + AM_KEY,
          'Content-Type': 'application/json'
        }
      }, (response) => {
        let d = '';
        response.on('data', c => d += c);
        response.on('end', () => resolve(d));
      });
      req.on('error', reject);
      req.write(payload);
      req.end();
    });

    return res.json({ sent: true });
  } catch (err) {
    // Don't expose internal errors to client, but log them
    console.error('Email send failed:', err);
    return res.status(500).json({ error: 'Failed to send receipt' });
  }
};
