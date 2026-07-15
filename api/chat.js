/**
 * /api/chat — Vercel serverless proxy
 *
 * Uses Groq's free API (OpenAI-compatible) with Llama 3.1 70B.
 * Keeps GROQ_API_KEY server-side only.
 *
 * Get free key at: console.groq.com (no credit card needed)
 *
 * Body:    { system: string, messages: [{role, content}] }
 * Returns: { text: string } or { error: string }
 */

export const config = { runtime: 'edge' }

export default async function handler(req) {
  // ── CORS preflight ────────────────────────────────────────
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
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

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'GROQ_API_KEY not configured — add it in Vercel environment variables' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
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

  // Groq uses OpenAI-compatible format — system goes as first message
  const groqMessages = [
    { role: 'system', content: system || '' },
    ...messages,
  ]

  try {
    const groqResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',  // Best free model on Groq for French coaching
        max_tokens: 800,
        temperature: 0.7,
        messages: groqMessages,
      }),
    })

    if (!groqResp.ok) {
      const errText = await groqResp.text()
      return new Response(
        JSON.stringify({ error: `Groq error ${groqResp.status}: ${errText}` }),
        {
          status: groqResp.status,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        }
      )
    }

    const data = await groqResp.json()
    const text = data.choices?.[0]?.message?.content || 'No response from model'

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Proxy error: ${err.message}` }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      }
    )
  }
}