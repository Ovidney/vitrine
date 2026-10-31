const enc=new TextEncoder();
const key=()=>crypto.subtle.importKey('raw',enc.encode((process.env.AUTH_SECRET||process.env.ADMIN_PASSWORD||'')),{name:'HMAC',hash:'SHA-256'},false,['sign']);
const hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
export async function makeToken(){const t=String(Date.now()+7*864e5);return t+'.'+hex(await crypto.subtle.sign('HMAC',await key(),enc.encode(t)));}
export async function checkToken(v){if(!v||!(process.env.AUTH_SECRET||process.env.ADMIN_PASSWORD))return false;const [t,s]=v.split('.');if(!t||Number(t)<Date.now())return false;return hex(await crypto.subtle.sign('HMAC',await key(),enc.encode(t)))===s;}
