let page=1, selectedCerts=[];
const pages=[...document.querySelectorAll(".page")],error=document.querySelector("#error");
const JOBS=["전기 시설관리","전기설비 유지보수","대기업 생산기술 전기직","대기업 설비보전 전기직","공기업 전기직","공무원 전기직","전기공사 현장관리","전기안전관리자","반도체 설비 전기직","소방 전기시설관리"];
const CERTS=window.CERTS.map(c=>({name:c.name,base:c.tier,category:c.category,xp:c.xp}));
currentJob.innerHTML=CAREER_STORE.jobs.map(x=>`<option>${x}</option>`).join("");employmentType.innerHTML=CAREER_STORE.employment.map(x=>`<option>${x}</option>`).join("");currentCompanyType.innerHTML=CAREER_STORE.companies.map(x=>`<option>${x}</option>`).join("");employment.onchange=()=>{employedFields.style.display=employment.value==="재직 중"?"block":"none"};
const order=["D","D+","C","C+","B-","B","B+","A-","A","A+","S","S+"];
function shift(t,n){return order[Math.max(0,Math.min(order.length-1,order.indexOf(t)+n))]}
function personalTier(c){
 const job=document.querySelector("#goalJob").value, track=document.querySelector("#track").value, company=document.querySelector("#companyType").value;
 let n=0, electrical=/전기|소방/.test(c.name), targetElec=/전기|설비|시설/.test(job);
 if(electrical&&targetElec)n+=2;
 if(c.name==="전기기능사"){if((track==="고졸"||track==="고졸 이상")&&targetElec)n+=2;if(track==="대졸"||track==="대졸 이상")n-=2;if(document.querySelector("#hireType")?.value==="경력")n-=1}
 if(c.name==="전기산업기사"){if((track==="초대졸"||track==="초대졸 이상")&&targetElec)n+=2;if((track==="고졸"||track==="고졸 이상")&&targetElec)n+=1}
 if(c.name==="전기기사"){if((track==="대졸"||track==="대졸 이상"||document.querySelector("#hireType")?.value==="경력")&&targetElec)n+=2;if((track==="초대졸"||track==="초대졸 이상")&&targetElec)n+=1}
 if(c.name.includes("한국사")){if(company==="공기업"||company==="공공기관"||company==="공무원")n+=2;else if(targetElec)n-=2}
 if(c.name.includes("컴퓨터활용")&&targetElec)n-=1;
 return shift(c.base,n);
}
function show(){
 pages.forEach((x,i)=>x.classList.toggle("active",i===page-1));
 document.querySelector("#bar").style.width=(page/4*100)+"%";
 document.querySelector("#prev").hidden=page===1;document.querySelector("#next").hidden=page===4;document.querySelector("#submit").hidden=page!==4;
 document.querySelectorAll(".steps div").forEach((x,i)=>x.classList.toggle("active",i===page-1));error.textContent="";
 if(page===4)renderPreview();
}
function valid(){
 for(const x of pages[page-1].querySelectorAll("[required]"))if(!x.checkValidity()){x.reportValidity();return false}
 if(page===1&&password.value!==password2.value){error.textContent="비밀번호가 일치하지 않습니다.";return false}
 if(page===1&&LifeAccounts.accounts()[userId.value.trim()]){error.textContent="이미 사용 중인 아이디입니다.";return false}
 if(page===3&&!goalJob.value){error.textContent="검색 결과에서 목표 직무를 선택해주세요.";return false}
 return true;
}
next.onclick=()=>{if(valid()){page++;show()}};prev.onclick=()=>{page--;show()};
function search(input,box,data,pick){
 input.oninput=()=>{let q=input.value.trim();if(!q){box.classList.remove("show");return}let f=data.filter(x=>(x.name||x).includes(q)).slice(0,10);box.innerHTML=f.length?f.map((x,i)=>`<div class="result" data-v="${encodeURIComponent(x.name||x)}"><b>${x.name||x}</b>${x.base?`<small>시장 기본 티어 ${x.base}</small>`:""}</div>`).join(""):'<div class="result">검색 결과 없음</div>';box.classList.add("show")};
 box.onclick=e=>{let r=e.target.closest("[data-v]");if(!r)return;let name=decodeURIComponent(r.dataset.v),item=data.find(x=>(x.name||x)===name);pick(item);input.value="";box.classList.remove("show")};
}
search(jobSearch,jobResults,JOBS,j=>{goalJob.value=j;jobSelected.textContent="✓ "+j});
search(certSearch,certResults,CERTS,c=>{if(!selectedCerts.some(x=>x.name===c.name))selectedCerts.push(c);renderCerts();renderPreview()});
function renderCerts(){certs.innerHTML=selectedCerts.map((c,i)=>`<span class="pill">${c.name} <button type="button" data-i="${i}">×</button></span>`).join("")}
certs.onclick=e=>{if(e.target.dataset.i!==undefined){selectedCerts.splice(+e.target.dataset.i,1);renderCerts();renderPreview()}};
function renderPreview(){preview.innerHTML=selectedCerts.length?'<p class="eyebrow">MY CERTIFICATE TIER</p>'+selectedCerts.map(c=>`<div class="tiercard"><div><b>${c.name}</b><small>${goalJob.value} · ${track.value||"-"}</small></div><div><small>시장</small><span class="tier">${c.base}</span></div><div><small>내 목표</small><span class="tier">${personalTier(c)}</span></div></div>`).join(""):""}
signupForm.onsubmit=async e=>{e.preventDefault();error.textContent="";let b=new Date(birth.value),t=new Date(),age=t.getFullYear()-b.getFullYear();if(t<new Date(t.getFullYear(),b.getMonth(),b.getDate()))age--;let hist=[];if(employment.value==="재직 중"){if(!joinDate.value){error.textContent="재직 중이면 입사일을 입력해주세요.";page=2;show();return}if(new Date(joinDate.value+"T00:00:00")>CAREER_STORE.today()){error.textContent="입사일은 오늘 이후일 수 없습니다.";page=2;show();return}hist.push({id:"signup-current-v4",job:currentJob.value,employmentType:employmentType.value,companyType:currentCompanyType.value,companyName:currentCompanyName.value.trim(),startDate:joinDate.value,endDate:"",current:true,relevant:currentRelevant.checked,source:"signup"})}let email=userId.value.trim(),u={userId:email,nickname:nickname.value,birth:birth.value,age,education:education.value,employment:employment.value,careerHistory:hist,industry:industry.value,goalJob:goalJob.value,companyType:companyType.value,track:track.value,hireType:hireType.value,certificates:selectedCerts.map(c=>({...c,personal:personalTier(c)}))};CAREER_STORE.normalize(u);if(!LifeCloud.configured()){error.textContent="클라우드 설정이 필요합니다. 먼저 SUPABASE-SETUP.md를 따라 연결해주세요.";return}const init={lifeSpecupUser:JSON.stringify(u),lifeSpecupState:JSON.stringify({xp:0,history:[]}),lifeSpecupQuests:JSON.stringify({selected:[],days:{},pending:[],long:[],_schema:13}),lifeSpecupFinance:JSON.stringify({deposits:[],stocks:[],housing:[],debts:[],fixedCosts:[]}),lifeSpecupVerifiedCerts:JSON.stringify([]),lifeSpecupTargetBuild:JSON.stringify({name:"1년 뒤의 나",targetDate:"",careerYears:0,certs:[],createdAt:new Date().toISOString()})};try{submit.disabled=true;submit.textContent="계정 생성 중…";const data=await LifeCloud.signUp(email,password.value);if(data.session&&data.user){LifeAccounts.setActive(data.user.id);Object.entries(init).forEach(([k,v])=>localStorage.setItem(k,v));await LifeCloud.push();location.href="index.html"}else{LifeRawStorage.set.call(localStorage,"lifeSpecupPendingCloudProfile",JSON.stringify({email,data:init}));alert("가입 확인 메일을 보냈습니다. 이메일 인증 후 로그인하면 지금 만든 프로필이 자동 연결됩니다.");location.href="login.html"}}catch(err){console.error(err);error.textContent="가입 실패: "+(err.message||"잠시 후 다시 시도해주세요.")}finally{submit.disabled=false;submit.textContent="캐릭터 생성"}};show();