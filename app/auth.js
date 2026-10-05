(function(){
const page=location.pathname.split('/').pop()||'index.html';
if(page==='login.html'||page==='signup.html')return;
if(!window.LifeAccounts||!LifeAccounts.active()){location.replace('login.html');return}
window.lifeSpecupLogout=function(){LifeAccounts.logout();location.replace('login.html')};
})();