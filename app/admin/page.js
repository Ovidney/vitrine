import Link from 'next/link';import {redirect} from 'next/navigation';import {sql} from '../../lib/db';import ConfirmButton from '../../components/ConfirmButton';
import {alternar,excluir,alternarReceita,excluirReceita,logout} from './actions';export const metadata={title:'Painel',robots:'noindex'};export const dynamic='force-dynamic';
export default async function Admin(){let prod,rec;try{[prod,rec]=await Promise.all([sql`select p.id,p.nome,p.ativo,a.nome amb from produtos p left join ambientes a on a.id=p.ambiente_id order by p.created_at desc`,sql`select id,nome,ativo,categoria from receitas order by created_at desc`]);}catch(e){redirect('/admin/instalar');}
return(<><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><h1>Painel</h1><form action={logout}><button className="btn" style={{padding:'8px 18px'}}>Sair</button></form></div>
<h2>Produtos</h2><p><Link className="btn" style={{display:'inline-block',padding:'10px 20px'}} href="/admin/produto">+ Novo produto</Link></p>
<table><tbody>{prod.map(p=><tr key={p.id}><td>{p.nome}{!p.ativo&&<span className="mut"> (oculto)</span>}</td><td>{p.amb}</td><td><Link href={`/admin/produto?id=${p.id}`}>Editar</Link></td>
<td><form action={alternar}><input type="hidden" name="id" value={p.id}/><button>{p.ativo?'Ocultar':'Mostrar'}</button></form></td>
<td><form action={excluir}><input type="hidden" name="id" value={p.id}/><ConfirmButton msg="Excluir este produto para sempre?">Excluir</ConfirmButton></form></td></tr>)}</tbody></table>
<h2>Receitas</h2><p><Link className="btn" style={{display:'inline-block',padding:'10px 20px'}} href="/admin/receita">+ Nova receita</Link></p>
<table><tbody>{rec.map(p=><tr key={p.id}><td>{p.nome}{!p.ativo&&<span className="mut"> (oculta)</span>}</td><td>{p.categoria}</td><td><Link href={`/admin/receita?id=${p.id}`}>Editar</Link></td>
<td><form action={alternarReceita}><input type="hidden" name="id" value={p.id}/><button>{p.ativo?'Ocultar':'Mostrar'}</button></form></td>
<td><form action={excluirReceita}><input type="hidden" name="id" value={p.id}/><ConfirmButton msg="Excluir esta receita para sempre?">Excluir</ConfirmButton></form></td></tr>)}</tbody></table></>);}
