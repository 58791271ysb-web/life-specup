(function(){
const CFG=window.LIFE_CLOUD_CONFIG||{};
const READY=()=>window.supabase&&CFG.url&&CFG.publishableKey&&!CFG.url.startsWith('PASTE_')&&!CFG.publishableKey.startsWith('PASTE_');
const rawGet=window.LifeRawStorage?.get||Storage.prototype.getItem;
const rawSet=window.LifeRawStorage?.set||Storage.prototype.setItem;
const rawRemove=window.LifeRawStorage?.remove||Storage.prototype.removeItem;
let client=null,timer=null,syncing=false,lastStatus='local';
function normalizeUsername(v){return String(v||'').trim().normalize('NFKC').toLowerCase()}
function usernameEmail(v){const u=normalizeUsername(v);if(!u)throw new Error('아이디를 입력해주세요.');const bytes=new TextEncoder().encode(u);let hex='';bytes.forEach(b=>hex+=b.toString(16).padStart(2,'0'));return `u_${hex}@auth.life-specup.app`}

function getClient(){if(client)return client;if(!READY())return null;client=window.supabase.createClient(CFG.url,CFG.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});return client}
function status(s,msg){lastStatus=s;document.querySelectorAll('[data-cloud-status]').forEach(el=>{el.dataset.state=s;el.textContent=msg||({synced:'클라우드 저장됨',syncing:'동기화 중…',offline:'오프라인 · 기기에 저장',error:'동기화 확인 필요',local:'클라우드 설정 필요'}[s]||s)});window.dispatchEvent(new CustomEvent('lifecloudstatus',{detail:{state:s,message:msg}}))}
function active(){return rawGet.call(localStorage,'lifeSpecupActiveUser')||''}
function scopedPrefix(uid){return `lifeSpecup:${uid}:`}
function snapshot(uid){const p=scopedPrefix(uid),data={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith(p))data[k.slice(p.length)]=rawGet.call(localStorage,k)}return {schema:1,data,updatedAt:new Date().toISOString()}}
function apply(uid,payload){if(!payload||!payload.data)return;const p=scopedPrefix(uid);Object.entries(payload.data).forEach(([k,v])=>rawSet.call(localStorage,p+k,String(v)))}
async function session(){const c=getClient();if(!c)return null;const {data}=await c.auth.getSession();return data.session||null}
async function pull(uid){const c=getClient();if(!c)return {ok:false,reason:'config'};status('syncing');try{const {data,error}=await c.from('life_specup_saves').select('payload,updated_at').eq('user_id',uid).maybeSingle();if(error)throw error;if(data?.payload){apply(uid,data.payload);status('synced','클라우드에서 불러옴');return {ok:true,found:true,updatedAt:data.updated_at}}status('synced','새 클라우드 저장소');return {ok:true,found:false}}catch(e){console.error('[LifeCloud pull]',e);status(navigator.onLine?'error':'offline',navigator.onLine?'동기화 실패':'오프라인 · 기기에 저장');return {ok:false,error:e}}}
async function push(){if(syncing)return;const c=getClient(),uid=active();if(!c||!uid)return;const s=await session();if(!s||s.user.id!==uid)return;syncing=true;status('syncing');try{const payload=snapshot(uid);const {error}=await c.from('life_specup_saves').upsert({user_id:uid,payload,updated_at:new Date().toISOString()},{onConflict:'user_id'});if(error)throw error;rawSet.call(localStorage,'lifeSpecupCloudLastSync',new Date().toISOString());status('synced')}catch(e){console.error('[LifeCloud push]',e);status(navigator.onLine?'error':'offline',navigator.onLine?'동기화 실패 · 기기에는 저장됨':'오프라인 · 기기에 저장')}finally{syncing=false}}
function schedule(){clearTimeout(timer);timer=setTimeout(push,700)}
async function signIn(username,password){const c=getClient();if(!c)throw new Error('CLOUD_NOT_CONFIGURED');const email=usernameEmail(username);const {data,error}=await c.auth.signInWithPassword({email,password});if(error)throw error;const old=active();LifeAccounts.setActive(data.user.id);const remote=await pull(data.user.id);let pending=null;try{pending=JSON.parse(rawGet.call(localStorage,'lifeSpecupPendingCloudProfile')||'null')}catch{};if(pending&&pending.email===email){Object.entries(pending.data||{}).forEach(([k,v])=>rawSet.call(localStorage,scopedPrefix(data.user.id)+k,v));rawRemove.call(localStorage,'lifeSpecupPendingCloudProfile');await push()}else if(remote.ok&&!remote.found&&old&&old!==data.user.id){const oldSnap=snapshot(old);if(Object.keys(oldSnap.data).length){Object.entries(oldSnap.data).forEach(([k,v])=>rawSet.call(localStorage,scopedPrefix(data.user.id)+k,v));await push()}}return data}
async function signUp(username,password){const c=getClient();if(!c)throw new Error('CLOUD_NOT_CONFIGURED');const email=usernameEmail(username);const {data,error}=await c.auth.signUp({email,password,options:{data:{username:normalizeUsername(username)}}});if(error)throw error;if(data.session&&data.user){LifeAccounts.setActive(data.user.id)}return data}
async function signOut(){const c=getClient();try{if(c)await c.auth.signOut()}finally{LifeAccounts.logout()}}
async function boot(){const c=getClient();if(!c){status('local');return {configured:false}};const s=await session();if(!s){status('error','로그인 필요');return {configured:true,session:null}};LifeAccounts.setActive(s.user.id);await pull(s.user.id);return {configured:true,session:s}}
window.LifeCloud={configured:READY,getClient,session,pull,push,schedule,signIn,signUp,signOut,boot,status,snapshot,apply,normalizeUsername,usernameEmail};
window.addEventListener('online',()=>{status('syncing');schedule()});window.addEventListener('offline',()=>status('offline'));
})();
