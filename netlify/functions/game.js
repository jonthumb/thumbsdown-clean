const { create } = require('./_store');

exports.handler = async (event) => {
try{
const { names } = JSON.parse(event.body || '{}');
if(!Array.isArray(names) || names.length<3) return resp(400,{error:'need at least 3 names'});
const clean = names.map(s=>String(s).trim()).filter(Boolean).slice(0,10);
const state = create(clean);
return resp(200,{ gameId:state.gameId, state });
}catch(e){ return resp(500,{error:e.message}); }
};
function resp(code, body){ return { statusCode:code, headers:{'content-type':'application/json'}, body:JSON.stringify(body) }; }
