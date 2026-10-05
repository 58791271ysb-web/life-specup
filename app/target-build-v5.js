window.TargetBuild=(function(){
 const KEY="lifeSpecupTargetBuild";
 function load(){try{return JSON.parse(localStorage.getItem(KEY)||"null")||{name:"1년 뒤의 나",targetDate:"",careerYears:0,certs:[],createdAt:null}}catch{return{name:"1년 뒤의 나",targetDate:"",careerYears:0,certs:[]}}}
 function save(x){x.updatedAt=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(x));return x}
 function owned(){let u=window.LIFE_DATA?LIFE_DATA.loadUser():JSON.parse(localStorage.getItem("lifeSpecupUser")||"{}");return new Set(window.LIFE_DATA?LIFE_DATA.certNames(u):(u.certificates||[]).map(x=>x.name||x))}
 function currentYears(){let u=window.LIFE_DATA?LIFE_DATA.loadUser():JSON.parse(localStorage.getItem("lifeSpecupUser")||"{}");return window.CAREER_STORE?CAREER_STORE.totalMonths(u)/12:(+u.careerYears||0)}
 function progress(b=load()){let o=owned(),q={};try{q=JSON.parse(localStorage.getItem("lifeSpecupQuests")||"{}")}catch{};let parts=[]; if(b.careerYears>0)parts.push(Math.min(1,currentYears()/b.careerYears)); (b.certs||[]).forEach(c=>{let n=typeof c==="string"?c:c.name,stage=typeof c==="string"?"target":(c.stage||"target"),g=(q.long||[]).find(x=>x.cert===n&&!x.done);let partial=g?.stage==="practical"?.45:g?.stage==="written"?.15:0;parts.push(o.has(n)?1:Math.max(partial,stage==="written_pass"?.45:stage==="practical_ready"?.7:0))});return parts.length?Math.round(parts.reduce((a,b)=>a+b,0)/parts.length*100):0}
 function missing(b=load()){let o=owned();return (b.certs||[]).filter(c=>!o.has(typeof c==="string"?c:c.name))}
 return{load,save,owned,currentYears,progress,missing}
})();
