import Link from 'next/link';import ImageInput from '../../../components/ImageInput';import {sql} from '../../../lib/db';import {salvarProduto} from '../actions';export const dynamic='force-dynamic';export const metadata={title:'Produto',robots:'noindex'};
export default async function P({searchParams}){const amb=await sql`select id,nome from ambientes order by ordem`;const [p]=searchParams.id?await sql`select * from produtos where id=${searchParams.id}`:[{}];
return(<><p><Link href="/admin">← Voltar ao painel</Link></p><h1>{p.id?'Editar produto':'Novo produto'}</h1>
{searchParams.erro&&<p role="alert"><b>Não deu certo:</b> {searchParams.erro}</p>}<form className="f" action={salvarProduto}>{p.id&&<input type="hidden" name="id" value={p.id}/>}
<input name="nome" placeholder="Nome do produto" defaultValue={p.nome} required/>
<select name="ambiente" defaultValue={p.ambiente_id||''} required><option value="">Cômodo…</option>{amb.map(a=><option key={a.id} value={a.id}>{a.nome}</option>)}</select>
<input name="link" type="url" placeholder="Link de afiliado" defaultValue={p.link_afiliado} required/><input name="loja" placeholder="Loja (ex.: Amazon)" defaultValue={p.loja||''}/>
<input name="preco" placeholder="Preço (opcional), ex.: 199,90" defaultValue={p.preco||''} inputMode="decimal"/><textarea name="descricao" placeholder="Descrição curta (opcional)" rows="2" defaultValue={p.descricao||''}/>
<label>Foto {p.imagem&&<span className="mut">(já tem uma; envie outra só se quiser trocar)</span>}<ImageInput name="foto"/></label>
<label><input type="checkbox" name="destaque" defaultChecked={p.destaque} style={{width:'auto'}}/> Mostrar na página inicial</label><button className="btn">Salvar produto</button></form></>);}
