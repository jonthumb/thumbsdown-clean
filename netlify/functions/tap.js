const { tapPending } = require('./_store');

exports.handler = async (event)=>{
try{
const { gameId, name } = JSON.parse(event.body || '{}');
if(!gameId) return resp(400,{error:'missing gameId'});
if(!name) return resp(400,{error:'missing name'});
const s = tapPending(gameId, name);

const shareText =
`I’ve put my thumb down in “Thumbs Down”.
(My tap only counts if I share this.)`;

return resp(200,{ state:s, shareText });
}catch(e){ return resp(500,{error:e.message}); }
};
function resp(code, body){ return { statusCode:code, headers:{'content-type':'application/json'}, body:JSON.stringify(body) }; }
