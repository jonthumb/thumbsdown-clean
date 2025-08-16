const store = require('./_store');

exports.handler = async (event) => {
try {
if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
const { gameId, name, clientId } = JSON.parse(event.body || '{}');
const game = store.getGame(gameId);
if (!game) return { statusCode: 404, body: JSON.stringify({ error: 'game not found' }) };

const player = game.players.find(p => p.name.toLowerCase() === String(name||'').toLowerCase());
if (!player) return { statusCode: 400, body: JSON.stringify({ error: 'name not in game' }) };

// one device → one confirmed name per game
const already = game.players.find(p => p.deviceId === clientId && p.name.toLowerCase() !== player.name.toLowerCase());
if (already) {
return { statusCode: 400, body: JSON.stringify({ error: 'device already confirmed another player' }) };
}

player.status = 'confirmed'; // turn green
player.deviceId = clientId;

// recompute loser
const up = game.players.filter(p => p.status === 'up').map(p => p.name);
if (up.length === 1) {
game.loser = up[0];
} else if (up.length === 0 && !game.loser) {
// edge: everyone confirmed — no loser
game.loser = null;
}

return { statusCode: 200, body: JSON.stringify(store.toState(game)) };
} catch (e) {
return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
}
};
