window.CAREER_SCORE={
version:"3.0",
certLevel(certs){let s=new Set(certs),v=0;if(s.has("전기기능사"))v=28;if(s.has("전기산업기사"))v=52;if(s.has("전기기사"))v=68;if(s.has("전기기능장"))v=Math.max(v,78);if([...s].some(x=>x.includes("기술사")))v=Math.max(v,90);let axes=0;if(s.has("소방설비기사(전기분야)"))axes+=8;if(s.has("산업안전기사"))axes+=6;if(s.has("전기공사기사"))axes+=6;return Math.min(96,v+Math.min(12,axes))},
careerLevel(years,track){let req=track.requirements.minYears||0;if(track.type==="신입")return Math.min(85,35+years*18);if(track.type==="경력"&&req===0)return Math.min(92,years*20);if(req===0)return Math.min(90,35+years*18);let ratio=years/req;return Math.min(96,Math.round(18+ratio*62))},
experienceLevel(p){let base=p.facility==="strong"?85:p.facility==="some"?58:25;if(p.years>=2)base+=8;if(p.years>=4)base+=6;return Math.min(96,base)},
educationLevel(p){return Math.min(95,(p.edu>=3?68:p.edu>=2?55:38)+(p.major==="yes"?22:0))},
languageLevel(p){return p.ts>=130||p.opic>=5?88:p.ts>=110||p.opic>=2?68:p.toeic>=800?58:p.toeic>=700?45:25},
fitLevel(p){let c=new Set(p.certs),x=35;if(c.has("전기기사")||c.has("전기산업기사"))x+=25;if(p.facility==="strong")x+=20;else if(p.facility==="some")x+=10;if(p.years>=1)x+=10;return Math.min(95,x)},
evaluate(track,p,exam={}){
 let c={cert:this.certLevel(p.certs),career:this.careerLevel(p.years,track),experience:this.experienceLevel(p),education:this.educationLevel(p),fit:this.fitLevel(p),language:this.languageLevel(p),ncs:exam.ncs??null,exam:exam.exam??null},w=track.axes,sum=0,known=0,total=0;
 Object.entries(w).forEach(([k,v])=>{total+=v;if(c[k]!=null){sum+=c[k]*v;known+=v}});
 let raw=Math.round(sum/known),r=track.requirements,certOK=!r.certAny.length||r.certAny.some(x=>p.certs.has(x)),careerOK=p.years>=(r.minYears||0),eligible=true,caps=[];
 if(r.certMode==="required"&&!certOK){raw=Math.min(raw,38);eligible=false;caps.push("필수 자격 미충족")}
 if((r.minYears||0)>0&&!careerOK){let ratio=p.years/r.minYears,cap=Math.round(30+Math.min(1,ratio)*22);raw=Math.min(raw,cap);eligible=false;caps.push(`관련경력 ${p.years.toFixed(1)}/${r.minYears}년`)}
 // Public without exam scores cannot look competitive just from credentials
 if(track.public&&(c.ncs==null||c.exam==null)){raw=Math.min(raw,45);caps.push("NCS·전공 미입력")}
 let confidence=track.confidence,unc=confidence==="high"?7:confidence==="medium"?12:20;if(known<total)unc+=Math.round((total-known)/total*15);
 let gap=raw-track.baseline,position=gap>=8?"기준선 상회":gap>=0?"경쟁권":gap>=-10?"근접":"보강 필요";
 return{score:raw,baseline:track.baseline,gap,position,eligible,caps,components:c,coverage:Math.round(known/total*100),confidence,range:[Math.max(0,raw-unc),Math.min(100,raw+unc)]}
},
marginal(track,p,change,exam){let a=this.evaluate(track,p,exam),q={...p,certs:new Set(p.certs)};if(change.cert)q.certs.add(change.cert);if(change.years)q.years+=change.years;if(change.facility)q.facility=change.facility;let b=this.evaluate(track,q,exam);return{before:a,after:b,delta:b.score-a.score}}
};