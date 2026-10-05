window.MARKET_MAP={
version:"4.1",updated:"2026-10-05",
segments:[
{id:"fm_general",name:"민간 시설관리·FM",icon:"▦",kind:"private",baseline:54,weights:{cert:22,career:28,experience:26,fit:18,education:4,language:2},note:"일반 FM·시설관리 경력/신입 시장",gate:{}},
{id:"fm_major",name:"대기업계열 FM",icon:"◆",kind:"private",baseline:64,weights:{cert:18,career:25,experience:23,fit:18,education:11,language:5},note:"계열 FM사·대형사업장 기술직",gate:{}},
{id:"datacenter",name:"데이터센터 전기",icon:"▣",kind:"private",baseline:68,weights:{cert:18,career:27,experience:30,fit:17,education:5,language:3},note:"UPS·비상발전·수변전 등 실무 비중 큼",gate:{}},
{id:"public_worker",name:"공공기관 공무직",icon:"▤",kind:"public_worker",baseline:60,weights:{cert:32,career:22,experience:22,fit:18,education:3,language:3},note:"NCS 필기 없는 서류→면접형을 별도 평가",gate:{ncs:false}},
{id:"public_ncs",name:"공기업 일반 기술직",icon:"◎",kind:"public_ncs",baseline:68,weights:{cert:10,career:4,experience:6,fit:8,education:5,language:7,ncs:30,exam:30},note:"NCS·전공필기 영향이 큰 일반직",gate:{ncs:true}}
],
publicWorkerEvidence:[
{id:"pw_electric_2026",name:"2026 공공기관 시설관리(전기) 공무직 사례",employment:"공무직",education:"학력무관",process:["서류 정량·정성 5배수","면접 1배수"],ncsExam:false,certRule:"전기 관련 기능사 이상 우대",applicants:{day:54,shift:31},selectedDocs:5,confidence:"high",source:"JOB-ALIO 2026 상반기 공무직 시설관리(전기)",sourceUrl:"https://job.alio.go.kr/recruitview.do?idx=297477"},
{id:"kvic_facility_2026",name:"한국벤처투자 공무직(시설)",employment:"무기계약직",education:"학력무관",process:["공고별 전형"],ncsExam:false,certRule:"전기기능사 이상 국가기술자격 필수",confidence:"high",source:"JOB-ALIO 2026 2차 공무직(시설)",sourceUrl:"https://job.alio.go.kr/recruitview.do?idx=302925"},
{id:"kofic_facility_2026",name:"영화진흥위원회 공무직 시설관리",employment:"무기계약직",education:"학력무관",process:["서류","면접"],ncsExam:false,certRule:"소방설비기사(전기) 서류 3점 가점 사례",confidence:"high",source:"JOB-ALIO 2026 공무직 시설관리",sourceUrl:"https://job.alio.go.kr/recruitview.do?idx=301695"}
],
evaluate(seg,p,exam={}){
 let C=window.CAREER_SCORE,comp={cert:C.certLevel(p.certs),career:Math.min(96,Math.round(seg.kind==="public_ncs"?35+p.years*10:20+p.years*18)),experience:C.experienceLevel(p),education:C.educationLevel(p),fit:C.fitLevel(p),language:C.languageLevel(p),ncs:exam.ncs??null,exam:exam.exam??null};Object.keys(comp).forEach(k=>{if(comp[k]!=null&&!Number.isFinite(comp[k]))comp[k]=0});
 let sum=0,known=0,total=0;Object.entries(seg.weights).forEach(([k,w])=>{total+=w;if(comp[k]!=null){sum+=comp[k]*w;known+=w}});
 let score=Math.round(sum/(known||1)),caps=[];
 if(seg.kind==="public_ncs"&&(comp.ncs==null||comp.exam==null)){score=Math.min(score,45);caps.push("NCS·전공필기 미입력")}
 if(seg.kind==="public_worker"){let hasElec=[...p.certs].some(x=>["전기기능사","전기산업기사","전기기사","전기기능장"].includes(x));if(!hasElec)caps.push("전기 시설 공무직 일부 공고는 전기기능사 이상 필수/우대")}
 let gap=score-seg.baseline,level=gap>=10?"강함":gap>=0?"경쟁권":gap>=-10?"도전권":"보강 필요";
 return{score,baseline:seg.baseline,gap,level,caps,components:comp,coverage:Math.round(known/total*100)}
}
};