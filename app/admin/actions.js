'use server';
import {cookies} from 'next/headers';import {redirect} from 'next/navigation';import {revalidatePath} from 'next/cache';import {put} from '@vercel/blob';
import {SCHEMA} from '../../lib/schema';import {sql,slugify} from '../../lib/db';import {makeToken,checkToken} from '../../lib/auth';
async function guard(){if(!(await checkToken(cookies().get('adm')?.value)))redirect('/admin/login');}
export async function login(fd){if(fd.get('senha')!==process.env.ADMIN_PASSWORD)redirect('/admin/login?erro=1');
cookies().set('adm',await makeToken(),{httpOnly:true,secure:true,sameSite:'lax',path:'/',maxAge:604800});redirect('/admin');}
export async function logout(){cookies().delete('adm');redirect('/admin/login');}
async function up(f){if(!f||!f.size)return null;if(!process.env.BLOB_READ_WRITE_TOKEN)throw new Error('As fotos ainda não estão conectadas ao projeto (falta o Blob na aba Storage da Vercel).');
if(f.size>4e6)throw new Error('A foto é grande demais ('+Math.round(f.size/1e6)+' MB). Use uma foto menor.');
return (await put('img/'+f.name.replace(/[^\w.-]/g,'_'),f,{access:'public',addRandomSuffix:true})).url;}
async function seguro(fn,volta){let e='';try{await fn();}catch(x){e=String(x.message||x).slice(0,300);}
if(e)redirect(volta+(volta.includes('?')?'&':'?')+'erro='+encodeURIComponent(e));revalidatePath('/','layout');redirect('/admin');}
export async function salvarProduto(fd){await guard();const id=fd.get('id');return seguro(async()=>{const nome=fd.get('nome');const img=await up(fd.get('foto'));const preco=fd.get('preco')?String(fd.get('preco')).replace(',','.'):null;
const amb=fd.get('ambiente')||null,dest=fd.get('destaque')==='on',desc=fd.get('descricao')||null,loja=fd.get('loja')||null,link=fd.get('link');
if(id)await sql`update produtos set nome=${nome},descricao=${desc},preco=${preco},loja=${loja},link_afiliado=${link},imagem=coalesce(${img},imagem),ambiente_id=${amb},destaque=${dest} where id=${id}`;
else await sql`insert into produtos(slug,nome,descricao,preco,loja,link_afiliado,imagem,ambiente_id,destaque) values(${slugify(nome)+'-'+Date.now().toString(36)},${nome},${desc},${preco},${loja},${link},${img},${amb},${dest})`;
},'/admin/produto'+(id?'?id='+id:''));}
export async function salvarReceita(fd){await guard();const id=fd.get('id');return seguro(async()=>{const nome=fd.get('nome');const img=await up(fd.get('foto'));
const novas=[];for(const f of fd.getAll('fotos')){const u=await up(f);if(u)novas.push(u);}
const ing=String(fd.get('ingredientes')||'').split('\n').map(l=>l.trim()).filter(Boolean).map(l=>{const k=l.indexOf('|');return k<0?{qtd:'',item:l}:{qtd:l.slice(0,k).trim(),item:l.slice(k+1).trim()};});
const eta=String(fd.get('etapas')||'').split('\n').map(l=>l.trim()).filter(Boolean);
const lit=u=>'{'+u.map(x=>'"'+x+'"').join(',')+'}';const j=JSON.stringify(ing),e=JSON.stringify(eta);
const d=[fd.get('descricao')||null,fd.get('tempo')||null,fd.get('rendimento')||null,fd.get('categoria')||null,fd.get('destaque')==='on'];
if(id){const [r]=await sql`select fotos from receitas where id=${id}`;const base=fd.get('limpar')==='on'?[]:(r?.fotos||[]);
await sql`update receitas set nome=${nome},descricao=${d[0]},tempo_preparo=${d[1]},rendimento=${d[2]},categoria=${d[3]},destaque=${d[4]},imagem=coalesce(${img},imagem),fotos=${lit([...base,...novas])}::text[],ingredientes=${j}::jsonb,etapas=${e}::jsonb where id=${id}`;}
else await sql`insert into receitas(slug,nome,descricao,tempo_preparo,rendimento,categoria,destaque,imagem,fotos,ingredientes,etapas) values(${slugify(nome)+'-'+Date.now().toString(36)},${nome},${d[0]},${d[1]},${d[2]},${d[3]},${d[4]},${img},${lit(novas)}::text[],${j}::jsonb,${e}::jsonb)`;
},'/admin/receita'+(id?'?id='+id:''));}
export async function alternarReceita(fd){await guard();await sql`update receitas set ativo=not ativo where id=${fd.get('id')}`;revalidatePath('/','layout');}
export async function excluirReceita(fd){await guard();await sql`delete from receitas where id=${fd.get('id')}`;revalidatePath('/','layout');}
export async function alternar(fd){await guard();await sql`update produtos set ativo=not ativo where id=${fd.get('id')}`;revalidatePath('/','layout');}
export async function excluir(fd){await guard();await sql`delete from produtos where id=${fd.get('id')}`;revalidatePath('/','layout');}
export async function instalar(){await guard();let erro='';
try{if(!process.env.DATABASE_URL)throw new Error('O banco (Neon) ainda não está conectado ao projeto. Falta DATABASE_URL.');
for(const s of SCHEMA.split(/;\s*\n/).filter(x=>x.trim())){const t=[s];t.raw=[s];await sql(t);}}catch(e){erro=String(e.message||e).slice(0,300);}
if(erro)redirect('/admin/instalar?erro='+encodeURIComponent(erro));revalidatePath('/','layout');redirect('/admin');}
