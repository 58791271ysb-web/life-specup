LifeAccounts.migrateLegacy();
loginForm.onsubmit=e=>{
 e.preventDefault();
 const id=loginId.value.trim(),pw=loginPw.value,accounts=LifeAccounts.accounts(),a=accounts[id];
 if(a&&a.password===pw){LifeAccounts.setActive(id);location.href="index.html";return}
 loginError.textContent="아이디 또는 비밀번호가 일치하지 않습니다.";
};