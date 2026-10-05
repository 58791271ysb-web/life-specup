window.LIFE_DATA={
version:4,
loadUser(){let u;try{u=JSON.parse(localStorage.getItem("lifeSpecupUser")||"{}")}catch{u={}};if(window.CAREER_STORE)CAREER_STORE.normalize(u);return u},
saveUser(u){if(window.CAREER_STORE)CAREER_STORE.normalize(u);localStorage.setItem("lifeSpecupUser",JSON.stringify(u));return u},
verified(){try{return JSON.parse(localStorage.getItem("lifeSpecupVerifiedCerts")||"[]")}catch{return[]}},
certNames(u=this.loadUser()){let claimed=(u.certificates||[]).map(c=>typeof c==="string"?c:c.name).filter(Boolean),verified=this.verified().filter(x=>x.status==="verified").map(x=>x.name);return [...new Set([...claimed,...verified])]},
career(u=this.loadUser()){return window.CAREER_STORE?CAREER_STORE.normalize(u).careerHistory:[]},
audit(u=this.loadUser()){let issues=[],h=this.career(u);if(h.filter(x=>x.current).length>1)issues.push("현재 재직 경력이 2개 이상");let ids=new Set();h.forEach(x=>{if(ids.has(x.id))issues.push("경력 ID 중복");ids.add(x.id);if(x.startDate&&x.endDate&&x.endDate<x.startDate)issues.push("경력 날짜 역전")});return issues}
};