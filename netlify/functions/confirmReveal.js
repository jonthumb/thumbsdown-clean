const store = require('./_store');

exports.handler = async (event) => {
try {
if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
const { gameId, dare, question } = JSON.parse(event.body || '{}');
const game = store.getGame(gameId);
if (!game) return { statusCode: 404, body: JSON.stringify({ error: 'game not found' }) };

game.dare = String(dare || '').slice(0, 200);
// question = { subject, text, kind, options: [A,B,(C?)] } (2–3 options)
if (question && question.subject && question.text && (question.kind === 'yesno' || question.kind === 'open')) {
const opts = Array.isArray(question.options) ? question.options.filter(x => String(x||'').trim()).slice(0,3) : [];
if ((question.kind === 'yesno' && opts.length === 0) || (question.kind === 'open' && opts.length < 2)) {
return { statusCode: 400, body: JSON.stringify({ error: 'invalid options' }) };
}
game.question = {
subject: String(question.subject),
text: String(question.text).slice(0, 120),
kind: question.kind,
options: question.kind === 'yesno' ? ['Yes', 'No'] : opts.slice(0,3)
};
} else {
game.question = null;
}

game.revealed = true;

return { statusCode: 200, body: JSON.stringify(store.toState(game)) };
} catch (e) {
return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
}
};
