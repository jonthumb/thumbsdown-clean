// Persistent storage using Netlify Blobs.
// No package.json change needed; we use dynamic import so CommonJS works.

async function getStore() {
const mod = await import('@netlify/blobs');
// One logical store for all games; strong consistency keeps reads fresh.
return mod.getStore('td-games', { consistency: 'strong' });
}

async function readGame(id) {
if (!id) return null;
const store = await getStore();
return await store.getJSON(`game:${id}`);
}

async function writeGame(game) {
const store = await getStore();
await store.setJSON(`game:${game.gameId}`, game, {
metadata: { updated: Date.now() }
});
return game;
}

async function createGame(names) {
const id = (globalThis.crypto?.randomUUID?.() ||
(Date.now() + Math.random().toString(36).slice(2)));
const game = {
gameId: id,
names,
tapped: [], // players who tapped (amber)
confirmed: [], // players who shared/confirmed (green)
revealed: false,
dare: null,
loser: null
};
return await writeGame(game);
}

module.exports = { readGame, writeGame, createGame };

players,
createdAt: Date.now(),
revealed: false,
loser: null,
dare: '',
question: null // {subject, text, kind:'yesno'|'open', options:['A','B','C'] (2-3 entries)}
};

store.games[id] = game;
return game;
},

getGame(id) {
return store.games[id] || null;
},

toState(game) {
return {
gameId: game.id,
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
};

module.exports = store;
