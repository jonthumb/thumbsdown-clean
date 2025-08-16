// _store.js — tiny wrapper around Netlify Blobs (KV)
import { getStore } from '@netlify/blobs';

const store = getStore({ name: 'thumbsdown', consistency: 'strong' });

const key = (id) => `game:${id}`;

export async function getGame(id) {
return await store.get(key(id), { type: 'json' });
}

export async function putGame(game) {
await store.set(key(game.id), JSON.stringify(game));
return game;
}

export async function newId() {
return (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`);
}

// helpers to standardize API responses
export function ok(data, status = 200) {
return {
statusCode: status,
headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
body: JSON.stringify(data)
};
}
export function bad(message, status = 400) {
return ok({ error: message }, status);
}

return g;
}

function prepareReveal(gameId, payload){
const g=get(gameId); if(!g) throw new Error('game not found');
const remaining = g.names.filter(n=>!g.tapped.includes(n) && !g.pending[n]);
if(remaining.length!==1) throw new Error('not penultimate yet');
const loser = remaining[0];
// build share text now (answers shown based on type)
const { target, qType, questionText, answers, dare } = payload || {};
let qaSection = '';
if(qType==='yn'){
qaSection = `${questionText}\nAnswer: Yes or No`;
}else{
const opts=[];
if(answers?.A) opts.push(`A) ${answers.A}`);
if(answers?.B) opts.push(`B) ${answers.B}`);
if(answers?.C) opts.push(`C) ${answers.C}`);
qaSection = `${questionText}\n${opts.join('\n')}`;
}
const shareText =
`Today's loser is: ${loser}

They can escape by answering this about ${target}:

${qaSection}

Reply in this chat with your answer. If ${target} confirms it’s right, you escape; otherwise do the dare.

Dare: ${dare || '(none)'}`;

// stash escape meta (we finalize on confirmReveal)
g._pendingReveal = { target, qType, questionText, answers, dare, loser, shareText };
return { state:g, shareText };
}

function confirmReveal(gameId){
const g=get(gameId); if(!g) throw new Error('game not found');
const p=g._pendingReveal; if(!p) throw new Error('no pending reveal');
g.revealed=true; g.loser=p.loser; g.dare=p.dare||null;
g.escape = { target:p.target, qType:p.qType, questionText:p.questionText, answers:p.answers||null };
delete g._pendingReveal;
return g;
}

module.exports = { create, get, tapPending, confirmTap, prepareReveal, confirmReveal };
