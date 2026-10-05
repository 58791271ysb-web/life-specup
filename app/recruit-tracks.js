window.RECRUIT_TRACKS={
updated:"2026-10-05",
byCompany:{
"에스원":[{id:"s1_4fm",name:"4급 신입 · 빌딩시설관리(FM)",year:2026,type:"신입",source:"공식/최근",confidence:"high",baseline:62,baselineType:"채용요건 기준선",needs:["관련 전기·시설 자격","FM 직무적합","시설 실무 이해"]},{id:"s1_3fm",name:"3급 신입 · 빌딩시설관리(FM)",year:2026,type:"신입",source:"공식",confidence:"high",baseline:68,baselineType:"채용요건 기준선",needs:["학사급 채용요건","공인어학","FM 직무적합"]}],
"S&I Corp.":[{id:"si_fme",name:"FM 전기 · 경력",year:2026,type:"경력",source:"최근공고",confidence:"high",baseline:65,baselineType:"채용요건 기준선",needs:["전기 관련 자격","관련경력 2년+ 트랙 존재","전기설비 운영"]},{id:"si_safety",name:"전기안전관리 · 선임",year:2026,type:"경력",source:"최근공고",confidence:"high",baseline:72,baselineType:"채용요건 기준선",needs:["전기기사/산업기사","선임 가능 경력","전기안전관리 실무"]}],
"SK하이닉스":[{id:"skh_util",name:"Utility기술(전기·제어) · 기술사무직 신입",year:2026,type:"신입",source:"SK Careers",confidence:"high",baseline:70,baselineType:"채용요건 기준선",needs:["전기·제어 전공지식","Utility 직무적합","기술 문제해결"]}],
"인천국제공항공사":[{id:"airport_e",name:"일반직 · 전기",year:2026,type:"신입",source:"공식 채용공고/직무기술서",confidence:"high",baseline:68,baselineType:"전형요건 기준선",needs:["전기 직무지식","NCS/필기","자격증·어학 우대"]}],
"한국철도공사":[{id:"korail_e",name:"신입 · 전기통신",year:2026,type:"신입",source:"공식 채용공고",confidence:"high",baseline:66,baselineType:"전형요건 기준선",needs:["전기통신 직무지식","NCS·전공 필기","자격증 가점"]}],
"한국전력공사":[{id:"kepco_e",name:"신입 · 전기",year:2026,type:"신입",source:"공식 채용정보",confidence:"high",baseline:70,baselineType:"공개 전형 기반 기준선",needs:["전기 직무지식","NCS·전공","공고별 자격·어학"]}],
"한전KPS":[{id:"kps_e",name:"G4 기술직 · 전기",year:2026,type:"신입",source:"공식 채용제도",confidence:"high",baseline:68,baselineType:"전형요건 기준선",needs:["전기 직무자격","NCS","전공 필기"]}],
"삼성전자":[{id:"sec_infra",name:"3급 신입 · 인프라기술",year:2026,type:"신입",source:"공식 채용체계",confidence:"high",baseline:72,baselineType:"채용요건 기준선",needs:["관련 전공·직무역량","인프라 기술 이해","직무적합성"]}],
"NAVER Cloud":[{id:"ncp_dc",name:"데이터센터 · 전기 인프라 구축/운영",year:2026,type:"경력",source:"공식 채용공고",confidence:"high",baseline:72,baselineType:"채용요건 기준선",needs:["데이터센터 전력 인프라","관련 실무경력","전기설비 구축·운영"]}]
},
get(name){return this.byCompany[name]||[]},
defaultFor(org){let a=this.get(org.name);if(a.length)return a;let pub=org.sector==="public";return[{id:"model",name:`${org.category} · ${pub?"기술직":"전기/시설 직무"} 시장모델`,year:"2024~2026",type:"시장모델",source:"직무군 모델",confidence:org.research?.confidence||"low",baseline:pub?64:60,baselineType:"시장 요구역량 기준선",needs:pub?["직무 자격","NCS·전공 준비","기관별 가점 확인"]:["핵심 전기자격","관련직무 경력","직접 실무경험"]}]}
};