window.CAREER_HISTORY={
jobTitles:CAREER_STORE.jobs,employmentTypes:CAREER_STORE.employment,companyTypes:CAREER_STORE.companies,today:()=>CAREER_STORE.today(),asOf:()=>CAREER_STORE.dateKey().replaceAll("-","."),
monthsBetween:(a,b)=>CAREER_STORE.months(a,b),entryMonths:e=>CAREER_STORE.entryMonths({manualMonths:e.manualMonths,startDate:e.startDate,endDate:e.endDate,current:e.isCurrent}),
roundYears:m=>Math.round(m/12*10)/10,durationLabel:m=>{let n=Math.floor(m),y=Math.floor(n/12),mo=n%12;return [y?y+"년":"",mo?mo+"개월":""].filter(Boolean).join(" ")||"0개월"},
get:u=>CAREER_STORE.normalize(u).careerHistory.map(e=>({...e,jobTitle:e.job,isCurrent:e.current})),totalRelevantMonths:u=>CAREER_STORE.totalMonths(CAREER_STORE.normalize(u)),currentEntry:u=>{let e=CAREER_STORE.current(CAREER_STORE.normalize(u));return e?{...e,jobTitle:e.job,isCurrent:e.current}:null},
syncUser:u=>CAREER_STORE.normalize(u)
};