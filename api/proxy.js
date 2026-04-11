export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { p, ...rest } = req.query;
  const qs = new URLSearchParams(rest).toString();
  const url = `https://inblog.ai/api/v1/${p || ''}${qs ? '?' + qs : ''}`;

  try {
    const body = ['POST','PATCH','PUT'].includes(req.method)
      ? JSON.stringify(req.body) : undefined;
    const r = await fetch(url, {
      method: req.method,
      headers: {
        'Authorization': req.headers['authorization'] || '',
        'Content-Type': 'application/json',
      },
      body,
    });
    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    res.status(r.status).json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
