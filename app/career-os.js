let U=CAREER_STORE.normalize(JSON.parse(localStorage.getItem("lifeSpecupUser")||"{}"));localStorage.setItem("lifeSpecupUser",JSON.stringify(U));
let future={years:0,certs:new Set(),facility:null},saved=JSON.parse(localStorage.getItem("lifeSpecupCareerProfile")||"{}");
const $=id=>document.getElementById(id),esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function certSet(){return new Set((U.certificates||[]).map(x=>x.name))}
function profile(extra=future){let edu=/대학교|대학원/.test(U.education||"")?3:/전문대/.test(U.education||"")?2:1,opic={IL:1,IM1:2,IM2:3,IM3:4,IH:5,AL:6};return{certs:new Set([...certSet(),...extra.certs]),years:CAREER_STORE.totalMonths(U)/12+(extra.years||0),facility:extra.facility||saved.largeFacility||"none",edu,major:saved.majorRelated||"unknown",toeic:+saved.toeic||0,ts:+saved.toeicSpeaking||0,opic:opic[saved.opic]||0}}
function org(){return COMPANY_UNIVERSE.find(x=>x.id===osCompany.value)||COMPANY_UNIVERSE[0]}
function tracks(){return JOB_MARKET.get(org())}
function track(){return tracks().find(x=>x.id===osTrack.value)||tracks()[0]}
function populate(){let target=U.targetCompanyId||"co001";osCompany.innerHTML=COMPANY_UNIVERSE.map(x=>`<option value="${x.id}" ${x.id===target?"selected":""}>${x.name}</option>`).join("");syncTracks()}
function syncTracks(){let a=tracks();osTrack.innerHTML=a.map(x=>`<option value="${x.id}">${x.name}</option>`).join("");render()}
function exam(){return{ncs:saved.ncs?+saved.ncs:null,exam:saved.majorExam?+saved.majorExam:null}}
function evaluate(extra=future){return CAREER_SCORE.evaluate(track(),profile(extra),exam())}
function draw(vals,base){let cv=osRadar,ctx=cv.getContext("2d"),cx=cv.width/2,cy=cv.height/2+5,R=100,keys=["자격","경력","실무","학력","직무","어학"],arr=[vals.cert,vals.career,vals.experience,vals.education,vals.fit,vals.language];ctx.clearRect(0,0,cv.width,cv.height);ctx.textAlign="center";ctx.font="12px sans-serif";for(let q=1;q<=4;q++){ctx.beginPath();for(let i=0;i<6;i++){let a=-Math.PI/2+i*Math.PI/3,r=R*q/4,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath();ctx.strokeStyle="#263b58";ctx.stroke()}function poly(v,stroke,fill){ctx.beginPath();v.forEach((n,i)=>{let a=-Math.PI/2+i*Math.PI/3,r=R*Math.min(100,n||0)/100,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.closePath();ctx.strokeStyle=stroke;ctx.fillStyle=fill;ctx.fill();ctx.stroke()}poly(Array(6).fill(base),"#66758b","rgba(100,110,130,.06)");poly(arr,"#8ab4ff","rgba(100,150,240,.2)");keys.forEach((k,i)=>{let a=-Math.PI/2+i*Math.PI/3;ctx.fillStyle="#9fb1c9";ctx.fillText(k,cx+Math.cos(a)*(R+30),cy+Math.sin(a)*(R+24)+4)})}
function moveCandidates(p){let t=track(),items=[];[["관련경력 +1년",{years:1}],["관련경력 +2년",{years:2}],["전기기사",{cert:"전기기사"}],["전기산업기사",{cert:"전기산업기사"}],["대형시설 직접운영",{facility:"strong"}],["소방전기",{cert:"소방설비기사(전기분야)"}]].forEach(([name,ch])=>{let m=CAREER_SCORE.marginal(t,p,ch,exam());if(m.delta>0)items.push({name,delta:m.delta})});return items.sort((a,b)=>b.delta-a.delta).slice(0,3)}
function render(){
 let o=org(),t=track(),p=profile({years:0,certs:new Set(),facility:null}),a=CAREER_SCORE.evaluate(t,p,exam()),f=evaluate();
 osEvidence.innerHTML=`<span class="confidence conf-${t.confidence}">신뢰도 ${t.confidence==="high"?"높음":t.confidence==="medium"?"보통":"낮음"}</span><small>${esc(t.evidence)}</small>${t.sourceUrl?`<a class="source-link" href="${t.sourceUrl}" target="_blank">근거 공고 보기 ↗</a>`:""}`;
 osScore.textContent=a.score;osBase.textContent=a.baseline;osGap.textContent=`GAP ${a.gap>=0?"+":""}${a.gap} · ${a.position}`;osRange.textContent=`AI 추정범위 ${a.range[0]}–${a.range[1]} · 데이터 커버리지 ${a.coverage}%`;
 osGate.innerHTML=a.caps.length?`<div class="gate warn">⚠ ${a.caps.map(esc).join(" · ")}</div>`:`<div class="gate good">✓ 확인된 핵심요건상 치명적 미달 없음</div>`;
 draw(a.components,a.baseline);
 osMoves.innerHTML=moveCandidates(p).map((x,i)=>`<div class="move"><b>${i+1}</b><span>${x.name}</span><strong>예상 +${x.delta}</strong></div>`).join("")||'<p class="sub">현재 입력만으로 우선순위를 계산하기 어렵습니다.</p>';
 let labels={cert:"자격",career:"관련경력",experience:"실무환경",education:"학력·전공",fit:"직무적합",language:"어학",ncs:"NCS",exam:"전공필기"};
 osBreakdown.innerHTML=Object.entries(t.axes).map(([k,w])=>`<div class="break-row"><span>${labels[k]}</span><div><i style="width:${a.components[k]??0}%"></i></div><b>${a.components[k]??"미입력"}</b><small>비중 ${w}%</small></div>`).join("")+`<p class="score-note">※ ${t.confidence==="high"?"최근 확인된 채용트랙을 우선 반영":"회사 고유 합격자 데이터가 부족해 동종시장 모델을 사용"}했습니다. 이 수치는 실제 합격확률이 아닙니다.</p>`;
 let cur=CAREER_STORE.current(U),yrs=(CAREER_STORE.totalMonths(U)/12).toFixed(1);osProfile.innerHTML=`<div class="profile-facts"><span>현재직무 <b>${esc(cur?.job||U.currentJob||"미설정")}</b></span><span>관련경력 <b>${yrs}년</b></span><span>자격 <b>${[...certSet()].join(", ")||"없음"}</b></span><span>경력 기준일 <b>${CAREER_STORE.dateKey()}</b></span></div>`;
 futureNow.textContent=a.score;futureScore.textContent=f.score;futureDelta.textContent=`${f.score-a.score>=0?"+":""}${f.score-a.score}`;futureText.textContent=`관련경력 +${future.years}년${future.certs.size?" · "+[...future.certs].join(", "):""}${future.facility?" · 대형시설 경험":""}`;
 [...document.querySelectorAll(".choice-row button")].forEach(b=>b.classList.toggle("selected",(b.dataset.y&&+b.dataset.y===future.years)||(b.dataset.cert&&future.certs.has(b.dataset.cert))||(b.dataset.exp&&future.facility===b.dataset.exp)));
 U.targetCompanyId=o.id;localStorage.setItem("lifeSpecupUser",JSON.stringify(U))
}
osCompany.onchange=syncTracks;osTrack.onchange=render;
careerChoices.onclick=e=>{let b=e.target.closest("[data-y]");if(!b)return;future.years=future.years===+b.dataset.y?0:+b.dataset.y;render()};
certChoices.onclick=e=>{let b=e.target.closest("[data-cert]");if(!b)return;future.certs.has(b.dataset.cert)?future.certs.delete(b.dataset.cert):future.certs.add(b.dataset.cert);render()};
expChoices.onclick=e=>{let b=e.target.closest("[data-exp]");if(!b)return;future.facility=future.facility===b.dataset.exp?null:b.dataset.exp;render()};
resetFuture.onclick=()=>{future={years:0,certs:new Set(),facility:null};render()};
function listCompanies(q=""){let f=COMPANY_UNIVERSE.filter(x=>x.name.toLowerCase().includes(q.toLowerCase())).slice(0,60);companyList.innerHTML=f.map(x=>`<button data-id="${x.id}"><b>${x.name}</b><span>${x.category}</span><small>신뢰도 ${x.research?.confidence==="high"?"높음":x.research?.confidence==="medium"?"보통":"낮음"}</small></button>`).join("")}
companySearch.oninput=()=>listCompanies(companySearch.value);companyList.onclick=e=>{let b=e.target.closest("[data-id]");if(!b)return;osCompany.value=b.dataset.id;syncTracks();scrollTo({top:0,behavior:"smooth"})};listCompanies();populate();