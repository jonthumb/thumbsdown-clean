const { confirmReveal } = require('./_store');

exports.handler = async (event)=>{
try{
const { gameId } = JSON.parse(event.body || '{}');
if(!gameId) return resp(400,{error:'missing gameId'});
const s = confirmReveal(gameId);
return resp(200,{ state:s });
}catch(e){ return resp(500,{error:e.message}); }
};
function resp(code, body){ return { statusCode:code, headers:{'content-type':'application/json'}, body:JSON.stringify(body) }; }
