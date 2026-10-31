import {neon} from '@neondatabase/serverless';
export const sql=(...a)=>neon(process.env.DATABASE_URL)(...a);
export const brl=v=>v==null?null:Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
export const slugify=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80);
