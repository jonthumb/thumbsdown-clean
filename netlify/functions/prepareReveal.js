// POST /api/prepare-reveal { gameId }
// Computes if we are down to one remaining (loser candidate)
import { getGame, putGame, ok, bad } from './_store.js';

export async function handler(event) {
if (event.httpMethod !== 'POST') return bad('POST required', 405);
const { gameId } = JSON.parse(event.body || '{}');
if (!gameId) return bad('missing gameId');
const game = await getGame(gameId);
if (!game) return bad('game not found', 404);

const remaining = game.names.filter(n => game.taps[n].state === 'up' || game.taps[n].state === 'amber');
const down = game.names.filter(n => game.taps[n].state === 'green');

return ok({
remaining,
down,
pendingLoser: remaining.length === 1 ? remaining[0] : null
});
}
