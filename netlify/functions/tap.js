const store = require('./_store');

exports.handler = async (event) => {
try {
if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
const { gameId, name, clientId } = JSON.parse(event.body || '{}');
const game = store.getGame(gameId);
if (!game) return { statusCode: 404, body: JSON.stringify({ error: 'game not found' }) };

const player = game.players.find(p => p.name.toLowerCase() === String(name||'').toLowerCase());
if (!player) return { statusCode: 400, body: JSON.stringify({ error: 'name not in game' }) };

// If already confirmed (green), ignore further taps
if (player.status === 'confirmed') {
return { statusCode: 200, body: JSON.stringify(store.toState(game)) };
}

// If some other player is confirmed on this clientId (shouldn’t happen with our UI)
// we still prevent multi-player confirm on same device later in confirmTap.
player.status = 'pending'; // turn amber
player.tappedAt = Date.now();

// loser is computed when only one 'up' remains
const remainingUp = game.players.filter(p => p.status === 'up').map(p => p.name);
if (remainingUp.length === 1) {
game.loser = remainingUp[0];
}

return { statusCode: 200, body: JSON.stringify(store.toState(game)) };
} catch (e) {
return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
}
};
