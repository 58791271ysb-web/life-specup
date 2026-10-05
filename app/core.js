window.LifeSpecupCore=(function(){
function lifeDay(d=new Date()){let x=new Date(d);if(x.getHours()<6)x.setDate(x.getDate()-1);return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,"0")}-${String(x.getDate()).padStart(2,"0")}`}
function get(k,f){try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}
function set(k,v){localStorage.setItem(k,JSON.stringify(v))}
function levelInfo(xp){let level=1,spent=0;function need(l){if(l<=5)return [30,45,65,90,120][l-1];if(l<=10)return 155+(l-6)*45;if(l<=20)return 400+(l-11)*85;if(l<=30)return 1300+(l-21)*150;return 2950+(l-31)*225}let n=need(level);while(xp-spent>=n){spent+=n;level++;n=need(level)}return{level,cur:xp-spent,need:n,pct:Math.min(100,(xp-spent)/n*100),total:xp}}
function toast(m){let e=document.querySelector("#toast");if(!e)return;e.textContent=m;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),1800)}
function saveXP(amount,text){let s=get("lifeSpecupState",{xp:0,history:[]});s.history=s.history||[];s.xp=(s.xp||0)+amount;s.history.unshift({date:lifeDay(),text,xp:amount});set("lifeSpecupState",s)}
return{lifeDay,get,set,levelInfo,toast,saveXP}
})();