(()=>{'use strict';
const RULES=[
 {id:'all',name:'전기안전관리자 · 모든 전기설비',ranges:'모든 전기설비의 공사·유지 및 운용',req:{'전기기사':24,'전기기능장':24,'전기산업기사':48},source:'전기안전관리법 시행규칙 별표 8 / 앱 기준'},
 {id:'under2000',name:'전기안전관리자 · 2,000kW 미만',ranges:'전기설비용량 2,000kW 미만',req:{'전기기사':12,'전기기능장':12,'전기산업기사':24},source:'전기안전관리법 시행규칙 별표 8 / 앱 기준'},
 {id:'under1500',name:'전기안전관리자 · 1,500kW 미만',ranges:'전기설비용량 1,500kW 미만',req:{'전기기사':0,'전기기능장':0,'전기산업기사':0},source:'전기안전관리법 시행규칙 별표 8 / 앱 기준'}
];
const PRIORITY={'전기기능장':3,'전기기사':2,'전기산업기사':1};
function d(s){let x=s?new Date(s+'T00:00:00'):null;return x&&!isNaN(x)?x:null}
function months(a,b){if(!a||!b||b<a)return 0;let n=(b.getFullYear()-a.getFullYear())*12+b.getMonth()-a.getMonth(),anchor=new Date(a.getFullYear(),a.getMonth()+n,a.getDate());if(anchor>b){n--;anchor=new Date(a.getFullYear(),a.getMonth()+n,a.getDate())}let next=new Date(anchor.getFullYear(),anchor.getMonth()+1,anchor.getDate());return Math.max(0,n+Math.max(0,(b-anchor)/(next-anchor||1)))}
function certs(){try{return JSON.parse(localStorage.getItem('lifeSpecupVerifiedCerts')||'[]')}catch{return[]}}
function user(){try{return JSON.parse(localStorage.getItem('lifeSpecupUser')||'{}')}catch{return{}}}
function acquisition(name){let c=certs().find(x=>x.name===name&&x.status==='verified');return c?.acquiredDate||c?.acquisitionDate||''}
function periods(){let u=user(),h=Array.isArray(u.careerHistory)?u.careerHistory:[];return h.filter(x=>x.relevant!==false&&x.startDate).map(x=>({start:d(x.startDate),end:(x.current||x.isCurrent)?new Date():d(x.endDate),label:x.companyName||x.job||x.jobTitle||'관련경력'})).filter(x=>x.start&&x.end&&x.end>=x.start)}
function postCertMonths(date){let c=d(date);if(!c)return 0;return periods().reduce((s,p)=>s+months(p.start>c?p.start:c,p.end),0)}
function certificateClocks(){return certs().filter(x=>x.status==='verified'&&PRIORITY[x.name]).map(x=>{let acq=x.acquiredDate||x.acquisitionDate||'',earned=acq?postCertMonths(acq):0;return{name:x.name,acq,earned,priority:PRIORITY[x.name]||0}}).sort((a,b)=>b.priority-a.priority||String(b.acq).localeCompare(String(a.acq)))}
function representative(){return certificateClocks()[0]||null}
function evaluate(rule){let opts=Object.entries(rule.req).map(([name,need])=>{let acq=acquisition(name),held=!!acq,earned=held?postCertMonths(acq):0;return{name,need,acq,held,earned,remain:held?Math.max(0,need-earned):need,eligible:held&&earned>=need,progress:held?(need?Math.min(100,earned/need*100):100):0}}).sort((a,b)=>(b.eligible-a.eligible)||((PRIORITY[b.name]||0)-(PRIORITY[a.name]||0))||(a.remain-b.remain));return{...rule,options:opts,best:opts[0]}}
window.APPOINTMENT_ENGINE={RULES,evaluate,all:()=>RULES.map(evaluate),postCertMonths,acquisition,periods,certificateClocks,representative};
})();