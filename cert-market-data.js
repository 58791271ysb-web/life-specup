window.CERT_MARKET={
updated:"2026-10-05",officialYear:2025,
verified:{
"전기기사":{annualPass:13918,supply:"very_high",demand:"very_high",legal:"very_high",scarcity:"low",role:"core",note:"핵심 자격이지만 신규 합격자 공급도 매우 큼. 단독 보유보다 경력·선임·복수역량에서 차별화.",source:"Q-Net 2025"},
"전기산업기사":{annualPass:5183,supply:"high",demand:"high",legal:"high",scarcity:"mid_low",role:"core",note:"실무·선임 경로에 가치가 있으나 기사 보유 시 핵심가치는 대부분 상위자격에 흡수.",source:"Q-Net 2025"},
"전기기능사":{annualPass:22241,supply:"very_high",demand:"mid",legal:"low",scarcity:"very_low",role:"entry",note:"진입 신호로 유효하지만 다수 보유가 상위 기사·경력을 대체하지 않음.",source:"Q-Net 2025"},
"산업안전기사":{annualPass:31247,supply:"very_high",demand:"high",legal:"high",scarcity:"very_low",role:"synergy",note:"수요와 활용 폭은 넓지만 신규 공급도 매우 큼. 전기·생산·공장 직무에서 시너지 자격으로 평가.",source:"Q-Net 2025"},
"소방설비기사(전기분야)":{annualPass:7625,supply:"high",demand:"high",legal:"high",scarcity:"mid_low",role:"synergy",note:"전기 FM에서 소방 역량축을 추가. 전기기사와 다른 계열이므로 중복보다 시너지로 평가.",source:"Q-Net 2025"}
},
supplyPenalty:{very_high:.72,high:.82,mid:.9,low:.97},
scarcityLabel:{very_low:"매우 낮음",low:"낮음",mid_low:"낮음~보통",mid:"보통",high:"높음"},
supplyLabel:{very_high:"매우 많음",high:"많음",mid:"보통",low:"적음"},
demandLabel:{very_high:"매우 높음",high:"높음",mid:"보통",low:"낮음"},
get(name){return this.verified[name]||null}
};