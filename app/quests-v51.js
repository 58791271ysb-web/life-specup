(()=>{
'use strict';
const C=window.LifeSpecupCore;
if(!C) throw new Error('LifeSpecupCore not loaded');
const el=id=>document.getElementById(id);
const today=C.lifeDay();
let Q=C.get('lifeSpecupQuests',{days:{},long:[],optionalSelected:[]})||{};
let S=C.get('lifeSpecupState',{xp:0,history:[]})||{};
Q.days=Q.days||{}; Q.long=Q.long||[]; S.history=S.history||[];
const certs=(window.CERTS||[]).map(c=>({...c}));
const refs={dayChip:el('dayChip'),core:el('coreFive'),activeGoal:el('activeGoal'),newGoal:el('newGoalBtn'),builder:el('goalBuilder'),close:el('closeBuilder'),cert:el('certName'),stage:el('certStage'),hours:el('dailyHours'),days:el('planDays'),preview:el('goalPreview'),create:el('createGoal'),rhythm:el('rhythm'),optionalList:el('optionalList'),optionalCount:el('optionalCount'),history:el('history14')};
function active(){return Q.long.find(x=>!x.done&&!x.paused)||Q.long.find(x=>!x.done)||null}
function day(){return Q.days[today]||(Q.days[today]={simple:{done:false,hours:0,note:''},optionalDone:[]})}
function persist(){C.set('lifeSpecupQuests',Q);C.set('lifeSpecupState',S)}
function safe(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function syncTarget(cert,stage){if(!window.TargetBuild)return;let b=TargetBuild.load(),arr=b.certs||[],i=arr.findIndex(x=>(typeof x==='string'?x:x.name)===cert),state=stage==='practical'?'written_pass':'target';if(i<0)arr.push({name:cert,stage:state});else if(typeof arr[i]==='object'&&stage==='practical')arr[i].stage='written_pass';b.certs=arr;b.createdAt=b.createdAt||new Date().toISOString();TargetBuild.save(b)}
function completeToday(){const g=active(),d=day();if(d.simple?.done){C.toast('오늘 핵심 퀘스트는 이미 완료했습니다.');return}if(!g){C.toast('먼저 장기 목표를 시작해주세요.');return}const hoursInput=el('todayHours'),noteInput=el('todayNote'),h=Math.max(0,Number(hoursInput?.value)||0);if(h<=0){C.toast('실제 공부시간을 입력해주세요.');hoursInput?.focus();return}d.simple={done:true,hours:h,note:(noteInput?.value||'').trim(),goalId:g.id,at:new Date().toISOString()};g.loggedHours=Number(g.loggedHours||0)+h;if(g.lastStudyDay!==today){g.studyDays=Number(g.studyDays||0)+1;g.lastStudyDay=today}const xp=Math.min(10,Math.max(2,Math.round(h*3)));S.xp=Number(S.xp||0)+xp;S.history.unshift({id:`study-${today}-${g.id}`,date:today,text:`🎯 ${g.cert} ${g.stage==='written'?'필기':'실기'} 공부 ${h}시간`,xp});persist();render();C.toast(`오늘의 전진 완료 · +${xp} XP`)}
function createGoal(){const certName=refs.cert.value,c=certs.find(x=>x.name===certName);if(!c){C.toast('자격증을 선택해주세요.');return}Q.long.filter(x=>!x.done).forEach(x=>x.paused=true);const h=Math.max(0.5,Number(refs.hours.value)||2),days=Math.max(1,Number(refs.days.value)||60),stage=refs.stage.value==='written'?'written':'practical';const goal={id:`goal-${Date.now()}`,name:`${c.name} ${stage==='written'?'필기':'실기'}`,cert:c.name,stage,dailyHours:h,days,targetHours:h*days,loggedHours:0,studyDays:0,started:today,done:false,paused:false};Q.long.push(goal);syncTarget(c.name,stage);refs.builder.style.display='none';sessionStorage.removeItem('lifeSpecupSuggestedCert');persist();render();C.toast('목표를 시작했습니다. 오늘의 퀘스트와 연결됐습니다.')}
function stopGoal(){const g=active();if(!g)return;g.paused=true;persist();render();C.toast('목표를 잠시 멈췄습니다.')}
function render(){const g=active(),d=day();refs.dayChip.textContent=`Life Day · ${today}`;refs.core.innerHTML=g?`<div class="one-quest ${d.simple?.done?'done':''}"><div><p class="eyebrow">TODAY'S ONE MOVE</p><h2>🎯 ${safe(g.cert)} ${g.stage==='written'?'필기':'실기'} 공부</h2><p>목표 ${g.dailyHours||2}시간 · 오늘은 공부시간만 기록하면 됩니다.</p></div>${d.simple?.done?`<strong>✓ ${d.simple.hours}시간 완료</strong>`:`<div class="quest-record"><label>실제 공부시간 <input id="todayHours" type="number" min="0" max="16" step=".5" value="${g.dailyHours||2}"></label><label>메모 <input id="todayNote" placeholder="선택사항"></label><button class="primary" id="completeTodayBtn" type="button">오늘 완료</button></div>`}</div>`:`<div class="empty-state"><b>오늘 연결된 핵심 목표가 없습니다.</b><p>아래에서 목표 하나를 시작하면 오늘의 공부 퀘스트가 자동으로 만들어집니다.</p><button class="primary" id="emptyStartBtn" type="button">목표 만들기</button></div>`;
 el('completeTodayBtn')?.addEventListener('click',completeToday);el('emptyStartBtn')?.addEventListener('click',openBuilder);
 refs.activeGoal.innerHTML=g?`<div class="active-goal-card"><span class="badge">${g.stage==='written'?'필기':'실기'}</span><h3>${safe(g.cert)}</h3><p>누적 ${Number(g.loggedHours||0)}시간 · 학습일 ${Number(g.studyDays||0)}일 · 하루 목표 ${g.dailyHours||2}시간</p><div class="progress"><span style="width:${Math.min(100,Number(g.loggedHours||0)/Math.max(1,Number(g.targetHours||1))*100)}%"></span></div><button class="ghost smallbtn" id="pauseGoalBtn" type="button">잠시 멈추기</button></div>`:'<div class="empty">진행 중인 장기 목표가 없습니다.</div>';
 el('pauseGoalBtn')?.addEventListener('click',stopGoal);
 refs.rhythm.innerHTML=`<div class="rhythm-score"><b>${Object.values(Q.days).filter(x=>x.simple?.done).length}</b><span>누적 성장일</span></div><p class="sub">완벽한 하루보다 미래의 나를 향한 한 번의 실제 행동을 기록합니다.</p>`;
 refs.optionalList.innerHTML='<div class="optional-grid"><div class="optional-card"><b>🏃 운동</b><span>필요한 날만 기록</span></div><div class="optional-card"><b>💰 재정 점검</b><span>필요한 날만 기록</span></div><div class="optional-card"><b>📖 독서</b><span>필요한 날만 기록</span></div></div>';refs.optionalCount.textContent='선택';
 const hist=(S.history||[]).filter(x=>x.date).slice(0,14);refs.history.innerHTML=hist.map(x=>`<div class="history-row"><span>${safe(x.date)} · ${safe(x.text)}</span><b>+${Number(x.xp||0)} XP</b></div>`).join('')||'<div class="empty">아직 기록이 없습니다.</div>'
}
function preview(){refs.preview.innerHTML=`<b>${safe(refs.cert.value)} ${refs.stage.value==='written'?'필기':'실기'}</b><p>매일 ${refs.hours.value}시간 · ${refs.days.value}일. 문제 수나 암기 개수는 따로 관리하지 않습니다.</p>`}
function openBuilder(){refs.builder.style.display='block';const suggested=sessionStorage.getItem('lifeSpecupSuggestedCert');if(suggested&&certs.some(x=>x.name===suggested))refs.cert.value=suggested;preview();refs.builder.scrollIntoView({behavior:'smooth',block:'center'})}
refs.cert.innerHTML=certs.map(x=>`<option value="${safe(x.name)}">${safe(x.name)}</option>`).join('');
refs.newGoal.addEventListener('click',openBuilder);refs.close.addEventListener('click',()=>refs.builder.style.display='none');refs.create.addEventListener('click',createGoal);[refs.cert,refs.stage,refs.hours,refs.days].forEach(x=>x.addEventListener('change',preview));
preview();render();
})();
