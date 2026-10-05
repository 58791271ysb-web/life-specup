LifeAccounts.migrateLegacy();
(async()=>{
 if(LifeCloud.configured()){
  const s=await LifeCloud.session();
  if(s){LifeAccounts.setActive(s.user.id);await LifeCloud.pull(s.user.id);location.replace('index.html');return}
  LifeCloud.status('error','아이디로 로그인하면 모든 기기에서 이어집니다');
 }else LifeCloud.status('local','클라우드 키 설정이 필요합니다');
})();
loginForm.onsubmit=async e=>{
 e.preventDefault();loginError.textContent='';
 const username=loginId.value.trim(), password=loginPw.value;
 if(!LifeCloud.configured()){loginError.textContent='클라우드 연결키가 비어 있습니다. app/supabase-config.js의 Publishable Key를 확인해주세요.';return}
 const btn=e.submitter;if(btn){btn.disabled=true;btn.textContent='클라우드에서 불러오는 중…'}
 try{
  try{await LifeCloud.signIn(username,password)}
  catch(firstErr){
   /* v10 로컬 계정이면 첫 로그인 때 자동으로 클라우드 계정으로 승격 */
   const local=LifeAccounts.accounts()[username];
   if(local&&local.password===password){
    const oldId=LifeAccounts.active()||username;
    LifeAccounts.setActive(oldId);
    const created=await LifeCloud.signUp(username,password);
    if(!created.session||!created.user)throw new Error('Supabase의 Confirm email 설정을 OFF로 바꾼 뒤 다시 로그인해주세요.');
    const snap=LifeCloud.snapshot(oldId);
    LifeAccounts.setActive(created.user.id);
    Object.entries(snap.data||{}).forEach(([k,v])=>LifeRawStorage.set.call(localStorage,`lifeSpecup:${created.user.id}:${k}`,v));
    await LifeCloud.push();
   }else throw firstErr;
  }
  location.replace('index.html');
 }catch(err){console.error(err);loginError.textContent='로그인 실패: '+(err.message||'아이디/비밀번호를 확인해주세요.')}
 finally{if(btn){btn.disabled=false;btn.textContent='로그인'}}
};
