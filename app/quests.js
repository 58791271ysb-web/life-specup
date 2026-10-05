const LIB=[
{id:"study30",group:"studyTime",cat:"공부",name:"공부 30분",detail:"자격증·시험·직무 공부",xp:2,type:"instant"},
{id:"study60",group:"studyTime",cat:"공부",name:"공부 1시간",detail:"집중 공부 60분",xp:4,type:"instant"},
{id:"study120",group:"studyTime",cat:"공부",name:"공부 2시간",detail:"집중 공부 120분",xp:9,type:"instant"},
{id:"study180",group:"studyTime",cat:"공부",name:"공부 3시간",detail:"집중 공부 180분",xp:15,type:"instant"},
{id:"exercise30",group:"exerciseTime",cat:"건강",name:"운동 30분",detail:"걷기·헬스·유산소 등",xp:3,type:"instant"},
{id:"exercise60",group:"exerciseTime",cat:"건강",name:"운동 1시간",detail:"운동 60분",xp:7,type:"instant"},
{id:"sleep",cat:"건강",name:"수면 루틴 지키기",detail:"설정한 취침·기상 시간 준수",xp:3,type:"daily"},
{id:"expense",cat:"재정",name:"오늘 지출 기록",detail:"하루 소비를 기록",xp:2,type:"instant"},
{id:"nospend",cat:"재정",name:"무지출 데이",detail:"하루 동안 불필요한 소비 없이 보내기",xp:4,type:"daily"},
{id:"finance",cat:"재정",name:"재정 점검 15분",detail:"자산·부채·예산 확인",xp:2,type:"instant"},
{id:"career30",cat:"커리어",name:"직무 공부 30분",detail:"목표 직무 실무 학습",xp:3,type:"instant"},
{id:"resume",cat:"커리어",name:"이력서/자소서 30분",detail:"지원서 개선",xp:3,type:"instant"},
{id:"job",cat:"커리어",name:"채용공고 3개 분석",detail:"지원요건과 우대조건 확인",xp:3,type:"instant"},
{id:"read30",cat:"성장",name:"독서 30분",detail:"책 또는 전문자료 읽기",xp:2,type:"instant"},
{id:"clean",cat:"생활",name:"정리정돈 20분",detail:"방·책상·생활공간 정리",xp:2,type:"instant"}];

let qs=JSON.parse(localStorage.getItem("lifeSpecupQuests")||'{"selected":[],"days":{},"pending":[],"completed":{}}');
let state=JSON.parse(localStorage.getItem("lifeSpecupState")||'{"xp":0,"history":[]}');
qs.selected=qs.selected||[]; qs.days=qs.days||{}; qs.pending=qs.pending||[]; qs.completed=qs.completed||{}; state.history=state.history||[];
let longState=JSON.parse(localStorage.getItem("lifeSpecupLongQuests")||'{"completed":[]}');longState.completed=longState.completed||[];
const LONG=[{id:"electric-written",name:"전기기사 필기 합격",detail:"필기 합격 결과를 인증하는 단계",xp:90,verify:true},{id:"electric-practical",name:"전기기사 실기·최종 합격",detail:"실기 합격 및 최종 합격 단계",xp:160,verify:true,requires:"electric-written"},{id:"career-1y",name:"관련 직무 경력 1년",detail:"목표 분야에서 경력 1년 달성",xp:120,verify:true},{id:"study-100h",name:"누적 공부 100시간",detail:"공부 기록 누적 100시간 달성",xp:100,verify:false,future:true}];

function lifeDay(d=new Date()){
 let x=new Date(d);
 if(x.getHours()<6)x.setDate(x.getDate()-1);
 return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,"0")}-${String(x.getDate()).padStart(2,"0")}`;
}
const today=lifeDay();
function previousDay(key){let [y,m,d]=key.split("-").map(Number),x=new Date(y,m-1,d);x.setDate(x.getDate()-1);return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,"0")}-${String(x.getDate()).padStart(2,"0")}`}
function ensureDay(k){
 if(!qs.days[k])qs.days[k]={quests:qs.selected.map(q=>({...q})),completed:[],failed:[],settled:[]};
 return qs.days[k];
}
function migrate(){
 // Preserve old same-day completions where possible
 let d=ensureDay(today);
 if(qs.completed[today] && !d.completed.length)d.completed=[...qs.completed[today]];
}
function settlePastDays(){
 Object.keys(qs.days).filter(k=>k<today).sort().forEach(k=>{
  let d=qs.days[k];
  (d.quests||[]).forEach(q=>{
   if(d.completed.includes(q.id)||d.failed.includes(q.id)||d.settled.includes(q.id))return;
   if(q.type==="daily"){
    if(!qs.pending.some(p=>p.day===k&&p.id===q.id))qs.pending.push({day:k,...q});
    d.settled.push(q.id);
   }else d.failed.push(q.id);
  });
 });
}
migrate();settlePastDays();ensureDay(today);

function save(){localStorage.setItem("lifeSpecupQuests",JSON.stringify(qs));localStorage.setItem("lifeSpecupState",JSON.stringify(state));localStorage.setItem("lifeSpecupLongQuests",JSON.stringify(longState));render()}
function pop(m){let el=document.querySelector("#toast");el.textContent=m;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),1600)}
function toggleSelect(id){
 let q=LIB.find(x=>x.id===id),i=qs.selected.findIndex(x=>x.id===id);
 if(i>=0)qs.selected.splice(i,1);else{if(q.group){let conflict=qs.selected.find(x=>x.group===q.group&&x.id!==q.id);if(conflict){pop(`${conflict.name}이 이미 선택되어 있어요. 같은 종류는 하나만 선택할 수 있습니다.`);return}}if(qs.selected.length>=5){pop("일일 퀘스트는 최대 5개까지 선택할 수 있어요.");return}qs.selected.push({...q})}
 // Today's not-yet-started quest set follows selection, but don't erase results already earned.
 let d=ensureDay(today),done=new Set([...d.completed,...d.failed,...d.settled]);
 d.quests=[...d.quests.filter(q=>done.has(q.id)),...qs.selected.filter(q=>!done.has(q.id))];
 save()
}
function complete(id){
 let d=ensureDay(today),q=d.quests.find(x=>x.id===id)||qs.selected.find(x=>x.id===id);if(!q)return;
 if(q.type==="daily"){pop("이 퀘스트는 하루가 끝난 뒤 정산해요.");return}
 if(d.completed.includes(id))return;
 d.completed.push(id);state.xp=(state.xp||0)+q.xp;state.history.unshift({date:today,text:"✅ "+q.name+" 완료",xp:q.xp});save();pop(`+${q.xp} XP 획득!`)
}
function judgePending(idx,success){
 let p=qs.pending[idx],d=qs.days[p.day];if(!p||!d)return;
 if(success){d.completed.push(p.id);state.xp=(state.xp||0)+p.xp;state.history.unshift({date:p.day,text:"🌙 "+p.name+" 정산 성공",xp:p.xp})}
 else d.failed.push(p.id);
 qs.pending.splice(idx,1);save();pop(success?`전날 퀘스트 성공! +${p.xp} XP`:"실패로 기록했어요.")
}
function claimLong(id){let q=LONG.find(x=>x.id===id);if(!q||longState.completed.includes(id))return;if(q.requires&&!longState.completed.includes(q.requires)){pop("이전 단계를 먼저 완료해야 합니다.");return}if(q.verify){pop("증빙형 장기 퀘스트입니다. 현재 MVP에서는 테스트 인증 버튼을 사용하세요.");return}pop("자동 기록 연동 예정인 장기 퀘스트입니다.")}function devApproveLong(id){let q=LONG.find(x=>x.id===id);if(!q||longState.completed.includes(id))return;if(q.requires&&!longState.completed.includes(q.requires)){pop("이전 단계를 먼저 인증해주세요.");return}longState.completed.push(id);state.xp=(state.xp||0)+q.xp;state.history.unshift({date:today,text:"🎯 "+q.name,xp:q.xp});save();pop(`${q.name} 완료 · +${q.xp} XP`)}
let cat="전체";
function render(){
 const d=ensureDay(today),done=d.completed||[];
 document.querySelector("#dayLabel").textContent=`오늘 기준 ${today} · 06:00 초기화`;
 selectedList.innerHTML=qs.selected.length?qs.selected.map(q=>{
  let finished=done.includes(q.id);
  return `<div class="quest-item ${finished?"done":""}"><div><b class="qname">${q.name}</b><div class="muted">${q.detail}${q.type==="daily"?" · 🌙 하루 종료 후 판정":""}</div></div>${finished?'<b class="good">완료</b>':q.type==="daily"?'<b class="warn">판정 대기</b>':`<button class="primary smallbtn" onclick="complete('${q.id}')">완료 +${q.xp}XP</button>`}</div>`
 }).join(""):'<p class="sub">아래에서 매일 반복할 퀘스트를 골라주세요.</p>';
 dailyXp.textContent=d.quests.filter(q=>done.includes(q.id)).reduce((s,q)=>s+q.xp,0)+" XP 획득";
 let li=levelInfo(state.xp||0);lvText.textContent="LV."+li.level;xpText.textContent=`${li.cur} / ${li.need} XP`;pct.textContent=Math.floor(li.pct)+"%";xpbar.style.width=li.pct+"%";
 let cats=["전체",...new Set(LIB.map(x=>x.cat))];categories.innerHTML=cats.map(c=>`<button class="tab ${c===cat?"active":""}" onclick="cat='${c}';render()">${c}</button>`).join("");
 library.innerHTML=LIB.filter(q=>cat==="전체"||q.cat===cat).map(q=>{let on=qs.selected.some(x=>x.id===q.id);return`<button class="quest-option" onclick="toggleSelect('${q.id}')"><b>${on?"✓ ":""}${q.name} <span class="xp">+${q.xp} XP</span></b><small>${q.detail} · ${q.type==="daily"?"다음 날 정산":"즉시 완료"} · ${on?"선택됨":"클릭해서 선택"}</small></button>`}).join("");
 pendingBox.innerHTML=qs.pending.length?`<div class="card" style="margin-bottom:14px"><p class="eyebrow">YESTERDAY SETTLEMENT</p><h2>지난 퀘스트 정산</h2><p class="sub">06:00이 지나 하루가 끝났습니다. 아래 항목을 직접 확인해주세요.</p>${qs.pending.map((p,i)=>`<div class="quest-item"><div><b>${p.name}</b><div class="muted">${p.day} · ${p.detail}</div></div><div><button class="secondary smallbtn" onclick="judgePending(${i},false)">실패</button> <button class="primary smallbtn" onclick="judgePending(${i},true)">성공 +${p.xp}XP</button></div></div>`).join("")}</div>`:"";
 longQuestList.innerHTML=LONG.map(q=>{let done=longState.completed.includes(q.id),locked=q.requires&&!longState.completed.includes(q.requires);return `<div class="quest-item ${done?'done':''}"><div><b>${q.name}</b><div class="muted">${q.detail}${locked?' · 이전 단계 필요':''}</div></div>${done?'<b class="good">완료</b>':q.future?'<span class="badge">자동연동 예정</span>':`<button class="secondary smallbtn" ${locked?'disabled':''} onclick="devApproveLong('${q.id}')">테스트 인증 +${q.xp}XP</button>`}</div>`}).join('');
 let keys=Object.keys(qs.days).sort().reverse().slice(0,7);
 historyBox.innerHTML=keys.length?keys.map(k=>{let x=qs.days[k],total=(x.quests||[]).length,ok=(x.completed||[]).length,fail=(x.failed||[]).length,pending=(x.settled||[]).filter(id=>qs.pending.some(p=>p.day===k&&p.id===id)).length;return `<div class="history-row"><span><b>${k}</b> <span class="muted">성공 ${ok} · 실패 ${fail}${pending?" · 판정대기 "+pending:""}</span></span><b>${total?Math.round(ok/total*100):0}%</b></div>`}).join(""):'<p class="sub">기록이 아직 없습니다.</p>';
 localStorage.setItem("lifeSpecupQuests",JSON.stringify(qs))
}render();