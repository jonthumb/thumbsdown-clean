// POST /api/confirm-tap { gameId, clientId, share:true }
// Turns the current device's AMBER thumb to GREEN
import { getGame, putGame, ok, bad } from './_store.js';

export async function handler(event) {
if (event.httpMethod !== 'POST') return bad('POST required', 405);
const { gameId, clientId } = JSON.parse(event.body || '{}');
if (!gameId || !clientId) return bad('missing fields');

const game = await getGame(gameId);
if (!game) return bad('game not found', 404);

// find the amber row that belongs to this device
const mine = game.names.find(n => game.taps[n].clientId === clientId && game.taps[n].state === 'amber');
if (!mine) return bad('nothing to confirm');

game.taps[mine].state = 'green';

await putGame(game);
return ok(toClient(game));
}

function toClient(game){
return {
gameId: game.id,
names: game.names,
tapped: game.names.filter(n => game.taps[n].state !== 'up'),
states: Object.fromEntries(game.names.map(n => [n, game.taps[n].state])),
revealed: game.revealed,
loser: game.loser,
dare: game.dare,
question: game.question
};
}
