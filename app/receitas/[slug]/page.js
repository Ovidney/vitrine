import Image from 'next/image';import {notFound} from 'next/navigation';import {sql} from '../../../lib/db';
export const dynamic='force-dynamic';
export async function generateMetadata({params}){try{const [r]=await sql`select nome,descricao from receitas where slug=${params.slug}`;return r?{title:r.nome,description:r.descricao}:{};}catch{return {};}}
export default async function Receita({params}){let r;try{[r]=await sql`select * from receitas where slug=${params.slug} and ativo`;}catch{notFound();}if(!r)notFound();
return(<article className="rec">{r.imagem&&<div className="rhero"><Image src={r.imagem} alt={r.nome} fill priority sizes="720px"/></div>}
<h1>{r.nome}</h1><p className="mut">{r.descricao}</p><div className="facts">{r.tempo_preparo&&<span>Preparo: {r.tempo_preparo}</span>}{r.rendimento&&<span>Rende: {r.rendimento}</span>}</div>
<h2>Ingredientes</h2><ul className="ing" style={{padding:0}}>{r.ingredientes.map((i,k)=><li key={k}><b>{i.qtd}</b><span>{i.item}</span></li>)}</ul>
<h2>Modo de preparo</h2><ol className="steps">{r.etapas.map((e,k)=><li key={k}>{e}</li>)}</ol>
{r.fotos?.length>0&&<div className="grid" style={{marginTop:24}}>{r.fotos.map(f=><div key={f} className="ph" style={{borderRadius:18}}><Image src={f} alt="" fill sizes="300px"/></div>)}</div>}</article>);}
