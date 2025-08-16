const { get } = require('./_store');

exports.handler = async (event)=>{
try{
const gameId=(event.queryStringParameters||{}).gameId;
if(!gameId) return resp(400,{error:'missing gameId'});
const s=get(gameId); if(!s) return resp(404,{error:'game not found'});
const out={ gameId:s.gameId, names:s.names, tapped:s.tapped, pending:s.pending, revealed:s.revealed, loser:s.loser, dare:s.dare, escape:s.escape||null };
return resp(200,out);
}catch(e){ return resp(500,{error:e.message}); }
};
function resp(code, body){ return { statusCode:code, headers:{'content-type':'application/json'}, body:JSON.stringify(body) }; }
