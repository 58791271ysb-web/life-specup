window.JOB_MARKET={
updated:"2026-10-05",
tracks:{
"에스원":[
{id:"s1_4",name:"4급 신입 · 빌딩시설관리(FM)",type:"신입",confidence:"high",baseline:62,requirements:{minYears:0,certAny:["전기기사","전기산업기사","전기기능사"],certMode:"preferred"},axes:{cert:22,career:12,experience:18,education:15,fit:23,language:10},evidence:"최근 공식 계열 채용트랙/직무정보"},
{id:"s1_3",name:"3급 신입 · 빌딩시설관리(FM)",type:"신입",confidence:"high",baseline:68,requirements:{minYears:0,certAny:["전기기사","전기산업기사"],certMode:"preferred"},axes:{cert:16,career:8,experience:16,education:22,fit:23,language:15},evidence:"공식 계열 채용트랙"}
],
"현대엔지니어링":[
{id:"he_fm",name:"자산관리사업본부 · FM 전기(상시)",type:"경력",confidence:"high",baseline:60,requirements:{minYears:0,certAny:["전기기사","전기산업기사"],certMode:"preferred"},axes:{cert:20,career:30,experience:25,education:7,fit:15,language:3},evidence:"2026 상시 FM 전기: 경력직·계약직(정규직 전환 가능), 공개 페이지에 최소연수 미표기",sourceUrl:"https://www.jobkorea.co.kr/Recruit/GI_Read/49531227"},
{id:"he_round",name:"순회사무소 · FM전기",type:"경력",confidence:"high",baseline:64,requirements:{minYears:3,certAny:["전기기사","전기산업기사"],certMode:"preferred"},axes:{cert:18,career:34,experience:28,education:5,fit:13,language:2},evidence:"2026.09 순회사무소 공고: FM전기, 경력 3년 이상, 관련 자격증 우대, 계약직",sourceUrl:"https://m.jobkorea.co.kr/Recruit/GI_Read/50019259"},
{id:"he_evc",name:"자산관리사업본부 · 전기(EVC)",type:"경력",confidence:"high",baseline:64,requirements:{minYears:1,certAny:["전기기사","전기산업기사"],certMode:"preferred"},axes:{cert:20,career:30,experience:27,education:7,fit:13,language:3},evidence:"2026 전기(EVC) 경력직 공고"}
],
"S&I Corp.":[
{id:"si_fm",name:"FM전기 · 서울 서초",type:"신입·경력",confidence:"high",baseline:55,requirements:{minYears:0,certAny:["전기기사","전기산업기사"],certMode:"preferred"},axes:{cert:24,career:20,experience:25,education:6,fit:22,language:3},evidence:"2026 FM전기 공고: 경력무관(신입 포함), 학력무관",sourceUrl:"https://www.jobkorea.co.kr/Recruit/GI_Read/49798056"},
{id:"si_mgr",name:"전기안전관리 · 선임형",type:"경력",confidence:"medium",baseline:68,requirements:{minYears:2,certAny:["전기기사","전기산업기사"],certMode:"required"},axes:{cert:20,career:32,experience:27,education:5,fit:14,language:2},evidence:"최근 전기안전관리 경력 공고군"}
],
"한국철도공사":[{id:"korail",name:"신입 · 전기통신",type:"신입",confidence:"high",baseline:65,public:true,requirements:{minYears:0,certAny:[],certMode:"bonus"},axes:{cert:12,career:3,experience:5,education:5,fit:10,language:5,ncs:30,exam:30},evidence:"2026 하반기 공식: 전기통신 포함, 학력·전공 제한 없음, 직렬 자격증 우대",sourceUrl:"https://job.alio.go.kr/mobile2021/recruit/recruitView.do?idx=303642"}],
"한국전력공사":[{id:"kepco",name:"신입 · 전기",type:"신입",confidence:"high",baseline:70,public:true,requirements:{minYears:0,certAny:[],certMode:"bonus"},axes:{cert:12,career:3,experience:5,education:5,fit:10,language:5,ncs:30,exam:30},evidence:"공식 채용 단계별 본인점수·서류/필기 커트라인 공개 체계"}],
"SK하이닉스":[{id:"skh",name:"Utility기술(전기·제어)",type:"신입",confidence:"high",baseline:70,requirements:{minYears:0,certAny:["전기기사","전기산업기사"],certMode:"preferred"},axes:{cert:13,career:8,experience:18,education:22,fit:30,language:9},evidence:"2026 공식 Utility기술(전기·제어) 신입 트랙"}],
"NAVER Cloud":[{id:"naver",name:"데이터센터 · 전기 인프라 구축/운영",type:"경력",confidence:"high",baseline:70,requirements:{minYears:2,certAny:["전기기사","전기산업기사"],certMode:"preferred"},axes:{cert:17,career:30,experience:30,education:6,fit:14,language:3},evidence:"2026 데이터센터 전기 인프라 경력 트랙"}]
},
fallback(org){let pub=org.sector==="public";return{id:"market",name:`${org.category} · ${pub?"기술직":"전기/시설"} 시장모델`,type:pub?"공공":"시장",confidence:"low",baseline:pub?64:58,public:pub,requirements:{minYears:pub?0:1,certAny:["전기기사","전기산업기사"],certMode:"preferred"},axes:pub?{cert:12,career:4,experience:6,education:5,fit:8,language:5,ncs:30,exam:30}:{cert:20,career:28,experience:25,education:7,fit:17,language:3},evidence:"2024~2026 동종 직무군 모델 — 회사 고유조건 아님"}},
get(org){return this.tracks[org.name]||[this.fallback(org)]}
};