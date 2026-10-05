if(window.LifeAuth)LifeAuth.requireAuth();
const LIB=[
{id:"study30",group:"study",cat:"공부",name:"일반 공부 30분",xp:1,minutes:30,type:"instant"},
{id:"study60",group:"study",cat:"공부",name:"일반 공부 1시간",xp:2,minutes:60,type:"instant"},
{id:"study120",group:"study",cat:"공부",name:"일반 공부 2시간",xp:4,minutes:120,type:"instant"},
{id:"study180",group:"study",cat:"공부",name:"일반 공부 3시간",xp:6,minutes:180,type:"instant"},
{id:"exercise20",group:"exercise",cat:"건강",name:"운동 20분",xp:1,type:"instant"},
{id:"exercise30",group:"exercise",cat:"건강",name:"운동 30분",xp:2,type:"instant"},
{id:"exercise60",group:"exercise",cat:"건강",name:"운동 1시간",xp:3,type:"instant"},
{id:"walk",group:"walk",cat:"건강",name:"8,000보 걷기",xp:1,type:"daily"},
{id:"sleep",group:"sleep",cat:"건강",name:"수면 루틴 지키기",xp:1,type:"daily"},
{id:"water",group:"water",cat:"건강",name:"물 1.5L 마시기",xp:1,type:"daily"},
{id:"expense",group:"expense",cat:"재정",name:"오늘 지출 기록",xp:1,type:"instant"},
{id:"nospend",group:"nospend",cat:"재정",name:"무지출 데이",xp:2,type:"daily"},
{id:"finance15",group:"finance",cat:"재정",name:"재정 점검 15분",xp:1,type:"instant"},
{id:"budget",group:"budget",cat:"재정",name:"이번 주 예산 확인",xp:1,type:"instant"},
{id:"job1",group:"job",cat:"커리어",name:"채용공고 1개 분석",xp:1,type:"instant"},
{id:"job3",group:"job",cat:"커리어",name:"채용공고 3개 분석",xp:2,type:"instant"},
{id:"resume30",group:"resume",cat:"커리어",name:"이력서·자소서 30분",xp:1,type:"instant"},
{id:"portfolio",group:"portfolio",cat:"커리어",name:"포트폴리오 30분",xp:1,type:"instant"},
{id:"interview",group:"interview",cat:"커리어",name:"면접 답변 3개 연습",xp:2,type:"instant"},
{id:"read20",group:"read",cat:"성장",name:"독서 20분",xp:1,type:"instant"},
{id:"read60",group:"read",cat:"성장",name:"독서 1시간",xp:2,type:"instant"},
{id:"clean20",group:"clean",cat:"생활",name:"정리정돈 20분",xp:1,type:"instant"},
{id:"plan10",group:"plan",cat:"생활",name:"내일 계획 10분",xp:1,type:"instant"},
{id:"phone",group:"phone",cat:"생활",name:"취침 전 휴대폰 30분 끄기",xp:1,type:"daily"}
];
let qs=JSON.parse(localStorage.getItem("lifeSpecupQuests")||'{}');
let state=JSON.parse(localStorage.getItem("lifeSpecupState")||'{"xp":0,"history":[]}');
qs.selected=qs.selected||[];qs.days=qs.days||{};qs.pending=qs.pending||[];qs.long=qs.long||[];state.history=state.history||[];
function lifeDay(d=new Date()){let x=new Date(d);if(x.getHours()<6)x.setDate(x.getDate()-1);return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,"0")}-${String(x.getDate()).padStart(2,"0")}`}
const today=lifeDay();
function ensureDay(k){if(!qs.days[k])qs.days[k]={quests:qs.selected.map(x=>({...x})),completed:[],failed:[],settled:[]};return qs.days[k]}
function settle(){Object.keys(qs.days).filter(k=>k<today).forEach(k=>{let d=qs.days[k];(d.quests||[]).forEach(q=>{if(d.completed.includes(q.id)||d.failed.includes(q.id)||d.settled.includes(q.id))return;if(q.type==="daily"){if(!qs.pending.some(p=>p.day===k&&p.id===q.id))qs.pending.push({day:k,...q});d.settled.push(q.id)}else d.failed.push(q.id)})})}
ensureDay(today);settle();
function save(){localStorage.setItem("lifeSpecupQuests",JSON.stringify(qs));localStorage.setItem("lifeSpecupState",JSON.stringify(state));render()}
function pop(m){toast.textContent=m;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1700)}
function syncToday(){let d=ensureDay(today),protectedIds=new Set([...d.completed,...d.failed,...d.settled]);d.quests=[...d.quests.filter(q=>protectedIds.has(q.id)),...qs.selected.filter(q=>!protectedIds.has(q.id))]}
function toggle(id){let q=LIB.find(x=>x.id===id),i=qs.selected.findIndex(x=>x.id===id);if(i>=0){qs.selected.splice(i,1)}else{if(q.group){let same=qs.selected.find(x=>x.group===q.group);if(same)qs.selected=qs.selected.filter(x=>x.id!==same.id)}if(qs.selected.length>=8){pop("오늘 할 일은 최대 8개까지 선택할 수 있어요.");return}qs.selected.push({...q})}syncToday();save()}
function complete(id){let d=ensureDay(today),q=d.quests.find(x=>x.id===id);if(!q||d.completed.includes(id))return;if(q.type==="daily"){pop("하루 종료 후 정산하는 퀘스트입니다.");return}d.completed.push(id);if(q.auto&&q.longId){let L=qs.long.find(x=>x.id===q.longId);if(L){L.loggedHours=Math.min(L.targetHours,(L.loggedHours||0)+(L.dailyHours||0));if(L.lastStudyDay!==today){L.studyDays=(L.studyDays||0)+1;L.lastStudyDay=today}}}state.xp=(state.xp||0)+q.xp;state.history.unshift({date:today,text:"✅ "+q.name,xp:q.xp});save();pop(`+${q.xp} XP`)}
function judge(i,ok){let p=qs.pending[i],d=qs.days[p.day];if(ok){d.completed.push(p.id);state.xp=(state.xp||0)+p.xp;state.history.unshift({date:p.day,text:"🌙 "+p.name,xp:p.xp})}else d.failed.push(p.id);qs.pending.splice(i,1);save()}
let tab="전체";
const certs=(window.CERTS||[]).filter(c=>c.name).map(c=>({...c,level:/기능장/.test(c.name)?"기능장":/기술사/.test(c.name)?"기술사":/산업기사/.test(c.name)?"산업기사":/기능사/.test(c.name)?"기능사":"기사"}));
function studyModel(cert,stage){
 let lvl=cert.level||"기사", base={기능사:[35,55],산업기사:[70,110],기사:[100,160],기능장:[180,280],기술사:[450,700]}[lvl]||[80,130];
 let factor=stage==="practical"?1.15:1;
 if(/전기기사$/.test(cert.name)) base=stage==="written"?[120,180]:[140,220];
 if(/산업안전기사/.test(cert.name)) base=stage==="written"?[70,110]:[60,100];
 if(/정보처리기사/.test(cert.name)) base=stage==="written"?[60,100]:[70,120];
 return {low:Math.round(base[0]*factor),high:Math.round(base[1]*factor)};
}
function predictionData(){
 let c=certs.find(x=>x.name===certName.value)||{name:certName.value,level:"기사"}, stage=certStage.value,h=+dailyHours.value,days=+planDays.value,total=h*days,m=studyModel(c,stage),mid=(m.low+m.high)/2,ratio=total/mid;
 // This is readiness, deliberately not a literal personal pass probability.
 let readiness=Math.max(5,Math.min(72,Math.round(12+58*(1-Math.exp(-1.05*ratio)))));
 let label=readiness<35?"기초 구간":readiness<55?"진행 구간":"학습량 충족 접근";
 return {c,stage,h,days,total,m,readiness,label};
}
function renderPrediction(){let p=predictionData();prediction.innerHTML=`<div class="prediction-head"><div><span class="badge">${p.stage==="written"?"필기":"실기"}</span><h3>${p.c.name}</h3></div><b>${p.total}시간 계획</b></div><div class="readiness"><div class="ring">${p.readiness}<small>/100</small></div><div><b>${p.label}</b><p class="muted">학습량 준비도 · 권장 학습량 ${p.m.low}~${p.m.high}시간 대비 계획 ${p.total}시간</p></div></div><div class="notice">시간만 입력한 준비도는 72점에서 상한됩니다. 개인의 실제 합격확률이 아니며, 기출·모의점수와 회독을 기록하면 아래 장기 퀘스트에서 성과 기반 준비도를 별도로 계산합니다.</div>`}
function addLong(){let p=predictionData(),id=`cert-${p.c.name}-${p.stage}`;let old=qs.long.find(x=>x.id===id&&!x.done);if(old){old.dailyHours=p.h;old.days=p.days;old.targetHours=p.total}else qs.long.push({id,name:`${p.c.name} ${p.stage==="written"?"필기":"실기"} 공부`,cert:p.c.name,stage:p.stage,dailyHours:p.h,days:p.days,targetHours:p.total,loggedHours:0,studyDays:0,lastStudyDay:null,mockScore:null,rounds:0,started:today,done:false,xp:Math.max(15,Math.round(p.total/5))});save();pop("장기 퀘스트를 시작했어요.")}
function logStudy(id,h){let q=qs.long.find(x=>x.id===id);if(!q||q.done)return;q.loggedHours=Math.min(q.targetHours,(q.loggedHours||0)+h);if(q.lastStudyDay!==today){q.studyDays=(q.studyDays||0)+1;q.lastStudyDay=today;state.xp=(state.xp||0)+1;state.history.unshift({date:today,text:"📚 "+q.name+" 학습일 기록",xp:1})}if(q.loggedHours>=q.targetHours){q.done=true;state.xp=(state.xp||0)+q.xp;state.history.unshift({date:today,text:"🎯 "+q.name+" 학습시간 목표 달성",xp:q.xp})}save()}

function readinessFor(q){
 let m=studyModel({name:q.cert,level:(certs.find(c=>c.name===q.cert)||{}).level||"기사"},q.stage),time=Math.min(1,(q.loggedHours||0)/((m.low+m.high)/2)),score=q.mockScore==null?null:+q.mockScore,rounds=Math.min(1,(q.rounds||0)/3);
 let timePart=35*time,roundPart=15*rounds,scorePart=score==null?0:45*Math.max(0,Math.min(1,score/100)),consistency=Math.min(5,(q.studyDays||0)/10*5);
 let val=Math.round(timePart+roundPart+scorePart+consistency);if(score==null)val=Math.min(val,55);
 let confidence=score==null?"낮음":(q.rounds||0)>=2&&q.studyDays>=7?"높음":"보통";
 return {value:val,confidence,label:val<35?"기초":val<55?"진행":val<70?"합격권 접근":val<85?"준비 양호":"매우 높은 준비도"};
}
function setSignal(id,type,val){let q=qs.long.find(x=>x.id===id);if(!q)return;if(type==="score"){let n=Math.max(0,Math.min(100,+val||0));q.mockScore=n}else if(type==="rounds")q.rounds=Math.max(0,Math.min(20,+val||0));save()}

function render(){
 let d=ensureDay(today),done=d.completed||[];
 let activeLong=qs.long.find(x=>!x.done&&x.cert);
 if(activeLong){let autoId="auto-"+activeLong.id+"-"+today;if(!d.quests.some(x=>x.id===autoId)){d.quests.push({id:autoId,group:"cert-auto",cat:"자격증",name:`${activeLong.cert} ${activeLong.stage==="written"?"필기":"실기"} ${activeLong.dailyHours}시간`,xp:1,type:"instant",auto:true,longId:activeLong.id})}}
 let active=d.quests||[];
 todayList.innerHTML=active.length?active.map(q=>`<div class="quest-item ${done.includes(q.id)?"done":""}"><div><b>${q.name}</b><div class="muted">${q.type==="daily"?"06:00 이후 정산":"완료 즉시 기록"} · +${q.xp} XP</div></div>${done.includes(q.id)?'<b class="good">완료</b>':q.type==="daily"?'<b class="warn">정산형</b>':`<button class="primary smallbtn" onclick="complete('${q.id}')">완료</button>`}</div>`).join(""):'<p class="sub">오늘 할 일을 선택해보세요. 오른쪽 위 ‘퀘스트 편집’을 누르면 언제든 바꿀 수 있습니다.</p>';
 let earned=active.filter(q=>done.includes(q.id)).reduce((s,q)=>s+q.xp,0);todayXp.textContent=earned+" XP";dayStat.textContent=`${done.length} / ${active.length} 완료`;daybar.style.width=(active.length?done.length/active.length*100:0)+"%";
 let cats=["전체",...new Set(LIB.map(x=>x.cat))];tabs.innerHTML=cats.map(c=>`<button class="tab ${tab===c?"active":""}" onclick="tab='${c}';render()">${c}</button>`).join("");
 library.innerHTML=LIB.filter(q=>tab==="전체"||q.cat===tab).map(q=>{let on=qs.selected.some(x=>x.id===q.id),same=!on&&qs.selected.some(x=>x.group===q.group);return `<button class="quest-option ${on?"selected":""}" onclick="toggle('${q.id}')"><b>${on?"✓ ":""}${q.name} <span class="xp">+${q.xp}</span></b><small>${same?"같은 그룹의 다른 단계가 선택됨 · 누르면 교체":q.type==="daily"?"하루 판정형":"즉시 완료형"}</small></button>`}).join("");
 settlement.innerHTML=qs.pending.length?`<section class="card" style="margin-bottom:14px"><p class="eyebrow">SETTLEMENT</p><h2>지난 하루 정산</h2>${qs.pending.map((p,i)=>`<div class="quest-item"><div><b>${p.name}</b><div class="muted">${p.day}</div></div><div><button class="secondary smallbtn" onclick="judge(${i},false)">실패</button> <button class="primary smallbtn" onclick="judge(${i},true)">성공 +${p.xp}</button></div></div>`).join("")}</section>`:"";
 longList.innerHTML=qs.long.length?qs.long.map(q=>{let pct=Math.min(100,Math.round((q.loggedHours||0)/q.targetHours*100));return `<div class="long-card"><div class="row-head"><div><b>${q.name}</b><div class="muted">${q.loggedHours||0} / ${q.targetHours}시간 · ${pct}%</div></div><b class="${q.done?"good":"xp"}">${q.done?"달성":"+"+q.xp+" XP"}</b></div><div class="progress"><span style="width:${pct}%"></span></div>${q.done?"":`<div style="margin-top:10px"><button class="secondary smallbtn" onclick="logStudy('${q.id}',.5)">+30분</button> <button class="secondary smallbtn" onclick="logStudy('${q.id}',1)">+1시간</button> <button class="secondary smallbtn" onclick="logStudy('${q.id}',2)">+2시간</button></div>`}</div>`}).join(""):'<p class="sub">진행 중인 장기 공부 퀘스트가 없습니다.</p>';
 let activeCert=qs.long.find(x=>!x.done&&x.cert);activeCertSummary.innerHTML=activeCert?`<b>${activeCert.cert} ${activeCert.stage==="written"?"필기":"실기"}</b><p class="muted">${activeCert.loggedHours||0}/${activeCert.targetHours}시간 진행</p>`:'<p class="sub">진행 중인 자격증 공부가 없습니다.</p>';
 studySignals.innerHTML=qs.long.filter(x=>x.cert&&!x.done).length?qs.long.filter(x=>x.cert&&!x.done).map(q=>{let r=readinessFor(q);return `<div class="signal-card"><div class="row-head"><div><b>${q.cert} ${q.stage==="written"?"필기":"실기"}</b><div class="muted">성과 기반 준비도 ${r.value}/100 · 신뢰도 ${r.confidence}</div></div><span class="readiness-pill">${r.label}</span></div><div class="signal-grid"><label class="field"><span>최근 기출·모의 점수</span><input type="number" min="0" max="100" value="${q.mockScore??""}" placeholder="예: 68" onchange="setSignal('${q.id}','score',this.value)"></label><label class="field"><span>기출 회독 수</span><input type="number" min="0" max="20" value="${q.rounds||0}" onchange="setSignal('${q.id}','rounds',this.value)"></label></div><div class="progress"><span style="width:${r.value}%"></span></div><p class="muted">학습 ${q.loggedHours||0}시간 · 학습일 ${q.studyDays||0}일 · 회독 ${q.rounds||0}회${q.mockScore==null?" · 점수 미입력으로 준비도 상한 적용":""}</p></div>`}).join(""):'<div class="empty">진행 중인 자격증 공부 목표를 만들면 성과지표를 기록할 수 있습니다.</div>';
 let keys=Object.keys(qs.days).sort().reverse().slice(0,7);historyBox.innerHTML=keys.map(k=>{let x=qs.days[k];return `<div class="history-row"><span><b>${k}</b> <span class="muted">성공 ${(x.completed||[]).length} · 실패 ${(x.failed||[]).length}</span></span></div>`}).join("")||'<p class="sub">기록이 없습니다.</p>';
}
certName.innerHTML=(certs.length?certs:[{name:"전기기사"}]).map(c=>`<option>${c.name}</option>`).join("");if([...certName.options].some(o=>o.value==="전기기사"))certName.value="전기기사";
[certName,certStage,dailyHours,planDays].forEach(e=>e.onchange=renderPrediction);addCertQuest.onclick=addLong;editBtn.onclick=()=>picker.style.display=picker.style.display==="none"?"block":"none";doneEdit.onclick=()=>picker.style.display="none";
renderPrediction();render();