window.PUBLIC_CAREER={
updated:"2026-10-05",
segments:[
{id:"facility",name:"시설공단·도시공사",focus:"NCS·전공시험·직렬 적합",examples:["서울시설공단","인천시설공단","부산시설공단","서울주택도시공사"]},
{id:"energy",name:"전력·에너지 공기업",focus:"NCS·전공·기사 가점/직무역량",examples:["한국전력공사","한국수력원자력","한국전기안전공사","한전KPS"]},
{id:"transport",name:"철도·공항·교통",focus:"전기 직렬·NCS·전공·현장시설",examples:["한국철도공사","인천국제공항공사","서울교통공사","국가철도공단"]},
{id:"safety",name:"안전·검사기관",focus:"관련 기사·법규·검사 직무",examples:["한국전기안전공사","한국산업안전보건공단","한국승강기안전공단","한국가스안전공사"]}
],
evidence:[
{org:"서울시설공단",date:"2024",fact:"일반직 기술 전기 직렬에서 전기자기학·전기기기 전공시험과 NCS 직업기초능력 평가 구조 확인",confidence:"high",source:"서울특별시 공식 채용공고"},
{org:"서울시설공단",date:"2025-09",fact:"직무중심 일반직 2차 사무·기술 공개채용 실시",confidence:"high",source:"서울특별시 공식 채용공고"},
{org:"서울시설공단",date:"2026-09",fact:"직무중심 일반직 2차 사무·기술 공개채용 공고",confidence:"high",source:"서울특별시 공식 채용공고"}
],
readiness(profile){
 let cert=profile.certs.has("전기기사")?18:profile.certs.has("전기산업기사")?12:profile.certs.has("전기기능사")?5:0;
 let major=profile.major==="yes"?10:0,exp=Math.min(10,profile.years*2);
 return {credential:Math.min(30,cert+major+exp),exam:null,ncs:null,total:null,note:"공공채용은 자격증만으로 경쟁력을 확정할 수 없습니다. NCS·전공시험·가점·직렬별 지원요건을 함께 입력해야 종합 준비도를 계산합니다."}
}};