window.CERT_AI_V2={
tierValue:{"S+":100,"S":94,"A+":86,"A":78,"A-":72,"B+":65,"B":58,"B-":52,"C+":45,"C":38,"D+":31,"D":25},
families:{
electric:{items:["전기기능사","전기산업기사","전기기사","전기기능장","전기안전기술사","건축전기설비기술사","발송배전기술사"],rank:{"전기기능사":1,"전기산업기사":2,"전기기사":3,"전기기능장":4,"전기안전기술사":5,"건축전기설비기술사":5,"발송배전기술사":5}},
construction:{items:["전기공사산업기사","전기공사기사"],rank:{"전기공사산업기사":2,"전기공사기사":3}},
fireE:{items:["소방설비산업기사(전기분야)","소방설비기사(전기분야)"],rank:{"소방설비산업기사(전기분야)":2,"소방설비기사(전기분야)":3}},
fireM:{items:["소방설비산업기사(기계분야)","소방설비기사(기계분야)"],rank:{"소방설비산업기사(기계분야)":2,"소방설비기사(기계분야)":3}},
safety:{items:["산업안전산업기사","산업안전기사"],rank:{"산업안전산업기사":2,"산업안전기사":3}},
elevator:{items:["승강기기능사","승강기산업기사","승강기기사"],rank:{"승강기기능사":1,"승강기산업기사":2,"승강기기사":3}}
},
fmFit:{"전기기사":1,"전기산업기사":.88,"전기기능사":.55,"전기공사기사":.68,"전기공사산업기사":.5,"산업안전기사":.67,"산업안전산업기사":.5,"소방설비기사(전기분야)":.76,"소방설비산업기사(전기분야)":.58,"소방설비기사(기계분야)":.54,"승강기기사":.42},
get(n){return (window.CERTS||[]).find(c=>c.name===n)},family(n){return Object.entries(this.families).find(([k,v])=>v.items.includes(n))?.[0]||"other"},
rank(n){let f=this.families[this.family(n)];return f?.rank[n]||(/기술사|기능장/.test(n)?5:/기사/.test(n)&&!/산업기사/.test(n)?3:/산업기사/.test(n)?2:/기능사/.test(n)?1:1)},
fit(n){return this.fmFit[n]??.18},tier(n){return this.tierValue[this.get(n)?.tier]||35},
supply(n){let m=CERT_MARKET.get(n);return m?CERT_MARKET.supplyPenalty[m.supply]||.9:.9},
portfolio(owned,years=0){
 let set=new Set(owned),familyScores={},residual=0,axes=0,details=[];
 for(let [fk,f] of Object.entries(this.families)){
   let have=f.items.filter(n=>set.has(n));if(!have.length)continue;axes++;
   have.sort((a,b)=>this.rank(b)-this.rank(a)||this.tier(b)-this.tier(a));
   let top=have[0],sp=this.supply(top),topRaw=this.tier(top)*this.fit(top)*(0.75+0.25*sp)/10;
   let rest=have.slice(1).reduce((s,n,i)=>s+Math.min(1.5,this.tier(n)*this.fit(n)*this.supply(n)/10*.12/(i+1)),0);
   familyScores[fk]=topRaw+rest;residual+=rest;details.push({family:fk,top,rest,have});
 }
 let other=[...set].filter(n=>this.family(n)==="other"&&this.get(n)),otherVal=other.reduce((s,n,i)=>s+Math.min(1.2,this.tier(n)*this.fit(n)*this.supply(n)/10*.35/(1+i*.5)),0);
 let diversity=[0,0,2.5,4.5,5.8,6.6,7.1][Math.min(6,axes)]||0;
 let career=Math.min(32,years*8),core=Object.values(familyScores).reduce((a,b)=>a+b,0);
 return{score:Math.min(92,Math.round(10+core+otherVal+diversity+career)),core,residual,diversity,career,axes,details,otherVal}
 },
marginal(n,owned,years=0){let a=this.portfolio(owned,years).score,b=new Set(owned);b.add(n);return Math.max(0,this.portfolio(b,years).score-a)},
explain(n,owned,years=0){
 let c=this.get(n),m=CERT_MARKET.get(n),fam=this.family(n),same=[...owned].filter(x=>this.family(x)===fam),higher=same.find(x=>this.rank(x)>this.rank(n)),lower=same.filter(x=>this.rank(x)<this.rank(n));
 if(higher)return `${n}(${c?.tier||"?"})보다 상위인 ${higher}를 이미 보유해 핵심 직무가치는 대부분 흡수됩니다. 다만 복수 자격 보유 신호를 소폭 인정합니다.`;
 if(lower.length)return `${n}(${c?.tier||"?"}) 취득으로 ${lower.join("·")}의 핵심가치가 상위 자격으로 승격됩니다. 기존 하위 자격은 작은 잔존가치만 남습니다.`;
 let supply=m?` 2025 신규 합격 ${m.annualPass.toLocaleString()}명으로 공급은 ${CERT_MARKET.supplyLabel[m.supply]} 수준입니다.`:"";
 return `${n}(${c?.tier||"?"})는 새로운 ${fam} 역량축을 추가합니다.${supply}${years<2&&fam!=="electric"?" 현재는 관련경력 병목 때문에 추가효과를 보수적으로 봅니다.":""}`;
}};