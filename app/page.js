import Link from 'next/link';import {sql} from '../lib/db';import ProductCard from '../components/ProductCard';
export const dynamic='force-dynamic';
export default async function Home(){const [amb,prod,rec]=await Promise.all([sql`select slug,nome from ambientes where ativo order by ordem`,
sql`select * from produtos where ativo and destaque order by created_at desc limit 8`,sql`select slug,nome,descricao,imagem from receitas where ativo and destaque order by created_at desc limit 3`]);
return(<><section className="hero"><h1>O que uso em casa, e o que levo à mesa.</h1><p>Os produtos dos meus vlogs, cômodo por cômodo, e as receitas da minha cozinha.</p></section>
<nav className="rooms" aria-label="Cômodos">{amb.map(a=><Link key={a.slug} href={`/produtos/${a.slug}`}>{a.nome}</Link>)}</nav>
{prod.length>0&&<><h2>Mais recomendados</h2><div className="grid">{prod.map(p=><ProductCard key={p.id} p={p}/>)}</div></>}
{rec.length>0&&<><h2>Receitas em destaque</h2><div className="grid">{rec.map(r=><Link key={r.slug} href={`/receitas/${r.slug}`} className="card"><div className="ph"><span>{r.nome[0]}</span></div><div className="cb"><h3>{r.nome}</h3><p className="mut">{r.descricao}</p></div></Link>)}</div></>}</>);}
