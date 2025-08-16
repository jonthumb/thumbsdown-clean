// CommonJS singleton store (in-memory).
const { v4: uuidv4 } = require('uuid');

const store = {
games: {},

createGame(names) {
const id = uuidv4();
// canonical list, trim blanks, unique by case-insensitive key
const map = new Map();
names.forEach(n => {
const name = String(n || '').trim();
if (!name) return;
const key = name.toLowerCase();
if (!map.has(key)) map.set(key, name);
});
const players = Array.from(map.values()).slice(0, 10).map(n => ({
name: n,
status: 'up', // 'up' (red) → 'pending' (amber) → 'confirmed' (green)
deviceId: null, // set when confirmed
tappedAt: null
}));

const game = {
id,
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
