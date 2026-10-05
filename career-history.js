window.CAREER_HISTORY={
version:1,
jobTitles:["전기 시설관리","전기안전관리","전기설비 유지보수","전기공사","전기설계","전기감리","빌딩 시설관리(FM)","기계 시설관리","소방 시설관리","소방설비 유지보수","승강기 유지보수","설비보전","생산설비 유지보수","공무(전기)","플랜트 전기","데이터센터 시설관리","반도체 설비기술","전력설비 운영","전기 기술지원","전기 품질관리","기타"],
employmentTypes:["정규직","계약직","파견직","용역업체 소속","일용·단기근로","인턴","프리랜서","기타"],
companyTypes:["시설관리 용역업체","전문 FM사","대기업·계열사","중견기업","중소기업","공기업·공공기관","지방공기업·공단","건설·전기공사업체","제조·공장","병원·학교·연구시설","데이터센터·통신","기타"],
today(){let d=new Date();return new Date(d.getFullYear(),d.getMonth(),d.getDate())},
monthsBetween(start,end){
 if(!start)return 0;let a=new Date(start+"T00:00:00"),b=end?new Date(end+"T00:00:00"):this.today();if(isNaN(a)||isNaN(b)||b<a)return 0;
 let whole=(b.getFullYear()-a.getFullYear())*12+(b.getMonth()-a.getMonth()),anchor=new Date(a.getFullYear(),a.getMonth()+whole,a.getDate());
 if(anchor>b){whole--;anchor=new Date(a.getFullYear(),a.getMonth()+whole,a.getDate())}
 let next=new Date(anchor.getFullYear(),anchor.getMonth()+1,anchor.getDate()),frac=Math.max(0,(b-anchor)/(next-anchor||1));
 return Math.max(0,whole+frac)
},
asOf(){let d=this.today();return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")}`},
roundYears(months){return Math.round((months/12)*10)/10},
relatedCareerYears(user){return this.roundYears(this.totalRelevantMonths(user))},
durationLabel(months){if(months<1)return `${Math.max(0,Math.round(months*30.4375))}일`;let y=Math.floor(months/12),m=Math.floor(months%12),r=[];if(y)r.push(`${y}년`);if(m)r.push(`${m}개월`);if(!r.length)r.push("1개월 미만");return r.join(" ")},
get(user){
 let h=Array.isArray(user.careerHistory)?user.careerHistory:[];
 if(!h.length&&user.careerYears){h=[{id:"legacy",jobTitle:user.currentJob||"기타",employmentType:"기타",companyType:user.currentCompanyType||"기타",manualMonths:(+user.careerYears||0)*12,relevant:true,legacy:true}]}
 return h
},
entryMonths(e){return e.manualMonths!=null?Math.max(0,+e.manualMonths||0):this.monthsBetween(e.startDate,e.isCurrent?null:e.endDate)},
totalRelevantMonths(user){return this.get(user).filter(e=>e.relevant!==false).reduce((s,e)=>s+this.entryMonths(e),0)},
currentEntry(user){return this.get(user).find(e=>e.isCurrent)||null},
syncUser(user){
 let cur=this.currentEntry(user),months=this.totalRelevantMonths(user);user.relatedCareerMonths=Math.round(months*10)/10;user.relatedCareerYears=this.roundYears(months);user.careerYears=user.relatedCareerYears;
 if(cur){user.currentJob=cur.jobTitle;user.currentCompanyType=cur.companyType;user.employmentType=cur.employmentType;user.joinDate=cur.startDate}
 return user
}
};