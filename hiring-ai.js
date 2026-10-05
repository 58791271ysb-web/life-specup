window.HIRING_AI={
version:"2.4",updated:"2026-10-05",
models:{
private_fm_entry:{label:"민간 FM 신입",weights:{cert:30,career:12,experience:18,education:14,language:6,fit:20}},
private_fm_career:{label:"민간 FM 경력",weights:{cert:24,career:30,experience:22,education:6,language:3,fit:15}},
private_corporate:{label:"대기업 기술직",weights:{cert:14,career:15,experience:18,education:22,language:12,fit:19}},
private_technical:{label:"제조·기술직",weights:{cert:18,career:23,experience:22,education:15,language:5,fit:17}},
datacenter:{label:"데이터센터 전기",weights:{cert:22,career:26,experience:26,education:8,language:5,fit:13}},
private_general:{label:"민간 기술 일반",weights:{cert:20,career:22,experience:20,education:14,language:7,fit:17}},
public_ncs:{label:"공공 기술직",weights:{cert:18,career:6,experience:7,education:5,language:4,fit:10,ncs:25,exam:25}}
},
confidence:{high:{label:"높음",range:8},medium:{label:"보통",range:14},low:{label:"낮음",range:22}},
certScore(certs){
 let p=CERT_AI_V2.portfolio(certs,0);return Math.min(100,Math.round(p.core*5+p.diversity*3))
},
careerScore(years,model){if(model==="private_fm_entry")return Math.min(100,years*28+25);if(model==="public_ncs")return Math.min(100,years*12+35);return Math.min(100,years*20)},
expScore(facility,years){return facility==="strong"?90:facility==="some"?62:Math.min(45,20+years*8)},
eduScore(edu,major){return Math.min(100,(edu>=3?70:edu>=2?55:35)+(major==="yes"?25:0))},
langScore(p){return p.ts>=130||p.opic>=5?90:p.ts>=110||p.opic>=2?68:p.toeic>=800?55:p.toeic>=700?42:20},
fitScore(certs,model){let names=[...certs],elec=names.some(x=>["전기기사","전기산업기사"].includes(x)),fire=names.includes("소방설비기사(전기분야)"),safe=names.includes("산업안전기사");return Math.min(100,35+(elec?38:0)+(fire?15:0)+(safe?10:0))},
evaluate(org,p,inputs={}){
 let key=org.research?.model||"private_general",m=this.models[key]||this.models.private_general,w=m.weights;
 let comp={cert:this.certScore(p.certs),career:this.careerScore(p.years,key),experience:this.expScore(p.facility,p.years),education:this.eduScore(p.edu,p.major),language:this.langScore(p),fit:this.fitScore(p.certs,key)};
 if(key==="public_ncs"){comp.ncs=inputs.ncs==null?null:+inputs.ncs;comp.exam=inputs.exam==null?null:+inputs.exam}
 let known=0,total=0,sum=0;for(let [k,weight] of Object.entries(w)){total+=weight;if(comp[k]!=null){known+=weight;sum+=comp[k]*weight}}
 let score=Math.round(sum/known),coverage=Math.round(known/total*100),conf=org.research?.confidence||"low";
 let uncertainty=this.confidence[conf].range+(coverage<100?Math.round((100-coverage)*.18):0);
 let low=Math.max(5,score-uncertainty),high=Math.min(95,score+uncertainty);
 let band=score>=78?"높음":score>=64?"중상":score>=50?"보통":score>=38?"도전":"낮음";
 let stage=key==="public_ncs"&&coverage<90?"필기정보 필요":score>=64?"서류 경쟁권":score>=50?"경계권":"보강 필요";
 return{score,low,high,band,stage,coverage,confidence:conf,model:m.label,components:comp,note:this.explain(org,p,{score,coverage,key,comp})}
},
explain(org,p,r){
 if(r.key==="public_ncs"&&r.coverage<90)return `현재 자격·전공·경력 프로필만으로는 공공기관 서류/최종 경쟁력을 확정할 수 없습니다. NCS와 전공 예상점수를 입력하면 범위가 좁아집니다.`;
 let gaps=[];if(r.comp.cert<55)gaps.push("핵심 전기자격");if(r.comp.career<55)gaps.push("관련경력");if(r.comp.experience<55)gaps.push("직접 시설경험");if(r.comp.education<55)gaps.push("전공·학력 적합");
 return gaps.length?`${gaps.slice(0,2).join("·")} 축이 현재 주요 병목입니다.`:"핵심 직무축이 비교적 고르게 갖춰져 있습니다. 실제 서류는 공고별 자기소개서·지원자 풀에 따라 달라질 수 있습니다."
}
};