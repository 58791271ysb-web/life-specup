(()=>{
const $=id=>document.getElementById(id); if(!$('mobilityMap')) return;
const safe=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const certNames=()=>{const out=new Set(); const scan=v=>{if(!v)return;if(Array.isArray(v))v.forEach(scan);else if(typeof v==='object'){if(v.name&&(/기사|산업기사|기능사/.test(v.name))&&(v.status==='owned'||v.status==='certified'||v.owned===true))out.add(v.name);Object.values(v).forEach(scan)}}; ['lifeSpecupProfile','lifeSpecupCerts','lifeSpecupCertificates','lifeSpecupLifeData'].forEach(k=>scan(safe(k,null))); return out};
const career=()=>{let months=0, management=0, docs=0, technical=0; const scan=v=>{if(!v)return;if(Array.isArray(v))v.forEach(scan);else if(typeof v==='object'){let a=v.startDate||v.start||v.joinDate, b=v.endDate||v.end||new Date().toISOString().slice(0,10); if(a&&/^\\d{4}-\\d{2}/.test(a)){let A=new Date(a),B=new Date(b); if(!isNaN(A)&&!isNaN(B)) months=Math.max(months,Math.max(0,(B-A)/2629800000))} const t=JSON.stringify(v); if(/협력|업체|발주|견적|관리감독|PM|보고/.test(t))management++; if(/엑셀|PPT|보고서|CAD|도면/.test(t))docs++; if(/수변전|전기|UPS|발전기|점검|설비/.test(t))technical++; Object.values(v).forEach(scan)}}; scan(safe('lifeSpecupProfile',{})); scan(safe('lifeSpecupCareerHistory',{})); return {months,management,docs,technical}};
const cs=certNames(), c=career(), hasElec=[...cs].some(x=>/전기기사$|전기산업기사$/.test(x)), hasEngineer=[...cs].some(x=>x==='전기기사'), years=c.months/12;
const tracks=[
 {n:'전문 FM · 전기운영',d:'현장기술을 유지하면서 더 체계적인 운영조직으로 이동',need:[['전기 자격',hasElec],['관련경력 1년',years>=1]],base:hasElec?58:35},
 {n:'자회사 · 직영 시설팀',d:'고용구조와 사업장 소속 안정성을 높이는 이동',need:[['전기 자격',hasElec],['관련경력 1년+',years>=1],['문서·보고 경험',c.docs>0]],base:hasElec?54:30},
 {n:'PM · 운영관리',d:'직접 작업보다 협력사·공사·예산·보고 관리 비중 확대',need:[['관련경력 2년+',years>=2],['업체·공사 관리',c.management>0],['문서·보고 역량',c.docs>0]],base:years>=1?43:25},
 {n:'전기안전 · 책임운영',d:'법정선임과 전기 전문성을 중심으로 책임 범위 확대',need:[['전기기사',hasEngineer],['자격 후 인정경력',false]],base:hasEngineer?48:30,legal:true},
 {n:'공장 Utility · 공무',d:'생산시설 전력·설비 운영으로 전기 경력의 전문성 확대',need:[['전기 자격',hasElec],['설비 실무',c.technical>0],['관련경력',years>=1]],base:hasElec?50:30},
 {n:'전기공사 · 공무/관리',d:'공사·견적·도면·협력업체 관리 쪽으로 전환',need:[['전기계열 자격',hasElec],['도면·문서 경험',c.docs>0],['공사 경험',c.management>0]],base:hasElec?46:28}
];
const score=t=>{let ok=t.need.filter(x=>x[1]).length, s=Math.min(88,Math.round(t.base+ok/t.need.length*25)); return s};
const label=s=>s>=75?'지금 적극 도전':s>=58?'지원권 진입':s>=42?'조금 더 준비':'중기 목표';
$('mobilitySummary').innerHTML=`<div class="mobility-summary"><div><small>CURRENT POSITION</small><b>${hasElec?'전기 자격 기반 현장 실무':'현장 실무'}</b><span>관련경력 약 ${Math.max(0,Math.floor(c.months))}개월</span></div><div><small>판단 기준</small><b>회사 크기 ≠ 커리어 상승</b><span>고용구조·역할·전문성·이직가치 중심</span></div></div>`;
$('mobilityMap').innerHTML=tracks.map(t=>{let s=score(t);return `<article class="mobility-track"><div class="mobility-head"><div><b>${t.n}</b><small>${t.d}</small></div><strong>${label(s)}</strong></div><div class="mobility-meter"><i style="width:${s}%"></i></div><div class="mobility-needs">${t.need.map(x=>`<span class="${x[1]?'ok':'gap'}">${x[1]?'✓':'○'} ${x[0]}</span>`).join('')}</div>${t.legal?'<p>※ 선임 가능 여부는 자격 취득일·인정경력·설비 범위를 별도 법정 엔진에서 확인합니다.</p>':''}</article>`}).join('');
let gaps={};tracks.forEach(t=>t.need.forEach(([n,ok])=>{if(!ok)gaps[n]=(gaps[n]||0)+1})); let top=Object.entries(gaps).sort((a,b)=>b[1]-a[1]).slice(0,3);
$('mobilityActions').innerHTML=`<b>NEXT BEST MOVES</b>${top.map(([n])=>`<span>${n}</span>`).join('')}<small>점수는 합격확률이 아니라 다음 이동을 비교하기 위한 탐색 지표입니다.</small>`;
})();
