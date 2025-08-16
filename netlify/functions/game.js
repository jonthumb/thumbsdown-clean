// POST /api/game { names: string[] }
import { newId, putGame, ok, bad } from './_store.js';

export async function handler(event) {
if (event.httpMethod !== 'POST') return bad('POST required', 405);
let names;
try {
({ names } = JSON.parse(event.body || '{}'));
} catch { return bad('invalid json'); }

if (!Array.isArray(names) || names.length < 3) return bad('at least 3 names');

// canonicalize names (trim + single spaces)
names = names.map(n => String(n).trim()).filter(Boolean);
const id = await newId();

const game = {
id,
createdAt: Date.now(),
names,
// per-name state: 'up' | 'amber' | 'green'
taps: Object.fromEntries(names.map(n => [n, { state: 'up', clientId: null, shared: false }])),
// reveal / punishment block
revealed: false,
loser: null,
dare: null,
question: null, // { about, type:'yn'|'mc', text, options?:string[] }
};

await putGame(game);

return ok({ gameId: id, state: toClient(game) });
}

function toClient(game) {
// minimal state the UI expects
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
