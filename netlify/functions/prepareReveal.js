const store = require('./_store');

// Returns data needed for the punisher modal once only one 'up' remains
exports.handler = async (event) => {
try {
if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
const { gameId } = JSON.parse(event.body || '{}');
const game = store.getGame(gameId);
if (!game) return { statusCode: 404, body: JSON.stringify({ error: 'game not found' }) };

const up = game.players.filter(p => p.status === 'up').map(p => p.name);
const pending = game.players.filter(p => p.status === 'pending').map(p => p.name);
const confirmed = game.players.filter(p => p.status === 'confirmed').map(p => p.name);

return {
statusCode: 200,
body: JSON.stringify({
gameId: game.id,
loser: game.loser,
up, pending, confirmed
})
};
} catch (e) {
return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
}
};
