/**
 * /api/chat — Vercel serverless proxy for Anthropic API
 *
 * Keeps ANTHROPIC_API_KEY server-side only.
 * Called by FrenchWorkspace.jsx as POST /api/chat
 *
 * Body: { system: string, messages: [{role, content}] }
 * Returns: { text: string } or { error: string }
 */

export const config = { runtime: 'edge' }   // Edge runtime = fastest cold start on Vercel

export default async function handler(req) {
  // ── CORS preflight ───────────────────────────────────────────
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin':  '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured on server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { system, messages } = body
  if (!messages || !Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: 'messages array required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // ── Forward to Anthropic ─────────────────────────────────────
  try {
    const anthropicResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-6',
        max_tokens: 800,
        system:     system || '',
        messages,
      }),
    })

    if (!anthropicResp.ok) {
      const errText = await anthropicResp.text()
      return new Response(JSON.stringify({ error: `Anthropic error: ${anthropicResp.status} — ${errText}` }), {
        status: anthropicResp.status,
        headers: {
          'Content-Type':                'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    const data = await anthropicResp.json()
    const text = data.content?.[0]?.text || ''

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: {
        'Content-Type':                'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: `Proxy error: ${err.message}` }), {
      status: 500,
      headers: {
        'Content-Type':                'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }
}
