import {sql} from '../lib/db';
export const dynamic='force-dynamic';
export default async function(){const u=process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000';const [a,r]=await Promise.all([sql`select slug from ambientes where ativo`,sql`select slug from receitas where ativo`]);
return[{url:u},{url:u+'/produtos'},{url:u+'/receitas'},...a.map(x=>({url:`${u}/produtos/${x.slug}`})),...r.map(x=>({url:`${u}/receitas/${x.slug}`}))];}
