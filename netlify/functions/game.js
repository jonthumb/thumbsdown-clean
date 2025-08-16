const store = require('./_store');

exports.handler = async (event) => {
try {
if (event.httpMethod !== 'POST') {
return { statusCode: 405, body: 'Method Not Allowed' };
}
const { names } = JSON.parse(event.body || '{}');
if (!Array.isArray(names) || names.filter(x => String(x||'').trim()).length < 3) {
return { statusCode: 400, body: JSON.stringify({ error: 'need at least 3 names' }) };
}
const game = store.createGame(names);
return {
statusCode: 200,
body: JSON.stringify({ gameId: game.id, state: store.toState(game) })
};
} catch (e) {
return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
}
};
