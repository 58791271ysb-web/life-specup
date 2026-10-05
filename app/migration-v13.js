(function(){
let q;try{q=JSON.parse(localStorage.getItem("lifeSpecupQuests")||"{}")}catch{return}
if(!q||q._schema>=13)return;
q._schema=13;
q.selected=(q.selected||[]).map(x=>({...x,xp:Math.min(+x.xp||1,6)}));
Object.values(q.days||{}).forEach(d=>{d.quests=(d.quests||[]).map(x=>({...x,xp:Math.min(+x.xp||1,6)}))});
localStorage.setItem("lifeSpecupQuests",JSON.stringify(q));
})();