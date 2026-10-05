window.CERT_AI={
tierValue:{"S+":100,"S":94,"A+":86,"A":78,"A-":72,"B+":65,"B":58,"B-":52,"C+":45,"C":38,"D+":31,"D":25},
fmFit:{
"전기기사":1,"전기산업기사":.88,"전기기능사":.55,"전기공사기사":.72,"전기공사산업기사":.58,
"산업안전기사":.70,"산업안전산업기사":.56,"소방설비기사(전기분야)":.78,"소방설비산업기사(전기분야)":.64,
"소방설비기사(기계분야)":.58,"승강기기사":.46,"승강기산업기사":.38,"에너지관리기사":.42,"공조냉동기계기사":.44
},
families:{
electric:["전기기사","전기산업기사","전기기능사"],construction:["전기공사기사","전기공사산업기사"],fire:["소방설비기사(전기분야)","소방설비산업기사(전기분야)","소방설비기사(기계분야)"],safety:["산업안전기사","산업안전산업기사"],facility:["승강기기사","승강기산업기사","에너지관리기사","공조냉동기계기사"]
},
get(name){return (window.CERTS||[]).find(c=>c.name===name)},
family(name){return Object.entries(this.families).find(([k,v])=>v.includes(name))?.[0]||"other"},
value(name){let c=this.get(name);return c?this.tierValue[c.tier]||40:40},
fit(name){return this.fmFit[name]??.22},
marginal(name,owned,years=0){
 let c=this.get(name),base=this.value(name),fit=this.fit(name),fam=this.family(name);
 let same=[...owned].filter(x=>this.family(x)===fam).length;
 let articleCount=[...owned].filter(x=>/기사/.test(x)&&!/산업기사/.test(x)).length;
 let novelty=1/(1+same*.42),collector=1/(1+Math.max(0,articleCount-2)*.16);
 let synergy=1;
 if(name==="소방설비기사(전기분야)"&&(owned.has("전기기사")||owned.has("전기산업기사")))synergy=1.22;
 if(name==="산업안전기사"&&(owned.has("전기기사")||owned.has("전기산업기사")))synergy=1.15;
 if(name==="전기공사기사"&&owned.has("전기기사"))synergy=1.12;
 let bottleneck=years<2&&fam!=="electric"?.72:1;
 return Math.round(base*fit*novelty*collector*synergy*bottleneck/10);
},
explain(name,owned,years){
 let fam=this.family(name),m=this.marginal(name,owned,years),c=this.get(name);
 if(name==="소방설비기사(전기분야)"&&(owned.has("전기기사")||owned.has("전기산업기사")))return `${name}(${c?.tier||"?"})는 전기 자격과 결합해 FM의 전기+소방 복수역량을 만듭니다. 다만 경력 ${years}년이면 ${years<2?"현재는 경력 병목 때문에 효과 일부가 제한됩니다.":"시너지 효과를 비교적 온전히 활용할 수 있습니다."}`;
 if(fam==="electric"&&!owned.has("전기기사")&&name==="전기기사")return `전기기사(${c?.tier||"A+"})는 FM 전기의 핵심 자격 축입니다. 산업기사보다 상위 시장에서 활용 폭과 선임 경로가 넓어지는 방향으로 평가합니다.`;
 if(m<=3)return `${name}(${c?.tier||"?"}) 자체 가치는 있지만 현재 빌드에서는 중복효과가 커 추가 효율이 낮습니다.`;
 return `${name}(${c?.tier||"?"})의 도감 시장가치와 FM 적합도를 반영한 추가 효과입니다.`;
}};