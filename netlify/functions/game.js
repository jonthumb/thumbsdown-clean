// POST /api/game -> { gameId, state }
module.exports.handler = async (event) => {
if (event.httpMethod !== 'POST') {
return { statusCode: 405, body: 'Method Not Allowed' };
}
try {
const body = JSON.parse(event.body || '{}');
const raw = Array.isArray(body.names) ? body.names : [];
const names = raw.map(s => String(s || '').trim()).filter(Boolean).slice(0, 10);
if (names.length < 3) throw new Error('need at least 3 names');

const { createGame } = require('./_store');
const state = await createGame(names);
return {
statusCode: 200,
headers: { 'content-type': 'application/json' },
body: JSON.stringify({ gameId: state.gameId, state })
};
} catch (e) {
return {
statusCode: 400,
headers: { 'content-type': 'application/json' },
body: JSON.stringify({ error: e.message || 'create failed' })
};
}
};
