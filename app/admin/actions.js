'use server';
import {cookies} from 'next/headers';import {redirect} from 'next/navigation';import {revalidatePath} from 'next/cache';import {put} from '@vercel/blob';
import {SCHEMA} from '../../lib/schema';import {sql,slugify} from '../../lib/db';import {makeToken,checkToken} from '../../lib/auth';
async function guard(){if(!(await checkToken(cookies().get('adm')?.value)))redirect('/admin/login');}
export async function login(fd){if(fd.get('senha')!==process.env.ADMIN_PASSWORD)redirect('/admin/login?erro=1');
cookies().set('adm',await makeToken(),{httpOnly:true,secure:true,sameSite:'lax',path:'/',maxAge:604800});redirect('/admin');}
export async function logout(){cookies().delete('adm');redirect('/admin/login');}
async function up(f){if(!f||!f.size)return null;return (await put('img/'+Date.now()+'-'+f.name,f,{access:'public'})).url;}
export async function salvarProduto(fd){await guard();const nome=fd.get('nome');const img=await up(fd.get('foto'));const preco=fd.get('preco')?String(fd.get('preco')).replace(',','.'):null;
await sql`insert into produtos(slug,nome,descricao,preco,loja,link_afiliado,imagem,ambiente_id,destaque) values(${slugify(nome)+'-'+Date.now().toString(36)},${nome},${fd.get('descricao')||null},${preco},${fd.get('loja')||null},${fd.get('link')},${img},${fd.get('ambiente')||null},${fd.get('destaque')==='on'})`;
revalidatePath('/','layout');redirect('/admin');}
export async function alternar(fd){await guard();await sql`update produtos set ativo=not ativo where id=${fd.get('id')}`;revalidatePath('/','layout');}
export async function excluir(fd){await guard();await sql`delete from produtos where id=${fd.get('id')}`;revalidatePath('/','layout');}
export async function instalar(){await guard();let erro='';
try{if(!process.env.DATABASE_URL)throw new Error('O banco (Neon) ainda não está conectado ao projeto. Falta DATABASE_URL.');
for(const s of SCHEMA.split(/;\s*\n/).filter(x=>x.trim())){const t=[s];t.raw=[s];await sql(t);}}catch(e){erro=String(e.message||e).slice(0,300);}
if(erro)redirect('/admin/instalar?erro='+encodeURIComponent(erro));revalidatePath('/','layout');redirect('/admin');}
