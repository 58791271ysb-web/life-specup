window.CAREER_STORE={
schema:4,
jobs:["전기 시설관리","빌딩 시설관리(FM)","전기안전관리","전기설비 유지보수","전기공사","전기설계","전기감리","공무(전기)","설비보전","생산설비 유지보수","데이터센터 시설관리","반도체 Utility(전기·제어)","전력설비 운영","소방 시설관리","승강기 유지보수","플랜트 전기","기타"],
employment:["정규직","계약직","파견직","용역업체 소속","일용·단기근로","인턴","프리랜서","기타"],
companies:["시설관리 용역업체","전문 FM사","대기업·계열사","중견기업","중소기업","공기업·공공기관","지방공기업·공단","건설·전기공사업체","제조·공장","병원·학교·연구시설","데이터센터·통신","기타"],
today(){let d=new Date();return new Date(d.getFullYear(),d.getMonth(),d.getDate())},
dateKey(d=this.today()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`},
MAX_MONTHS:720,
safeMonths(v){v=Number(v);return Number.isFinite(v)?Math.max(0,Math.min(this.MAX_MONTHS,v)):0},
validDate(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(String(s||"")))return false;let d=new Date(s+"T00:00:00"),y=+String(s).slice(0,4),now=this.today().getFullYear();return !isNaN(d)&&y>=1950&&y<=now+1},
months(start,end){if(!this.validDate(start))return 0;let a=new Date(start+"T00:00:00"),b=end&&this.validDate(end)?new Date(end+"T00:00:00"):this.today();if(!Number.isFinite(a.getTime())||!Number.isFinite(b.getTime())||b<a)return 0;let n=(b.getFullYear()-a.getFullYear())*12+b.getMonth()-a.getMonth(),anchor=new Date(a.getFullYear(),a.getMonth()+n,a.getDate());if(anchor>b){n--;anchor=new Date(a.getFullYear(),a.getMonth()+n,a.getDate())}let next=new Date(anchor.getFullYear(),anchor.getMonth()+1,anchor.getDate());return this.safeMonths(n+Math.max(0,(b-anchor)/(next-anchor||1)))},
entryMonths(e){return e.manualMonths!=null?this.safeMonths(e.manualMonths):this.months(e.startDate,e.current?null:e.endDate)},
normalize(u){
 let src=Array.isArray(u.careerHistory)?u.careerHistory:[],out=[],seen=new Set();
 for(let e of src){let x={id:String(e.id||"career-"+Date.now()+"-"+out.length),job:e.job||e.jobTitle||"기타",employmentType:e.employmentType||"기타",companyType:e.companyType||"기타",companyName:e.companyName||"",startDate:e.startDate||"",endDate:e.endDate||"",manualMonths:e.manualMonths==null?null:this.safeMonths(e.manualMonths),current:Boolean(e.current??e.isCurrent),relevant:e.relevant!==false,source:e.source||"profile"};if(seen.has(x.id))x.id=x.id+"-"+out.length;seen.add(x.id);if(x.current)x.endDate="";out.push(x)}
 // Legacy signup only when no timeline exists. Never synthesize a second current job.
 if(!out.length&&u.currentJob&&(u.joinDate||(+u.careerYears||0)>0)){out.push({id:"legacy-current",job:u.currentJob,employmentType:u.employmentType||"기타",companyType:u.currentCompanyType||"기타",companyName:u.currentCompanyName||"",startDate:u.joinDate||"",endDate:"",manualMonths:u.joinDate?null:this.safeMonths((+u.careerYears||0)*12),current:!!u.joinDate,relevant:true,source:"migration"})}
 // Keep newest/first current as the only current record.
 let currentSeen=false;for(let x of out){if(x.current){if(currentSeen)x.current=false;else currentSeen=true}}
 u.careerHistory=out;u.careerSchema=4;this.sync(u);return u
},
sync(u){let cur=(u.careerHistory||[]).find(x=>x.current),m=this.totalMonths(u);u.relatedCareerMonths=Math.round(m*10)/10;u.relatedCareerYears=Math.round(m/12*10)/10;u.careerYears=u.relatedCareerYears;if(cur){u.currentJob=cur.job;u.currentCompanyType=cur.companyType;u.employmentType=cur.employmentType;u.joinDate=cur.startDate}return u},
totalMonths(u){let total=(u.careerHistory||[]).filter(x=>x.relevant).reduce((n,x)=>n+this.entryMonths(x),0);return this.safeMonths(total)},
current(u){return (u.careerHistory||[]).find(x=>x.current)||null},
overlap(a,b){if(a.manualMonths!=null||b.manualMonths!=null||!a.startDate||!b.startDate)return false;let ae=a.current?"9999-12-31":a.endDate||a.startDate,be=b.current?"9999-12-31":b.endDate||b.startDate;return a.startDate<=be&&b.startDate<=ae},
validate(u,e,ignore=""){let errors=[];if(e.current&&(u.careerHistory||[]).some(x=>x.id!==ignore&&x.current))errors.push("현재 재직 경력이 이미 있습니다.");if(e.startDate&&new Date(e.startDate+"T00:00:00")>this.today())errors.push("입사일은 미래일 수 없습니다.");if(!e.current&&e.startDate&&e.endDate&&e.endDate<e.startDate)errors.push("종료일이 입사일보다 빠릅니다.");if(e.manualMonths!=null&&(+e.manualMonths<0||+e.manualMonths>this.MAX_MONTHS))errors.push("직접 입력 경력은 0~60년 범위만 가능합니다.");if((u.careerHistory||[]).some(x=>x.id!==ignore&&(x.job===e.job||x.companyName&&x.companyName===e.companyName)&&this.overlap(x,e)))errors.push("같은 직무/회사의 경력 기간이 중복됩니다.");return errors},
upsert(u,e){this.normalize(u);let errors=this.validate(u,e,e.id||"");if(errors.length)return{ok:false,errors};let i=u.careerHistory.findIndex(x=>x.id===e.id);let x={...e,id:e.id||"career-"+Date.now()};if(i>=0)u.careerHistory[i]=x;else u.careerHistory.push(x);this.sync(u);return{ok:true,entry:x}},
remove(u,id){this.normalize(u);u.careerHistory=u.careerHistory.filter(x=>x.id!==id);this.sync(u);return u}
};