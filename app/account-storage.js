(function(){
const GLOBAL=new Set(["lifeSpecupAccounts","lifeSpecupActiveUser","lifeSpecupLegacyMigrated","lifeSpecupAccount","lifeSpecupSession"]);
const DATA_PREFIXES=["lifeSpecupUser","lifeSpecupState","lifeSpecupQuests","lifeSpecupFinance","lifeSpecupVerifiedCerts","lifeSpecupEmblems","lifeSpecupEquippedEmblems","lifeSpecupProofs","lifeSpecupCareerPrefs","lifeSpecupCareerProfile","lifeSpecupSchema","lifeSpecupTargetBuild"];
const rawGet=Storage.prototype.getItem,rawSet=Storage.prototype.setItem,rawRemove=Storage.prototype.removeItem;
function active(){return rawGet.call(localStorage,"lifeSpecupActiveUser")||""}
function isUserKey(k){return DATA_PREFIXES.some(x=>k===x)}
function scoped(k){let a=active();return a&&isUserKey(k)?`lifeSpecup:${a}:${k}`:k}
Storage.prototype.getItem=function(k){return rawGet.call(this,scoped(String(k)))}
Storage.prototype.setItem=function(k,v){return rawSet.call(this,scoped(String(k)),v)}
Storage.prototype.removeItem=function(k){return rawRemove.call(this,scoped(String(k)))}
window.LifeAccounts={
 rawGet:k=>rawGet.call(localStorage,k),rawSet:(k,v)=>rawSet.call(localStorage,k,v),rawRemove:k=>rawRemove.call(localStorage,k),
 accounts(){try{return JSON.parse(rawGet.call(localStorage,"lifeSpecupAccounts")||"{}")}catch{return{}}},
 saveAccounts(v){rawSet.call(localStorage,"lifeSpecupAccounts",JSON.stringify(v))},
 active,
 setActive(id){rawSet.call(localStorage,"lifeSpecupActiveUser",id);rawSet.call(localStorage,"lifeSpecupSession","1")},
 logout(){rawRemove.call(localStorage,"lifeSpecupActiveUser");rawRemove.call(localStorage,"lifeSpecupSession")},
 hasData(id,k){return rawGet.call(localStorage,`lifeSpecup:${id}:${k}`)!==null},
 setFor(id,k,v){rawSet.call(localStorage,`lifeSpecup:${id}:${k}`,typeof v==="string"?v:JSON.stringify(v))},
 getFor(id,k){return rawGet.call(localStorage,`lifeSpecup:${id}:${k}`)},
 migrateLegacy(){
   if(rawGet.call(localStorage,"lifeSpecupLegacyMigrated")==="1")return;
   let legacyAcc;try{legacyAcc=JSON.parse(rawGet.call(localStorage,"lifeSpecupAccount")||"{}")}catch{}
   let legacyUser;try{legacyUser=JSON.parse(rawGet.call(localStorage,"lifeSpecupUser")||"{}")}catch{}
   let id=(legacyAcc&&legacyAcc.userId)||(legacyUser&&legacyUser.userId);
   if(!id)return;
   let acc=this.accounts();if(!acc[id])acc[id]={userId:id,password:legacyAcc?.password||"",createdAt:new Date().toISOString(),legacy:true};this.saveAccounts(acc);
   DATA_PREFIXES.forEach(k=>{let val=rawGet.call(localStorage,k);if(val!==null&&!this.hasData(id,k))this.setFor(id,k,val)});
   rawSet.call(localStorage,"lifeSpecupLegacyMigrated","1");
 }
};
LifeAccounts.migrateLegacy();
})();