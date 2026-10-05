(function(){
const page=location.pathname.split('/').pop()||'index.html';
if(page==='login.html'||page==='signup.html')return;
if(!window.LifeAccounts||!LifeAccounts.active()){location.replace('login.html');return}
window.lifeSpecupLogout=async function(){try{if(window.LifeCloud)await LifeCloud.signOut();else LifeAccounts.logout()}finally{location.replace('login.html')}};
})();
