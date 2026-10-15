import 'dotenv/config';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { AntrykClient } from '@antryk/sdk';
import { normalizeSriLankanMobile, validateMessage, validateSenderId } from './validation.js';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const PORT = Number(process.env.PORT || 3000);
const MAX_BODY_BYTES = 32 * 1024;

const client = process.env.ANTRYK_ACCESS_KEY && process.env.ANTRYK_SECRET_KEY
  ? new AntrykClient({
      accessKey: process.env.ANTRYK_ACCESS_KEY,
      secretKey: process.env.ANTRYK_SECRET_KEY,
      timeout: 15000
    })
  : null;

function json(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  res.end(JSON.stringify(payload));
}

async function readJson(req) {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (Buffer.byteLength(body) > MAX_BODY_BYTES) throw new Error('Request too large.');
  }
  return JSON.parse(body || '{}');
}

async function handleSend(req, res) {
  let input;
  try {
    input = await readJson(req);
  } catch {
    return json(res, 400, { ok: false, error: 'Request body must be valid JSON.' });
  }

  const to = normalizeSriLankanMobile(input.to);
  const senderError = validateSenderId(input.senderId, process.env.APPROVED_SENDER_ID);
  const messageError = validateMessage(input.message);

  if (!to || senderError || messageError) {
    return json(res, 422, {
      ok: false,
      error: 'Please correct the highlighted fields.',
      fields: {
        to: to ? null : 'Enter a valid Sri Lankan mobile number, for example 0771234567 or +94771234567.',
        senderId: senderError,
        message: messageError
      }
    });
  }

  if (!client || !process.env.ANTRYK_SMS_SERVICE_ID) {
    return json(res, 503, {
      ok: false,
      error: 'Antryk is not configured. Add the server-side credentials and SMS service ID in .env.'
    });
  }

  try {
    const result = await client.sms.send({
      to,
      body: input.message.trim(),
      serviceId: process.env.ANTRYK_SMS_SERVICE_ID
    });
    return json(res, 200, { ok: true, recipient: to, result: result?.data ?? null });
  } catch (error) {
    console.error('Antryk SMS request failed:', error?.message || 'Unknown error');
    return json(res, 502, { ok: false, error: 'The SMS provider rejected the request or is temporarily unavailable.' });
  }
}

const server = createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    const html = await readFile(join(ROOT, 'public', 'index.html'));
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
    return res.end(html);
  }
  if (req.method === 'GET' && req.url === '/api/health') return json(res, 200, { ok: true });
  if (req.method === 'POST' && req.url === '/api/sms/send') return handleSend(req, res);
  json(res, 404, { ok: false, error: 'Not found.' });
});

server.listen(PORT, '0.0.0.0', () => console.log(`SMS sender running at http://localhost:${PORT}`));
