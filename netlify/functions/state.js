const store = require('./_store');

exports.handler = async (event) => {
try {
const gameId = (event.queryStringParameters && event.queryStringParameters.gameId) || '';
const game = store.getGame(gameId);
if (!game) return { statusCode: 404, body: JSON.stringify({ error: 'game not found' }) };
return { statusCode: 200, body: JSON.stringify(store.toState(game)) };
} catch (e) {
return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
}
};
