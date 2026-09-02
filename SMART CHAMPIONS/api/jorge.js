'use strict';

const { processJorgeRequest } = require('./_lib/orchestrator');
const { database } = require('./_lib/knowledge');

module.exports = async function handler(request, response) {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  if (request.method === 'OPTIONS') {
    response.setHeader('Allow', 'GET, POST, OPTIONS');
    return response.status(204).end();
  }
  if (request.method === 'GET') {
    return response.status(200).json({ status: 'ok', service: 'JORGE_INTELLIGENCE', remoteAI: false, provider: 'LocalFallbackProvider', schemaVersion: database.schemaVersion, records: database.records.length });
  }
  if (request.method !== 'POST') return response.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  try {
    const body = typeof request.body === 'string' ? JSON.parse(request.body || '{}') : (request.body || {});
    const result = await processJorgeRequest(body);
    return response.status(200).json(result);
  } catch (error) {
    const status = error.statusCode || 500;
    return response.status(status).json({ error: status === 400 ? error.message : 'JORGE_TEMPORARILY_UNAVAILABLE', fallback: true });
  }
};
