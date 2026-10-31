import Link from 'next/link';import {notFound} from 'next/navigation';import {sql} from '../../lib/db';import ProductCard from '../../components/ProductCard';
export const dynamic='force-dynamic';
export async function generateMetadata({searchParams}){const s=searchParams.c;if(!s)return{title:'Produtos da casa'};const [a]=await sql`select nome from ambientes where slug=${s}`;return{title:a?`${a.nome}: produtos que uso`:'Produtos'};}
export default async function Produtos({searchParams}){const s=searchParams.c;
const amb=await sql`select slug,nome from ambientes where ativo order by ordem`;if(s&&!amb.find(a=>a.slug===s))notFound();
const prod=s?await sql`select p.* from produtos p join ambientes a on a.id=p.ambiente_id where p.ativo and a.slug=${s} order by p.created_at desc`:await sql`select * from produtos where ativo order by created_at desc`;
return(<><h1>Produtos da casa</h1><nav className="rooms" aria-label="Cômodos"><Link href="/produtos" aria-current={!s?'page':undefined}>Todos</Link>
{amb.map(a=><Link key={a.slug} href={`/produtos/${a.slug}`} aria-current={a.slug===s?'page':undefined}>{a.nome}</Link>)}</nav>
{prod.length?<div className="grid">{prod.map(p=><ProductCard key={p.id} p={p}/>)}</div>:<p className="empty">Ainda não há produtos neste cômodo. Volte em breve.</p>}</>);}
