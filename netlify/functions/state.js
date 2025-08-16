// GET /api/state?gameId=...
module.exports.handler = async (event) => {
if (event.httpMethod !== 'GET') {
return { statusCode: 405, body: 'Method Not Allowed' };
}
try {
const id = event.queryStringParameters?.gameId || '';
const { readGame } = require('./_store');
const game = await readGame(id);
if (!game) {
return {
statusCode: 404,
headers: { 'content-type': 'application/json' },
body: JSON.stringify({ error: 'game not found' })
};
}
return {
statusCode: 200,
headers: { 'content-type': 'application/json' },
body: JSON.stringify(game)
};
} catch (e) {
return {
statusCode: 500,
headers: { 'content-type': 'application/json' },
body: JSON.stringify({ error: 'state failed' })
};
}
};
