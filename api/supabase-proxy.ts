import type { VercelRequest, VercelResponse } from '@vercel/node';
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://rikqnipayooaiupfxvmn.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_cD_PqEP304K6eX0fMLlx9g_rvjMXPGv';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', message: 'Supabase proxy is running' });
  }
  try {
    const bodyData = req.body;
    if (!bodyData || typeof bodyData !== 'object') {
      return res.status(400).json({ error: 'Invalid request body' });
    }
    const { table, method, body, query } = bodyData as {
      table: string;
      method: string;
      body?: Record<string, unknown>;
      query?: Record<string, string>;
    };
    if (!table) {
      return res.status(400).json({ error: 'Table name is required' });
    }
    let url = `${SUPABASE_URL}/rest/v1/${table}`;
    if (query && Object.keys(query).length > 0) {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([key, value]) => {
        params.append(key, String(value));
      });
      url += `?${params.toString()}`;
    } else {
      url += '?select=*';
    }
    const headers: Record<string, string> = {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    const fetchMethod = method || 'GET';
    const fetchOptions: RequestInit = {
      method: fetchMethod,
      headers,
    };
    if (body && (fetchMethod === 'POST' || fetchMethod === 'PUT' || fetchMethod === 'PATCH')) {
      fetchOptions.body = JSON.stringify(body);
    }
    const response = await fetch(url, fetchOptions);
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}
