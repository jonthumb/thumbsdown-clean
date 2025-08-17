// netlify/functions/_store.js
// CommonJS module + dynamic ESM import so it works on Netlify Functions

async function kv() {
const mod = await import('@netlify/blobs'); // ESM import at runtime
// one logical store; strong consistency keeps reads fresh across regions
return mod.getStore('td-games', { consistency: 'strong' });
}

async function readGame(id) {
if (!id) return null;
const store = await kv();
return await store.getJSON(`game:${id}`);
}

async function writeGame(game) {
const store = await kv();
await store.setJSON(`game:${game.gameId}`, game, {
metadata: { updated: Date.now() }
});
return game;
}

async function createGame(names) {
const id =
(globalThis.crypto?.randomUUID?.()) ||
(Date.now().toString(36) + Math.random().toString(36).slice(2));

const players = names
.map(n => n.trim())
.filter(Boolean)
.map(n => ({
name: n,
status: 'up', // 'up' | 'pending' (amber) | 'confirmed' (green)
clientId: null,
tappedAt: null
}));

const game = {
gameId: id,
players,
createdAt: Date.now(),
revealed: false,
loser: null,
dare: '',
question: null // { subject, text, kind:'yesno'|'open', options:['A','B','C'] }
};

await writeGame(game);
return game;
}

function toState(game) {
return {
gameId: game.gameId,
names: game.players.map(p => p.name),
tapped: game.players.filter(p => p.status !== 'up').map(p => p.name),
pending: game.players.filter(p => p.status === 'pending').map(p => p.name),
confirmed: game.players.filter(p => p.status === 'confirmed').map(p => p.name),
revealed: !!game.revealed,
dare: game.dare || '',
loser: game.loser || null,
question: game.question || null
};
}

module.exports = {
// keep the method names your other functions expect
getGame: readGame,
writeGame,
createGame,
toState
};
