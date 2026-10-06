let data=JSON.parse(localStorage.getItem("lifeSpecupFinance")||'{"deposits":[],"stocks":[],"housing":[],"debts":[],"expenses":[]}');
["deposits","stocks","housing","debts","expenses"].forEach(k=>data[k]=data[k]||[]);
const fmt=n=>Math.round(+n||0).toLocaleString("ko-KR")+"원";
function save(doRender=true){localStorage.setItem("lifeSpecupFinance",JSON.stringify(data));if(doRender)render()}
function field(label,key,val,type="text",list=""){return `<label class="field"><span>${label}</span><input ${type==="number"?'type="number" min="0" step="any"':""} ${list?`list="${list}"`:""} data-key="${key}" value="${val??""}"></label>`}
function bind(list,key){
 document.querySelector(list).querySelectorAll("input,select").forEach(el=>el.onchange=e=>{
  let i=+e.target.closest(".row-card").dataset.i,obj=data[key][i],k=e.target.dataset.key;obj[k]=e.target.value;
  if(key==="debts"&&["balance","rate","method","months"].includes(k)&&!obj.manualMonthly)obj.monthly=calcMonthly(obj);
  save();
 })
}
function del(k,i){data[k].splice(i,1);save()}
function addDeposit(){data.deposits.push({name:"적금",bank:"",amount:0,rate:0,monthlySaving:0});save()}
function addStock(){data.stocks.push({name:"증권계좌",company:"",amount:0,monthlyInvest:0});save()}
function addHousing(){data.housing.push({type:"월세",name:"거주지",assetValue:0,deposit:0,monthlyRent:0});save()}
function addDebt(){data.debts.push({bank:"",name:"신용대출",original:0,balance:0,rate:0,method:"원리금균등",months:36,monthly:0,manualMonthly:false});save()}
function addExpense(){data.expenses.push({name:"통신비",amount:0});save()}
function calcMonthly(x){
 const P=Math.max(0,+x.balance||0),annual=Math.max(0,+x.rate||0)/100,n=Math.max(1,Math.round(+x.months||1)),r=annual/12;
 if(!P)return 0;
 if(x.method==="원리금균등")return r===0?P/n:P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
 if(x.method==="원금균등")return P/n+P*r;
 if(x.method==="만기일시상환"||x.method==="마이너스통장")return P*r;
 return 0;
}
function setManual(i,v){data.debts[i].monthly=Math.max(0,+v||0);data.debts[i].manualMonthly=true;save()}
function resetAuto(i){data.debts[i].manualMonthly=false;data.debts[i].monthly=calcMonthly(data.debts[i]);save()}
function autoExpenses(){
 let a=[];
 data.deposits.forEach(x=>{if(+x.monthlySaving>0)a.push({name:`예적금 · ${x.name||"저축"}`,amount:+x.monthlySaving,type:"저축"})});
 data.stocks.forEach(x=>{if(+x.monthlyInvest>0)a.push({name:`투자 · ${x.name||"정기투자"}`,amount:+x.monthlyInvest,type:"투자"})});
 data.housing.forEach(x=>{if(+x.monthlyRent>0)a.push({name:`주거 · ${x.name||x.type}`,amount:+x.monthlyRent,type:"주거"})});
 data.debts.forEach(x=>{if(+x.monthly>0)a.push({name:`부채 · ${x.bank?x.bank+" ":""}${x.name||""}`,amount:+x.monthly,type:"부채"})});
 return a
}
function updateSummary(){
 let assets=data.deposits.reduce((s,x)=>s+(+x.amount||0),0)+data.stocks.reduce((s,x)=>s+(+x.amount||0),0)+data.housing.reduce((s,x)=>s+(+x.assetValue||0)+(+x.deposit||0),0),debt=data.debts.reduce((s,x)=>s+(+x.balance||0),0),debtPay=data.debts.reduce((s,x)=>s+(+x.monthly||0),0),housingPay=data.housing.reduce((s,x)=>s+(+x.monthlyRent||0),0),manual=data.expenses.reduce((s,x)=>s+(+x.amount||0),0),saving=data.deposits.reduce((s,x)=>s+(+x.monthlySaving||0),0)+data.stocks.reduce((s,x)=>s+(+x.monthlyInvest||0),0),essential=debtPay+housingPay+manual;
 sumAssets.textContent=fmt(assets);sumDebt.textContent=fmt(debt);sumNet.textContent=fmt(assets-debt);sumOut.textContent=fmt(essential+saving);essentialOut.textContent=fmt(essential);savingOut.textContent=fmt(saving);debtOut.textContent=fmt(debtPay);let ratio=assets?Math.min(999,debt/assets*100):debt?999:0,flow=essential+saving,saveShare=flow?saving/flow*100:0;financePulse.innerHTML=`<div><small>DEBT / ASSET</small><b>${ratio.toFixed(1)}%</b><span>${ratio===0?'부채 없음':ratio<30?'안정 구간':ratio<70?'관리 필요':'부채 비중 높음'}</span></div><div><small>MONTHLY BUILD</small><b>${saveShare.toFixed(0)}%</b><span>월 고정유출 중 저축·투자 비중</span></div><div><small>NET POSITION</small><b class="${assets-debt<0?'bad':'good'}">${assets-debt<0?'NEGATIVE':'POSITIVE'}</b><span>${fmt(assets-debt)}</span></div>`
}
function render(){
 data.deposits.forEach(x=>{if(x.monthlySaving===undefined)x.monthlySaving=0});
 data.stocks.forEach(x=>{if(x.monthlyInvest===undefined)x.monthlyInvest=0});
 depositList.innerHTML=data.deposits.map((x,i)=>`<div class="row-card" data-i="${i}"><div class="row-head"><b>${x.name||"예적금"}</b><button class="danger smallbtn" onclick="del('deposits',${i})">삭제</button></div><div class="form-grid">${field("상품명","name",x.name)}${field("금융기관","bank",x.bank)}${field("현재 잔액","amount",x.amount,"number")}${field("금리(%)","rate",x.rate,"number")}${field("월 납입액","monthlySaving",x.monthlySaving,"number")}</div></div>`).join("")||'<p class="sub">등록된 예적금이 없습니다.</p>';bind("#depositList","deposits");
 stockList.innerHTML=data.stocks.map((x,i)=>`<div class="row-card" data-i="${i}"><div class="row-head"><b>${x.name||"투자계좌"}</b><button class="danger smallbtn" onclick="del('stocks',${i})">삭제</button></div><div class="form-grid">${field("계좌/상품명","name",x.name)}${field("증권사","company",x.company)}${field("현재 평가금액","amount",x.amount,"number")}${field("월 정기투자액","monthlyInvest",x.monthlyInvest,"number")}</div></div>`).join("")||'<p class="sub">등록된 투자계좌가 없습니다.</p>';bind("#stockList","stocks");
 housingList.innerHTML=data.housing.map((x,i)=>`<div class="row-card" data-i="${i}"><div class="row-head"><b>${x.name||"주거"}</b><button class="danger smallbtn" onclick="del('housing',${i})">삭제</button></div><div class="form-grid"><label class="field"><span>주거형태</span><select data-key="type">${["자가","전세","월세","기타"].map(v=>`<option ${x.type===v?"selected":""}>${v}</option>`).join("")}</select></label>${field("이름","name",x.name)}${field("주택 자산가치(자가)","assetValue",x.assetValue,"number")}${field("보증금","deposit",x.deposit,"number")}${field("월세 / 월 주거비","monthlyRent",x.monthlyRent,"number")}</div></div>`).join("")||'<p class="sub">등록된 주거 정보가 없습니다.</p>';bind("#housingList","housing");
 debtList.innerHTML=data.debts.map((x,i)=>{
  if(x.original===undefined)x.original=+x.balance||0;if(x.months===undefined)x.months=36;if(x.manualMonthly===undefined)x.manualMonthly=false;if(!x.manualMonthly)x.monthly=calcMonthly(x);
  let auto=calcMonthly(x),note=x.method==="원금균등"?"첫 달 예상액(이후 감소)":x.method==="만기일시상환"?"월 이자 예상액(만기 원금 별도)":x.method==="마이너스통장"?"현재 잔액 기준 월 이자":"자동 계산";
  return `<div class="row-card" data-i="${i}"><div class="row-head"><div><b>${x.bank||"금융기관 미입력"} · ${x.name||"부채"}</b><div class="muted">남은 원금 ${fmt(x.balance)}</div></div><button class="danger smallbtn" onclick="del('debts',${i})">삭제</button></div>
  <div class="form-grid">${field("금융기관 직접 입력","bank",x.bank,"text","banks")}${field("부채명","name",x.name)}${field("최초 대출금액","original",x.original,"number")}${field("남은 원금","balance",x.balance,"number")}${field("연 이자율(%)","rate",x.rate,"number")}
  <label class="field"><span>상환 방식</span><select data-key="method">${["원리금균등","원금균등","만기일시상환","마이너스통장","기타"].map(v=>`<option ${x.method===v?"selected":""}>${v}</option>`).join("")}</select></label>${field("남은 상환기간(개월)","months",x.months,"number")}
  <label class="field"><span>월 예상/실제 납입금</span><input type="number" min="0" value="${Math.round(+x.monthly||0)}" oninput="setManual(${i},this.value)"><small class="muted">${x.manualMonthly?"직접 수정됨":"자동: "+fmt(auto)+" · "+note}</small></label></div>
  ${x.manualMonthly?`<button class="secondary smallbtn" onclick="resetAuto(${i})">자동 계산값으로 되돌리기</button>`:""}</div>`
 }).join("")||'<p class="sub">등록된 부채가 없습니다.</p>';bind("#debtList","debts");
 let autos=autoExpenses();autoExpenseList.innerHTML=autos.length?autos.map(x=>`<div class="row-card"><div class="row-head"><div><b>${x.name}</b><div class="muted">${x.type}에서 자동 연동</div></div><span class="money">${fmt(x.amount)}/월</span></div></div>`).join(""):'<p class="sub">다른 재정 항목에 월 납입액을 입력하면 자동으로 나타납니다.</p>';
 expenseList.innerHTML=data.expenses.map((x,i)=>`<div class="row-card" data-i="${i}"><div class="row-head"><b>${x.name||"고정지출"}</b><button class="danger smallbtn" onclick="del('expenses',${i})">삭제</button></div><div class="form-grid">${field("항목","name",x.name)}${field("월 금액","amount",x.amount,"number")}</div></div>`).join("")||'<p class="sub">직접 등록한 고정지출이 없습니다.</p>';bind("#expenseList","expenses");updateSummary();localStorage.setItem("lifeSpecupFinance",JSON.stringify(data))
}
document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");document.querySelectorAll(".panel").forEach(x=>x.hidden=true);document.querySelector("#"+t.dataset.tab).hidden=false});render();
if(window.FINANCIAL_INSTITUTIONS&&document.querySelector('#banks'))document.querySelector('#banks').innerHTML=FINANCIAL_INSTITUTIONS.map(x=>`<option value="${x}"></option>`).join('');
