// GET /api/state?gameId=...
import { getGame, ok, bad } from './_store.js';

export async function handler(event) {
const gameId = new URLSearchParams(event.rawQuery || '').get('gameId');
if (!gameId) return bad('missing gameId');
const game = await getGame(gameId);
if (!game) return bad('game not found', 404);

return ok({
gameId: game.id,
names: game.names,
tapped: game.names.filter(n => game.taps[n].state !== 'up'),
states: Object.fromEntries(game.names.map(n => [n, game.taps[n].state])),
revealed: game.revealed,
loser: game.loser,
dare: game.dare,
question: game.question
});
}
