const { confirmTap } = require('./_store');

exports.handler = async (event)=>{
try{
const { gameId, name } = JSON.parse(event.body || '{}');
if(!gameId) return resp(400,{error:'missing gameId'});
if(!name) return resp(400,{error:'missing name'});
const s = confirmTap(gameId, name);
return resp(200,{ state:s });
}catch(e){ return resp(500,{error:e.message}); }
};
function resp(code, body){ return { statusCode:code, headers:{'content-type':'application/json'}, body:JSON.stringify(body) }; }
