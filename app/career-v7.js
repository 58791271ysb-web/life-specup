const C=LifeSpecupCore,D=COMPANY_CAREER_DATA;let U=C.get("lifeSpecupUser",{}),V=C.get("lifeSpecupVerifiedCerts",[]),P=C.get("lifeSpecupCareerPrefs",{}),sim=new Set();
const EDU={unknown:0,high:1,college:2,university:3,graduate:4},OPIC={"":0,IL:1,IM1:2,IM2:3,IM3:4,IH:5,AL:6};
function certs(extra=sim){let a=new Set((U.certificates||[]).map(x=>x.name));V.filter(x=>x.status==="verified").forEach(x=>a.add(x.name));extra.forEach(x=>{if(!x.startsWith("_"))a.add(x)});return a}
function company(){return D.companies[targetCompany.value]||D.companies.s1}
function fillTracks(){let c=company(),old=companyTrack.value;companyTrack.innerHTML=Object.entries(c.tracks).map(([id,t])=>`<option value="${id}">${t.label}</option>`).join("");if([...companyTrack.options].some(o=>o.value===old))companyTrack.value=old;else if(P.companyTrack&&[...companyTrack.options].some(o=>o.value===P.companyTrack))companyTrack.value=P.companyTrack}
function profile(extra=sim){return{age:+age.value||0,years:(+relatedYears.value||0)+(extra.has("_y1")?1:0),toeic:+toeic.value||0,ts:extra.has("_lang")?Math.max(110,+toeicSpeaking.value||0):(+toeicSpeaking.value||0),opic:extra.has("_lang")?Math.max(1,OPIC[opic.value]||0):(OPIC[opic.value]||0),edu:extra.has("_edu")?Math.max(2,EDU[educationLevel.value]||0):(EDU[educationLevel.value]||0),major:majorRelated.value,facility:extra.has("_facility")?"strong":largeFacility.value,certs:certs(extra)}}
function track(){return company().tracks[companyTrack.value]||Object.values(company().tracks)[0]}
function companyCalc(extra=sim){let t=track(),p=profile(extra),items=[],eduNeed=EDU[t.educationMin]||0,eduOK=p.edu>=eduNeed,majorOK=p.major==="yes",langOK=!t.language||(p.ts>=t.language.toeicSpeaking||p.opic>=OPIC[t.language.opic]),careerOK=p.years>=t.careerMin,certHit=t.certs.filter(x=>p.certs.has(x));
items.push({id:"edu",name:"최종학력",hard:true,ok:eduOK,current:Object.keys(EDU).find(k=>EDU[k]===p.edu)||"미입력",target:t.educationMin==="college"?"2·3년제 이상":"공고 기준",weight:20,source:"공고"});
items.push({id:"major",name:"관련 전공",hard:true,ok:majorOK,current:p.major==="yes"?"관련 전공":"비관련/미입력",target:t.major.join(" · ")+" 관련 학과",weight:24,source:"공고"});
if(t.language)items.push({id:"language",name:"공인 영어회화",hard:true,ok:langOK,current:p.ts?`TOEIC Speaking ${p.ts}`:p.opic?`OPIc ${Object.keys(OPIC).find(k=>OPIC[k]===p.opic)}`:"미보유",target:`OPIc ${t.language.opic} 또는 TOEIC Speaking ${t.language.toeicSpeaking}+`,weight:18,source:"공고"});
items.push({id:"career",name:"관련경력",hard:t.careerMin>0,ok:careerOK,current:`${p.years}년`,target:t.careerMin?`${t.careerMin}년+`:`${t.hire} · 경력 필수 아님`,weight:t.careerMin?22:6,source:"공고"});
items.push({id:"cert",name:"관련 자격증",hard:t.certMode==="required",ok:certHit.length>0,current:certHit.join(" · ")||"미보유",target:t.certs.length?t.certs.join(" · "):"직무 관련 자격",weight:t.certMode==="preferred"?18:22,source:t.certMode==="preferred"?"우대":"경쟁력"});
items.push({id:"experience",name:"직무 경험의 질",hard:false,ok:p.facility==="strong",ratio:p.facility==="strong"?1:p.facility==="some"?.55:.15,current:p.facility==="strong"?"대형시설 직접운영":p.facility==="some"?"보조·일부 경험":"구체적 경험 미입력",target:t.tasks.join(" · "),weight:14,source:"직무내용"});
let hard=items.filter(i=>i.hard),eligible=hard.length?Math.round(hard.filter(i=>i.ok).length/hard.length*100):100;
let competitiveItems=items.filter(i=>!i.hard||i.id==="cert"||i.id==="experience"),raw=competitiveItems.reduce((s,i)=>s+i.weight*(i.ok?1:(i.ratio||0)),0),den=competitiveItems.reduce((s,i)=>s+i.weight,0),comp=den?Math.round(raw/den*70):35;
if(eligible===100)comp+=15;else comp-=Math.round((100-eligible)*.18);if(certHit.length)comp+=8;if(p.facility==="strong")comp+=5;comp=Math.max(5,Math.min(92,comp));
let trajectory=75;if(p.age&&p.age>=35&&p.years===0)trajectory=t.hire==="신입"?58:32;else if(p.years>=2)trajectory=82;
return{mode:"company",t,p,items,eligible,comp,trajectory,blockers:hard.filter(i=>!i.ok),certHit}}
function marketCalc(extra=sim){let p=profile(extra),core=["전기기사","전기산업기사"],hit=core.find(x=>p.certs.has(x)),need=companyTier.value==="large"?2:companyTier.value==="mid"?1:0,careerOK=p.years>=need,items=[{id:"cert",name:"핵심 전기자격",hard:companyTier.value!=="small",ok:!!hit,current:hit||"미보유",target:core.join(" 또는 "),weight:30,source:"시장모델"},{id:"career",name:"관련경력",hard:need>0,ok:careerOK,ratio:need?Math.min(1,p.years/need):1,current:`${p.years}년`,target:need?`${need}년+`:"경력무관 범위",weight:34,source:"시장모델"},{id:"experience",name:"현장경험",hard:false,ok:p.facility==="strong",ratio:p.facility==="strong"?1:p.facility==="some"?.55:.15,current:p.facility,target:"직접 운영 경험",weight:20,source:"추정"}],hard=items.filter(i=>i.hard),eligible=hard.length?Math.round(hard.filter(i=>i.ok).length/hard.length*100):100,raw=items.reduce((s,i)=>s+i.weight*(i.ok?1:(i.ratio||0)),0),den=items.reduce((s,i)=>s+i.weight,0),comp=Math.round(raw/den*80)-(companyTier.value==="large"?10:0);if(eligible<100)comp-=15;comp=Math.max(5,Math.min(90,comp));return{mode:"market",t:{label:"시장 평균 · "+role.value,confidence:"보통",year:"2024~2026"},p,items,eligible,comp,trajectory:p.years>=2?80:60,blockers:hard.filter(i=>!i.ok),certHit:hit?[hit]:[]}}
function calc(extra=sim){return analysisMode.value==="company"?companyCalc(extra):marketCalc(extra)}
function candidates(base){let ids=analysisMode.value==="company"?[...(base.t.certs||[]),"_facility","_lang","_edu","_y1"]:["전기기사","전기산업기사","_facility","_y1"],labels={_facility:"핵심 현장경험 확보",_lang:"공인 영어회화 기준 충족",_edu:"학력조건 충족",_y1:"관련경력 +1년"};return ids.filter(id=>!sim.has(id)&&!base.p.certs.has(id)).map(id=>{let e=new Set(sim);e.add(id),n=calc(e);return{id,label:labels[id]||id,delta:n.comp-base.comp,elig:n.eligible-base.eligible}}).filter(x=>x.delta>0||x.elig>0).sort((a,b)=>(b.elig-a.elig)||(b.delta-a.delta))}
function render(){let r=calc(),opts=candidates(r);analysisArea.style.display="block";eligibility.textContent=r.eligible+"%";fitScore.textContent=r.comp+"/100";trajectory.textContent=r.trajectory+"/100";confidence.textContent=r.t.confidence||"보통";evidenceCount.textContent=analysisMode.value==="company"?`최근 트랙 공고 ${r.t.year} · ${r.t.sources?.length||0}개 근거`:(companyTier.value==="public"?"공공채용 별도 모델":"2024~2026 시장 모델");
freshness.innerHTML=analysisMode.value==="company"?`<div class="freshness-card"><div><span>LIVE PROFILE</span><b>${company().name} · ${r.t.label}</b></div><div><small>근거기간</small><strong>2024~2026</strong></div><div><small>최근 트랙 데이터</small><strong>${r.t.year}</strong></div><div><small>신뢰도</small><strong>${r.t.confidence}</strong></div></div>`:`<div class="notice">특정 회사가 아닌 시장 평균 추정 모드입니다. 회사·채용트랙 모드보다 정확도가 낮습니다.</div>`;
verdict.innerHTML=`<div class="career-verdict"><div><p class="eyebrow">${analysisMode.value==="company"?"COMPANY TRACK":"MARKET MODEL"}</p><h2>${r.t.label}</h2><p>${r.eligible<100?"현재 확인된 지원조건 중 미충족 항목이 있습니다. 우대 스펙보다 먼저 지원자격을 확인해야 합니다.":r.comp>=65?"지원조건을 충족하고 경쟁력 요소도 비교적 잘 갖춘 상태입니다.":"지원조건과 실제 경쟁력은 다릅니다. 아래 우대·직무경험을 강화할 여지가 있습니다."} ${r.p.age>=35&&r.p.years===0?"나이는 직접 감점하지 않았으며, 관련경력 0년이라는 경력 궤적만 별도 해석합니다.":""}</p></div><div class="verdict-number"><small>COMPETITIVENESS</small><b>${r.comp}</b></div></div>`;
blocker.innerHTML=r.blockers.length?`<div class="blocker-box"><b>지원조건 확인 필요</b><p>${r.blockers.map(x=>`${x.name}: ${x.current} → ${x.target}`).join("<br>")}</p><small>공고에 명시된 조건은 자격증 가산점으로 상쇄하지 않습니다.</small></div>`:`<div class="ready-box">✓ 입력정보 기준으로 확인된 지원조건은 충족합니다. 이제 우대조건과 실제 직무경험을 비교합니다.</div>`;
requirements.innerHTML=r.items.map(i=>`<div class="req-row"><div class="req-state ${i.ok?"met":i.hard?"blocked":"gap"}">${i.ok?"✓":i.hard?"!":"△"}</div><div class="req-body"><div class="row-head"><b>${i.name}</b><span class="source-tag">${i.source}</span></div><div class="req-compare"><span>${i.current}</span><i>→</i><strong>${i.target}</strong></div></div><em>${i.hard?"지원조건":i.ok?"강점":"경쟁력"}</em></div>`).join("");
roadmap.innerHTML=opts.slice(0,5).map((o,i)=>`<div class="road-step"><span>${i+1}</span><div><b>${o.label}</b><p>${o.elig?`지원조건 +${o.elig}% · `:""}경쟁력 변화 +${o.delta}</p></div>${!o.id.startsWith("_")?`<button class="secondary smallbtn" onclick="startGoal('${o.id}')">목표로</button>`:""}</div>`).join("")||'<div class="empty">현재 모델에서 큰 단일 격차가 없습니다.</div>';
simOptions.innerHTML=opts.slice(0,7).map(o=>`<button class="sim-chip" onclick="toggleSim('${o.id}')">${o.label} <small>${o.delta>=0?"+":""}${o.delta}</small></button>`).join("");let clean=calc(new Set());beforeScore.textContent=clean.comp;afterScore.textContent=r.comp;simDelta.textContent=sim.size?`가상 변화 ${r.comp-clean.comp>=0?"+":""}${r.comp-clean.comp}점`:"스펙을 선택해 미래 상태를 비교하세요.";
let srcs=analysisMode.value==="company"?(r.t.sources||[]).map(id=>D.sources[id]).filter(Boolean):Object.values(D.sources);evidence.innerHTML=srcs.map(e=>`<div class="evidence-row"><span>${e.date}</span><div><b>${e.title}</b><p>${e.detail}</p></div><a href="${e.url}" target="_blank" rel="noopener">원문 ↗</a></div>`).join("");profileMini.innerHTML=`<p class="eyebrow">ANALYSIS TARGET</p><h3>${analysisMode.value==="company"?company().name:"시장 평균"}</h3><p>${r.t.label}</p><small>합격확률이 아닌 요구조건/경쟁력 분석</small>`};if(typeof renderFutureProfile==="function")renderFutureProfile()
function persist(){P={...P,analysisMode:analysisMode.value,targetCompany:targetCompany.value,companyTrack:companyTrack.value,companyTier:companyTier.value,age:+age.value||0,relatedYears:+relatedYears.value||0,toeic:+toeic.value||0,toeicSpeaking:+toeicSpeaking.value||0,opic:opic.value,educationLevel:educationLevel.value,majorRelated:majorRelated.value,largeFacility:largeFacility.value};C.set("lifeSpecupCareerPrefs",P)}
function toggleSim(id){sim.has(id)?sim.delete(id):sim.add(id);render();renderSpecLab()}function startGoal(n){sessionStorage.setItem("lifeSpecupSuggestedCert",n);location.href="quests.html"}
function modeUI(){document.querySelectorAll(".company-only").forEach(x=>x.style.display=analysisMode.value==="company"?"":"none");document.querySelectorAll(".market-only").forEach(x=>x.style.display=analysisMode.value==="market"?"":"none");render()}
role.innerHTML=D.marketFallback.roles.map(x=>`<option>${x}</option>`).join("");fillTracks();analysisMode.value=P.analysisMode||"company";age.value=P.age||"";relatedYears.value=P.relatedYears??U.careerYears??0;toeic.value=P.toeic||0;toeicSpeaking.value=P.toeicSpeaking||0;opic.value=P.opic||"";educationLevel.value=P.educationLevel||"unknown";majorRelated.value=P.majorRelated||"unknown";largeFacility.value=P.largeFacility||"none";companyTier.value=P.companyTier||"large";
analysisMode.onchange=modeUI;targetCompany.onchange=()=>{fillTracks();render()};companyTrack.onchange=()=>{sim.clear();render()};companyTier.onchange=render;role.onchange=render;analyze.onclick=()=>{persist();sim.clear();render()};saveProfile.onclick=()=>{persist();C.toast("경쟁력 정보를 저장했습니다.");render()};resetSim.onclick=()=>{sim.clear();render();renderSpecLab()};modeUI();
function renderUniverse(){
 let q=(companySearch.value||"").trim().toLowerCase(),st=companyStatus.value,sec=companySector.value;
 let arr=COMPANY_UNIVERSE.filter(c=>(st==="all"||c.status===st)&&(sec==="all"||c.sector===sec)&&(!q||(c.name+" "+c.category).toLowerCase().includes(q))).slice(0,48);
 let labels={verified:"검증 트랙",recent:"최근 공고",discovery:"조사 대기"};
 companyResults.innerHTML=arr.length?arr.map(c=>`<button class="company-tile ${c.status}" onclick="pickCompany('${c.name.replaceAll("'","")}')"><b>${c.name}</b><span>${c.category}</span><small>${labels[c.status]}</small></button>`).join(""):'<div class="empty">검색 결과가 없습니다.</div>';
 let pc=COMPANY_UNIVERSE.filter(x=>x.sector==="public").length;
 companyCount.textContent=`${COMPANY_UNIVERSE.length} TOTAL · ${pc} PUBLIC`;
}
function pickCompany(name){
 let verified=[...targetCompany.options].find(o=>o.textContent===name);
 if(verified){analysisMode.value="company";targetCompany.value=verified.value;fillTracks();modeUI();C.toast(`${name} 검증 트랙을 불러왔습니다.`)}
 else {analysisMode.value="market";modeUI();P.selectedUniverseCompany=name;let found=COMPANY_UNIVERSE.find(x=>x.name===name);P.selectedUniverseSector=found?.sector||"private";if(P.selectedUniverseSector==="public")companyTier.value="public";C.set('lifeSpecupCareerPrefs',P);render();renderSpecLab();C.toast(`${name}: ${P.selectedUniverseSector==="public"?"공공채용 준비도":"시장 벤치마크"}로 분석합니다.`)}
}
function renderBenchmark(){
 let tiers=FM_BENCHMARK.tiers;
 marketLadder.innerHTML=Object.entries(tiers).map(([k,t])=>`<div class="ladder-row"><span>${t.label}</span><b>${t.career[0]}${t.career[1]!==t.career[0]?`~${t.career[1]}`:""}년</b><div>${t.cert.join(" · ")}</div><small>${t.note}</small></div>`).join("");
 let p=profile(new Set()),cs=p.certs,article=cs.has("전기기사"),industrial=cs.has("전기산업기사"),synergy=["산업안전기사","소방설비기사(전기분야)","전기공사기사"].filter(x=>cs.has(x));
 let level,why;
 if(article&&p.years>=5){level="상위 FM 후보군";why="전기기사와 5년+ 관련경력 축이 있습니다. 대형시설 경험·복수자격·직무범위를 추가 비교해야 합니다."}
 else if(article&&p.years>=2){level="선임 가능권/경력 경쟁권";why="최근 표본의 전기기사+2년 요구 사례에 접근합니다. 상위 기업에서는 소방·안전·공사 및 현장경험이 차이를 만듭니다."}
 else if(industrial&&p.years<2){level="초기 경력권";why="산업기사 보유는 의미 있지만, 최근 상위 FM 표본에서 산업기사+3~4년 또는 별도 경력을 요구한 사례가 많아 1년 경력만으로 높은 경쟁력을 주지 않습니다."}
 else if(industrial){level="일반 FM 경쟁권";why="산업기사+경력 조합으로 지원 가능한 폭이 넓어지지만, 선임·상위 포지션은 경력연수와 기사급/복수역량을 추가 확인합니다."}
 else {level="진입 준비권";why="자격·경력 최소선부터 목표 트랙별로 확인하는 단계입니다."}
 profileBenchmark.innerHTML=`<div class="benchmark-verdict"><div><p class="eyebrow">YOUR MARKET POSITION</p><h3>${level}</h3><p>${why}</p><small>${P.selectedUniverseCompany?`탐색 목표: ${P.selectedUniverseCompany}`:""}</small></div><div><small>관련경력</small><b>${p.years}년</b><small>시너지 기사</small><b>${synergy.length}개</b></div></div><div class="notice">${FM_BENCHMARK.disclaimer} 실제 합격자 개인 스펙 분포가 공개되면 별도 ‘합격자 데이터’로만 표시합니다.</div>`;
}
companySearch.oninput=renderUniverse;companyStatus.onchange=renderUniverse;companySector.onchange=renderUniverse;

renderUniverse();renderBenchmark();
['change','input'].forEach(ev=>document.querySelector('.career-inputs')?.addEventListener(ev,()=>setTimeout(renderBenchmark,0)));


let virtualCerts=sim;
function ownedCerts(){return certs(new Set())}
function certLabel(n){let c=CERT_AI_V2.get(n);return `${n}${c?` (${c.tier})`:""}`}
function relevantCerts(){
 let q=(certSimSearch.value||"").trim().toLowerCase(),owned=ownedCerts(),years=+relatedYears.value||0;
 let arr=(window.CERTS||[]).filter(c=>!owned.has(c.name)&&!virtualCerts.has(c.name));
 if(certSimFilter.value==="electric")arr=arr.filter(c=>["전기·전자","소방·안전","기계·설비"].includes(c.category));
 if(q)arr=arr.filter(c=>(c.name+" "+c.category+" "+c.tier).toLowerCase().includes(q));
 arr=arr.map(c=>({...c,impact:CERT_AI_V2.marginal(c.name,new Set([...owned,...virtualCerts]),years),fit:CERT_AI_V2.fit(c.name)}));
 if(certSimFilter.value==="recommended")arr=arr.filter(c=>c.fit>=.38).sort((a,b)=>b.impact-a.impact||CERT_AI_V2.tier(b.name)-CERT_AI_V2.tier(a.name));
 else arr.sort((a,b)=>CERT_AI_V2.tier(b.name)-CERT_AI_V2.tier(a.name));
 return arr.slice(0,40)
}
function baseCareerScore(owned,years){return CERT_AI_V2.portfolio(owned,years).score}
function renderSpecLab(){
 let owned=ownedCerts(),years=+relatedYears.value||0,all=new Set([...owned,...virtualCerts]),before=baseCareerScore(owned,years),after=baseCareerScore(all,years);
 certSimList.innerHTML=relevantCerts().map(c=>`<button class="cert-sim-card" onclick="addVirtualCert('${c.name.replaceAll("'","")}')"><div><b>${c.name}</b><span class="tier-pill tier-${c.tier.replace("+","p").replace("-","m")}">${c.tier}</span></div><small>${c.category}</small><em>예상 영향 +${c.impact}</em></button>`).join("")||'<div class="empty">추가할 자격증이 없습니다.</div>';
 currentBuild.innerHTML=`<div class="build-score"><span>현재 시장 빌드</span><b>${before}</b></div><div class="build-certs">${[...owned].filter(n=>CERT_AI_V2.get(n)).slice(0,8).map(n=>`<span>${certLabel(n)}</span>`).join("")||"<small>등록된 관련 자격 없음</small>"}</div>`;
 futureBuild.innerHTML=`<div class="build-score future"><span>가상 빌드</span><b>${after}</b><em>${after-before>=0?"+":""}${after-before}</em></div><div class="build-certs">${virtualCerts.size?[...virtualCerts].map(n=>`<button onclick="removeVirtualCert('${n.replaceAll("'","")}')">${certLabel(n)} ×</button>`).join(""):"<small>왼쪽에서 자격증을 추가해보세요.</small>"}</div>`;
 if(virtualCerts.size){let last=[...virtualCerts].at(-1),m=CERT_AI_V2.marginal(last,new Set([...all].filter(x=>x!==last)),years);buildImpact.innerHTML=`<div class="impact-box"><b>${certLabel(last)} 취득 시 AI 해석</b><p>${CERT_AI_V2.explain(last,new Set([...all].filter(x=>x!==last)),years)}</p><div class="impact-meta"><span>현재 병목</span><strong>${years<2?"관련경력":"자격조합·현장경험"}</strong><span>한계효과</span><strong>+${m}</strong></div><button class="primary smallbtn" onclick="startGoal('${last.replaceAll("'","")}')">이 자격증을 실제 목표로</button></div>`}else buildImpact.innerHTML=`<div class="notice">예: 소방설비기사(전기)를 추가하면 등급(B+) 자체뿐 아니라 현재 전기자격과의 시너지, 경력 병목까지 반영해 변화 이유를 설명합니다.</div>`;
}
function addVirtualCert(n){virtualCerts.add(n);render();renderSpecLab()}
function removeVirtualCert(n){virtualCerts.delete(n);render();renderSpecLab()}
clearBuild.onclick=()=>{virtualCerts.clear();render();renderSpecLab()};certSimSearch.oninput=renderSpecLab;certSimFilter.onchange=renderSpecLab;
renderSpecLab();document.querySelector('.career-inputs')?.addEventListener('change',()=>setTimeout(renderSpecLab,0));



function renderFutureProfile(){
 if(typeof futureProfileSummary==="undefined")return;
 let p=profile(sim),base=profile(new Set()),added=[...sim].filter(x=>!x.startsWith("_")),extras=[];
 if(sim.has("_y1"))extras.push("관련경력 +1년");if(sim.has("_facility"))extras.push("대형시설 직접운영 경험");if(sim.has("_lang"))extras.push("영어회화 기준 강화");if(sim.has("_edu"))extras.push("학력 조건 강화");
 let market=CERT_AI_V2.portfolio(p.certs,p.years),baseMarket=CERT_AI_V2.portfolio(base.certs,base.years);
 let publicMode=companyTier.value==="public"||P.selectedUniverseSector==="public";
 let pub=PUBLIC_CAREER.readiness({certs:p.certs,years:p.years,major:p.major});
 futureProfileSummary.innerHTML=`<div class="future-hub-grid"><div class="future-avatar"><small>현재 → 미래</small><b>${baseMarket.score} <i>→</i> ${market.score}</b><span>민간 FM 포트폴리오 지수</span></div><div><small>가상 장착 자격</small><div class="future-tags">${added.length?added.map(n=>`<span>${certLabel(n)}</span>`).join(""):"<em>추가 자격 없음</em>"}</div><small>추가 성장</small><div class="future-tags">${extras.length?extras.map(x=>`<span>${x}</span>`).join(""):"<em>추가 조건 없음</em>"}</div></div><div class="public-readiness"><small>공공채용 해석</small><b>${pub.credential}/30 <em>자격·전공·경력축</em></b><p>${pub.note}</p></div></div>`;
}
function renderMarketAssets(){
 let owned=ownedCerts(),virtual=[...virtualCerts],focus=virtual.at(-1)||[...owned].find(n=>CERT_MARKET.get(n))||"전기기사",m=CERT_MARKET.get(focus),c=CERT_AI_V2.get(focus);
 let p=CERT_AI_V2.portfolio(new Set([...owned,...virtualCerts]),+relatedYears.value||0);
 if(!m){marketAssetPanel.innerHTML=`<div class="notice">이 자격증은 아직 공식 공급량 데이터 연결 전입니다. 도감등급과 직무 적합도만 사용하며 공급·희소성 평가는 보수적으로 처리합니다.</div>`;return}
 marketAssetPanel.innerHTML=`<div class="asset-head"><div><p class="eyebrow">LABOR MARKET ASSET</p><h3>${focus} <span>${c?.tier||"?"}</span></h3></div><div class="asset-year">Q-Net ${CERT_MARKET.officialYear}</div></div><div class="asset-metrics"><div><small>시장 수요</small><b>${CERT_MARKET.demandLabel[m.demand]}</b></div><div><small>신규 공급</small><b>${CERT_MARKET.supplyLabel[m.supply]}</b></div><div><small>2025 최종합격</small><b>${m.annualPass.toLocaleString()}명</b></div><div><small>희소성</small><b>${CERT_MARKET.scarcityLabel[m.scarcity]}</b></div></div><p>${m.note}</p><div class="portfolio-breakdown"><span>역량축 <b>${p.axes}개</b></span><span>하위자격 잔존가치 <b>${p.residual.toFixed(1)}</b></span><span>다양성 보너스 <b>${p.diversity.toFixed(1)}</b></span><span>경력 기여 <b>${p.career}</b></span></div>`;
}
const _renderSpecLab=renderSpecLab;
renderSpecLab=function(){_renderSpecLab();renderMarketAssets();renderFutureProfile()};
renderSpecLab();
