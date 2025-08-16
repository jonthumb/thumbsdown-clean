// POST /api/confirm-reveal { gameId, clientId, dare, question }
// Finalize: identify loser, store dare + question (simple structure)
import { getGame, putGame, ok, bad } from './_store.js';

export async function handler(event) {
if (event.httpMethod !== 'POST') return bad('POST required', 405);
const { gameId, clientId, dare, question } = JSON.parse(event.body || '{}');
if (!gameId || !clientId) return bad('missing fields');

const game = await getGame(gameId);
if (!game) return bad('game not found', 404);

// Ensure caller is penultimate (i.e., they already confirmed green)
const greens = game.names.filter(n => game.taps[n].state === 'green');
const mine = game.names.find(n => game.taps[n].clientId === clientId && game.taps[n].state === 'green');
const remaining = game.names.filter(n => game.taps[n].state !== 'green');

if (!mine) return bad('only confirmed player can reveal');
if (remaining.length !== 1) return bad('not ready to reveal');

game.revealed = true;
game.loser = remaining[0];
game.dare = String(dare || '').slice(0, 200);
// store a minimal question payload (your UI can format the WhatsApp text)
game.question = question || null;

await putGame(game);
return ok({
gameId: game.id,
loser: game.loser,
dare: game.dare,
question: game.question
});
}
