window.CAREER_STORE={
schema:3,
jobs:["전기 시설관리","빌딩 시설관리(FM)","전기안전관리","전기설비 유지보수","전기공사","전기설계","전기감리","공무(전기)","설비보전","생산설비 유지보수","데이터센터 시설관리","반도체 Utility(전기·제어)","전력설비 운영","소방 시설관리","승강기 유지보수","플랜트 전기","기타"],
employment:["정규직","계약직","파견직","용역업체 소속","일용·단기근로","인턴","프리랜서","기타"],
companies:["시설관리 용역업체","전문 FM사","대기업·계열사","중견기업","중소기업","공기업·공공기관","지방공기업·공단","건설·전기공사업체","제조·공장","병원·학교·연구시설","데이터센터·통신","기타"],
today(){let d=new Date();return new Date(d.getFullYear(),d.getMonth(),d.getDate())},
dateKey(d=this.today()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`},
months(start,end){
 if(!start)return 0;let a=new Date(start+"T00:00:00"),b=end?new Date(end+"T00:00:00"):this.today();if(isNaN(a)||isNaN(b)||b<a)return 0;
 let n=(b.getFullYear()-a.getFullYear())*12+b.getMonth()-a.getMonth(),anchor=new Date(a.getFullYear(),a.getMonth()+n,a.getDate());
 if(anchor>b){n--;anchor=new Date(a.getFullYear(),a.getMonth()+n,a.getDate())}
 let next=new Date(anchor.getFullYear(),anchor.getMonth()+1,anchor.getDate()),frac=(b-anchor)/(next-anchor||1);return Math.max(0,n+Math.max(0,frac))
},
entryMonths(e){return e.manualMonths!=null?Math.max(0,+e.manualMonths||0):this.months(e.startDate,e.current?null:e.endDate)},
normalize(u){
 u.careerHistory=Array.isArray(u.careerHistory)?u.careerHistory:[];
 // migrate signup/current-job legacy exactly once; do not add if a current entry already exists
 if(!u.careerHistory.some(e=>e.current)&&u.currentJob&&(u.joinDate||u.careerYears)){
   u.careerHistory.push({id:"current-"+Date.now(),job:u.currentJob,employmentType:u.employmentType||"기타",companyType:u.currentCompanyType||"기타",companyName:u.currentCompanyName||"",startDate:u.joinDate||"",manualMonths:u.joinDate?null:(+u.careerYears||0)*12,current:!!u.joinDate,relevant:true,source:"signup"})
 }
 // old v2.3 fields migration
 u.careerHistory=u.careerHistory.map(e=>({id:e.id||"career-"+Math.random().toString(36).slice(2),job:e.job||e.jobTitle||"기타",employmentType:e.employmentType||"기타",companyType:e.companyType||"기타",companyName:e.companyName||"",startDate:e.startDate||"",endDate:e.endDate||"",manualMonths:e.manualMonths,current:e.current??e.isCurrent??false,relevant:e.relevant!==false,source:e.source||"profile"}));
 // only one current
 let seen=false;u.careerHistory.forEach(e=>{if(e.current){if(seen)e.current=false;else seen=true}});
 this.sync(u);return u
},
sync(u){let h=u.careerHistory||[],cur=h.find(e=>e.current),m=this.totalMonths(u);u.relatedCareerMonths=Math.round(m*10)/10;u.relatedCareerYears=Math.round(m/12*10)/10;u.careerYears=u.relatedCareerYears;if(cur){u.currentJob=cur.job;u.currentCompanyType=cur.companyType;u.employmentType=cur.employmentType;u.joinDate=cur.startDate}return u},
totalMonths(u){return (u.careerHistory||[]).filter(e=>e.relevant!==false).reduce((a,e)=>a+this.entryMonths(e),0)},
current(u){return (u.careerHistory||[]).find(e=>e.current)||null},
overlap(a,b){if(a.manualMonths!=null||b.manualMonths!=null)return false;let ae=a.current?"9999-12-31":a.endDate||a.startDate,be=b.current?"9999-12-31":b.endDate||b.startDate;return a.startDate&&b.startDate&&a.startDate<=be&&b.startDate<=ae},
duplicate(u,e,ignore){return (u.careerHistory||[]).some(x=>x.id!==ignore&&((e.current&&x.current)||((x.job===e.job||x.companyName&&x.companyName===e.companyName)&&this.overlap(x,e))))},
futureYears(u,extraYears){return Math.round(((this.totalMonths(u)/12)+extraYears)*10)/10}
};