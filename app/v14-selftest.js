(function(){
function prev(k){let [y,m,d]=k.split("-").map(Number),x=new Date(y,m-1,d);x.setDate(x.getDate()-1);return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,"0")}-${String(x.getDate()).padStart(2,"0")}`}
console.assert(prev("2026-03-01")==="2026-02-28","month boundary");
console.assert(prev("2024-03-01")==="2024-02-29","leap year");
function pass(v){return [v.study>=2,v.spend<=20000,v.exercise>=30,v.sleep>=7,v.primary>=2]}
console.assert(pass({study:2,spend:20000,exercise:30,sleep:7,primary:2}).every(Boolean),"threshold inclusive");
console.assert(pass({study:1.5,spend:20001,exercise:25,sleep:6.5,primary:1}).every(x=>!x),"threshold fail");
})();