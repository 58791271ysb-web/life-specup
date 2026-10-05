let user=JSON.parse(localStorage.getItem("lifeSpecupUser")||"{}");
let verified=JSON.parse(localStorage.getItem("lifeSpecupVerifiedCerts")||"[]"),state=JSON.parse(localStorage.getItem("lifeSpecupState")||'{"xp":0,"history":[]}'),emState=JSON.parse(localStorage.getItem("lifeSpecupEmblems")||'{"owned":[],"equipped":[]}');
state.history=state.history||[];emState.owned=emState.owned||[];emState.equipped=emState.equipped||[];
const xpMap=Object.fromEntries(CERTS.map(c=>[c.name,c.xp])),emblemMap={'전기기능사':'cert-electric-craftsman','전기산업기사':'cert-electric-industrial','전기기사':'cert-electric-engineer'};
function persistUser(){CAREER_HISTORY.syncUser(user);localStorage.setItem("lifeSpecupUser",JSON.stringify(user))}
function save(){localStorage.setItem("lifeSpecupVerifiedCerts",JSON.stringify(verified));localStorage.setItem("lifeSpecupState",JSON.stringify(state));localStorage.setItem("lifeSpecupEmblems",JSON.stringify(emState));persistUser();render()}
function toast(m){let e=document.querySelector("#toast");e.textContent=m;e.classList.add("show");setTimeout(()=>e.classList.remove("show"),1800)}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function opt(arr,v){return arr.map(x=>`<option ${x===v?"selected":""}>${x}</option>`).join("")}
function render(){
 CAREER_HISTORY.syncUser(user);let cur=CAREER_HISTORY.currentEntry(user),months=CAREER_HISTORY.totalRelevantMonths(user);
 avatar.textContent=(user.nickname||"U")[0];nick.textContent=user.nickname||"플레이어";
 currentStatus.innerHTML=`<div class="status"><div><dt>현재 직무</dt><dd>${esc(cur?.jobTitle||user.currentJob||"미설정")}</dd></div><div><dt>고용형태</dt><dd>${esc(cur?.employmentType||user.employmentType||"미설정")}</dd></div><div><dt>회사 유형</dt><dd>${esc(cur?.companyType||user.currentCompanyType||"미설정")}</dd></div><div><dt>관련직무 총경력</dt><dd>${months?CAREER_HISTORY.roundYears(months)+"년 · "+CAREER_HISTORY.durationLabel(months):"미설정"}</dd></div></div>`;
 targetStatus.innerHTML=`<div class="status"><div><dt>목표 직무</dt><dd>${esc(user.goalJob||"미설정")}</dd></div><div><dt>목표 기업</dt><dd>${esc(user.companyType||"미설정")}</dd></div><div><dt>채용 학력요건</dt><dd>${esc(user.track||"미설정")}</dd></div><div><dt>채용 유형</dt><dd>${esc(user.hireType||"미설정")}</dd></div></div>`;
 equipped.innerHTML=emState.equipped.map(id=>{let e=EMBLEMS.find(x=>x.id===id);return e?`<span class="mini-emblem tone-${e.tone}" title="${e.name}">${e.icon}</span>`:""}).join("");
 renderCareer();
 let claimed=(user.certificates||[]).map(c=>c.name),names=[...new Set([...claimed,...verified.map(v=>v.name)])];myCerts.innerHTML=names.length?names.map(n=>{let v=verified.find(x=>x.name===n),status=v?.status||"unverified";return `<div class="row-card"><div class="row-head"><div><b>${n}</b><div class="muted">${status==="verified"?"✓ 인증 완료 · XP 지급 완료":status==="pending"?"⏳ 증빙 검증 대기":"보유 입력 · 증빙 미인증"}</div></div><span class="${status==="verified"?"good":status==="pending"?"warn":"muted"}">${status==="verified"?"VERIFIED":status==="pending"?"PENDING":"UNVERIFIED"}</span></div></div>`}).join(""):'<p class="sub">등록한 자격증이 아직 없습니다.</p>';
 let pending=verified.filter(v=>v.status==="pending");devVerify.innerHTML=pending.length?`<div class="notice" style="margin-top:14px"><b>MVP 개발용</b><br>실제 AI 검증 서버 연결 전이므로 아래 버튼은 흐름 테스트용입니다.</div>`+pending.map(v=>`<button class="secondary" style="margin-top:8px" onclick="approve('${v.name}')">${v.name} 테스트 승인</button>`).join(" "):"";
}
function renderCareer(){
 let h=CAREER_HISTORY.get(user),months=CAREER_HISTORY.totalRelevantMonths(user),cur=CAREER_HISTORY.currentEntry(user);
 careerSummary.innerHTML=`<div class="career-summary-grid"><div><small>관련직무 총경력</small><b>${CAREER_HISTORY.roundYears(months)}년</b><span>${CAREER_HISTORY.durationLabel(months)}</span></div><div><small>현재 재직</small><b>${cur?cur.jobTitle:"미등록"}</b><span>${cur?`${cur.employmentType} · ${cur.startDate||"입사일 미입력"}`:"현재 경력을 추가하세요"}</span></div><div><small>경력 산정</small><b>AUTO</b><span>오늘 날짜 기준 자동 갱신</span></div></div>`;
 careerTimeline.innerHTML=h.length?h.map(e=>{let m=CAREER_HISTORY.entryMonths(e);return `<div class="career-row"><div class="career-dot ${e.isCurrent?"now":""}"></div><div><div class="row-head"><b>${esc(e.jobTitle)}</b><span>${e.relevant===false?"비관련":"관련직무"}</span></div><p>${esc(e.companyName||e.companyType||"회사 미입력")} · ${esc(e.employmentType||"고용형태 미입력")}</p><small>${e.manualMonths!=null?"직접입력":`${e.startDate||"?"} ~ ${e.isCurrent?"재직중":e.endDate||"?"}`} · ${CAREER_HISTORY.durationLabel(m)}</small></div><button class="secondary smallbtn" onclick="editCareer('${e.id}')">수정</button></div>`}).join(""):'<div class="empty">경력 타임라인이 비어 있습니다. 현재 직장부터 추가해보세요.</div>';
}
function careerForm(e={}){
 let isManual=e.manualMonths!=null,job=e.jobTitle||user.currentJob||"전기 시설관리";
 careerEditor.innerHTML=`<div class="career-editor-box"><div class="section-title"><div><p class="eyebrow">${e.id?"EDIT CAREER":"ADD CAREER"}</p><h3>${e.id?"경력 수정":"관련직무 경력 추가"}</h3></div><button class="secondary smallbtn" id="cancelCareer">닫기</button></div><div class="form-grid">
 <label class="field"><span>직무명</span><select id="chJob">${opt(CAREER_HISTORY.jobTitles,job)}</select></label>
 <label class="field"><span>고용형태</span><select id="chEmployment">${opt(CAREER_HISTORY.employmentTypes,e.employmentType||"정규직")}</select></label>
 <label class="field"><span>회사 유형</span><select id="chCompanyType">${opt(CAREER_HISTORY.companyTypes,e.companyType||"시설관리 용역업체")}</select></label>
 <label class="field"><span>회사명 <small>선택</small></span><input id="chCompanyName" value="${esc(e.companyName||"")}" placeholder="예: ○○FM"></label>
 <label class="field"><span>입사일</span><input id="chStart" type="date" value="${e.startDate||""}"></label>
 <label class="field"><span>종료일</span><input id="chEnd" type="date" value="${e.endDate||""}" ${e.isCurrent?"disabled":""}></label>
 </div><div class="career-checks"><label><input id="chCurrent" type="checkbox" ${e.isCurrent?"checked":""}> 현재 재직 중</label><label><input id="chRelevant" type="checkbox" ${e.relevant!==false?"checked":""}> 목표 분야 관련직무 경력으로 산정</label></div>
 <div class="manual-career"><label><input id="chManual" type="checkbox" ${isManual?"checked":""}> 날짜 대신 이전 관련경력을 직접 입력</label><div id="manualFields" style="display:${isManual?"grid":"none"}"><label class="field"><span>년</span><input id="chYears" type="number" min="0" max="50" value="${isManual?Math.floor(e.manualMonths/12):0}"></label><label class="field"><span>개월</span><input id="chMonths" type="number" min="0" max="11" value="${isManual?Math.round(e.manualMonths%12):0}"></label></div></div>
 <div id="careerPreview" class="career-preview"></div><div class="editor-actions"><button class="primary" id="saveCareer">경력 저장</button>${e.id?'<button class="danger secondary" id="deleteCareer">삭제</button>':""}</div></div>`;
 cancelCareer.onclick=()=>careerEditor.innerHTML="";
 chCurrent.onchange=()=>{chEnd.disabled=chCurrent.checked;previewCareer()};chManual.onchange=()=>{manualFields.style.display=chManual.checked?"grid":"none";previewCareer()};
 [chStart,chEnd,chYears,chMonths].forEach(x=>x.oninput=previewCareer);previewCareer();
 saveCareer.onclick=()=>saveCareerEntry(e.id);if(e.id)deleteCareer.onclick=()=>removeCareer(e.id);
}
function previewCareer(){let m=chManual.checked?((+chYears.value||0)*12+(+chMonths.value||0)):CAREER_HISTORY.monthsBetween(chStart.value,chCurrent.checked?null:chEnd.value);careerPreview.innerHTML=`<span>이 경력의 현재 산정값</span><b>${CAREER_HISTORY.roundYears(m)}년</b><small>${CAREER_HISTORY.durationLabel(m)} · 재직 중이면 시간이 지나며 자동 증가합니다.</small>`}
function saveCareerEntry(id){
 let h=CAREER_HISTORY.get(user).filter(x=>x.id!=="legacy"),manual=chManual.checked,entry={id:id||"career-"+Date.now(),jobTitle:chJob.value,employmentType:chEmployment.value,companyType:chCompanyType.value,companyName:chCompanyName.value.trim(),startDate:manual?"":chStart.value,endDate:manual?"":chEnd.value,isCurrent:manual?false:chCurrent.checked,relevant:chRelevant.checked};
 if(manual)entry.manualMonths=(+chYears.value||0)*12+(+chMonths.value||0);else if(!entry.startDate){toast("입사일을 선택해주세요.");return}
 if(entry.isCurrent)h.forEach(x=>x.isCurrent=false);
 h.push(entry);user.careerHistory=h;persistUser();careerEditor.innerHTML="";render();toast("경력 타임라인을 저장했습니다.");
}
function editCareer(id){let e=CAREER_HISTORY.get(user).find(x=>x.id===id);if(e)careerForm(e)}
function removeCareer(id){if(!confirm("이 경력을 삭제할까요?"))return;user.careerHistory=CAREER_HISTORY.get(user).filter(x=>x.id!==id&&x.id!=="legacy");persistUser();careerEditor.innerHTML="";render();toast("경력을 삭제했습니다.")}
addCareer.onclick=()=>careerForm({isCurrent:!CAREER_HISTORY.currentEntry(user),relevant:true});
editCurrent.onclick=()=>{let cur=CAREER_HISTORY.currentEntry(user);if(cur)careerForm(cur);else careerForm({isCurrent:true,relevant:true})};
request.onclick=()=>{let name=certSelect.value,file=proof.files[0];if(!file){toast("증빙 파일을 선택해주세요.");return}let old=verified.find(v=>v.name===name);if(old&&old.status==="verified"){toast("이미 인증된 자격증입니다.");return}if(old){old.status="pending";old.fileName=file.name}else verified.push({name,status:"pending",fileName:file.name,requestedAt:new Date().toISOString()});save();toast("인증 요청을 저장했습니다.")};
function approve(name){let v=verified.find(x=>x.name===name);if(!v||v.status==="verified")return;v.status="verified";v.verifiedAt=new Date().toISOString();let xp=xpMap[name]||0;state.xp=(state.xp||0)+xp;state.history.unshift({date:new Date().toISOString().slice(0,10),text:`🏆 ${name} 취득 인증`,xp});let eid=emblemMap[name];if(eid&&!emState.owned.includes(eid))emState.owned.push(eid);save();toast(`${name} 인증 완료 · +${xp} XP · 엠블렘 획득!`)}
persistUser();render();if(window.CERTS&&document.querySelector('#certSelect'))certSelect.innerHTML=CERTS.map(c=>`<option>${c.name}</option>`).join('');
