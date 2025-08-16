// POST /api/tap { gameId, name, clientId }
// Moves a thumb to AMBER (soft lock to that device)
import { getGame, putGame, ok, bad } from './_store.js';

export async function handler(event) {
if (event.httpMethod !== 'POST') return bad('POST required', 405);
const { gameId, name, clientId } = JSON.parse(event.body || '{}');
if (!gameId || !name || !clientId) return bad('missing fields');

const game = await getGame(gameId);
if (!game) return bad('game not found', 404);
if (!game.names.includes(name)) return bad('name not in game');

const cell = game.taps[name];

// If already taken by someone else, block
if (cell.state !== 'up' && cell.clientId && cell.clientId !== clientId)
return bad('already tapped by another device');

// If this device previously confirmed a different name, block any further taps
const alreadyGreen = game.names.find(n => game.taps[n].clientId === clientId && game.taps[n].state === 'green');
if (alreadyGreen) return bad('device already confirmed');

// set to amber
cell.state = 'amber';
cell.clientId = clientId;

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
