LifeAccounts.migrateLegacy();
(async()=>{if(LifeCloud.configured()){const s=await LifeCloud.session();if(s){LifeAccounts.setActive(s.user.id);await LifeCloud.pull(s.user.id);location.replace('index.html')}}else{LifeCloud.status('local','Supabase 1회 설정이 필요합니다')}})();
loginForm.onsubmit=async e=>{
 e.preventDefault();loginError.textContent='';
 if(!LifeCloud.configured()){loginError.textContent='클라우드 설정이 아직 안 됐습니다. SUPABASE-SETUP.md 순서대로 1회 연결해주세요.';return}
 const btn=e.submitter; if(btn){btn.disabled=true;btn.textContent='클라우드에서 불러오는 중…'}
 try{await LifeCloud.signIn(loginId.value.trim(),loginPw.value);location.href='index.html'}
 catch(err){console.error(err);loginError.textContent=err.message==='CLOUD_NOT_CONFIGURED'?'클라우드 설정이 필요합니다.':'로그인 실패: '+(err.message||'이메일/비밀번호를 확인해주세요.')}
 finally{if(btn){btn.disabled=false;btn.textContent='로그인'}}
};
