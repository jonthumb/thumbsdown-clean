// Prototype in-memory store
const games = new Map();
// state: { gameId, names:[], tapped:[], pending:{ [name]:true }, revealed:false,
// loser:null, dare:null, escape:{ target, qType, questionText, answers? } }

function newId(){ return Math.random().toString(36).slice(2,10); }

function create(names){
const gameId=newId();
const state={ gameId, names, tapped:[], pending:{}, revealed:false, loser:null, dare:null, escape:null };
games.set(gameId,state); return state;
}
function get(gameId){ return games.get(gameId) || null; }

function tapPending(gameId, name){
const g=get(gameId); if(!g) throw new Error('game not found');
if(!g.names.includes(name)) throw new Error('name not in game');
if(g.tapped.includes(name)) return g;
g.pending[name]=true; return g;
}
function confirmTap(gameId, name){
const g=get(gameId); if(!g) throw new Error('game not found');
if(!g.names.includes(name)) throw new Error('name not in game');
if(g.pending[name]) delete g.pending[name];
if(!g.tapped.includes(name)) g.tapped.push(name);
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
