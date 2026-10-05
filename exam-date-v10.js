(()=>{
'use strict';
const $=x=>document.getElementById(x), KEY='lifeSpecupQuestStateV6';
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return{}}}
function save(x){localStorage.setItem(KEY,JSON.stringify(x))}
function days(d){if(!d)return null;let a=new Date();a.setHours(0,0,0,0);let b=new Date(d+'T00:00:00');return Math.ceil((b-a)/86400000)}
function inject(){
 let q=load(),g=q.goals?.find?.(x=>x.id===q.activeGoalId)||q.activeGoal;if(!g)return;
 let host=$('activeGoal');if(!host)return;let old=$('examControlV10');if(old)old.remove();
 let d=days(g.examDate),box=document.createElement('div');box.id='examControlV10';box.className='exam-control';
 box.innerHTML=`<span class="dday-chip">${d==null?'시험일 미설정':d>=0?'D-'+d:'시험일 경과'}</span><input id="activeExamDate" type="date" value="${g.examDate||''}"><button class="secondary smallbtn" id="saveExamDate">시험일 수정</button><button class="ghost smallbtn" id="retryExam">재도전 일정</button>`;
 host.appendChild(box);$('saveExamDate').onclick=()=>{g.examDate=$('activeExamDate').value;save(q);inject()};$('retryExam').onclick=()=>$('activeExamDate').focus();
}
function hook(){let create=$('createGoal'),exam=$('examDate');if(create&&exam&&!create.dataset.examHook){create.dataset.examHook='1';create.addEventListener('click',()=>setTimeout(()=>{let z=load(),ng=z.goals?.find?.(x=>x.id===z.activeGoalId)||z.activeGoal;if(ng&&exam.value){ng.examDate=exam.value;save(z);inject()}},100))}}
document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{inject();hook()},150));window.EXAM_DATE_V10={inject};
})();
