import Link from 'next/link';import ImageInput from '../../../components/ImageInput';import {sql} from '../../../lib/db';import {salvarReceita} from '../actions';export const dynamic='force-dynamic';export const metadata={title:'Receita',robots:'noindex'};
export default async function R({searchParams}){const [r]=searchParams.id?await sql`select * from receitas where id=${searchParams.id}`:[{}];
const ing=(r.ingredientes||[]).map(i=>i.qtd?`${i.qtd} | ${i.item}`:i.item).join('\n'),eta=(r.etapas||[]).join('\n');
return(<><p><Link href="/admin">← Voltar ao painel</Link></p><h1>{r.id?'Editar receita':'Nova receita'}</h1>
{searchParams.erro&&<p role="alert"><b>Não deu certo:</b> {searchParams.erro}</p>}<form className="f" action={salvarReceita}>{r.id&&<input type="hidden" name="id" value={r.id}/>}
<input name="nome" placeholder="Nome da receita" defaultValue={r.nome} required/><textarea name="descricao" placeholder="Descrição breve" rows="2" defaultValue={r.descricao||''}/>
<input name="tempo" placeholder="Tempo de preparo, ex.: 50 min" defaultValue={r.tempo_preparo||''}/><input name="rendimento" placeholder="Rendimento, ex.: 12 fatias" defaultValue={r.rendimento||''}/>
<input name="categoria" placeholder="Categoria, ex.: Bolos" defaultValue={r.categoria||''}/>
<label>Ingredientes: um por linha, no formato <b>quantidade | ingrediente</b><textarea name="ingredientes" rows="8" placeholder={'2 xícaras | farinha de trigo\n3 | ovos'} defaultValue={ing}/></label>
<label>Modo de preparo: uma etapa por linha<textarea name="etapas" rows="8" placeholder={'Bata os ovos com o açúcar.\nAcrescente a farinha.'} defaultValue={eta}/></label>
<label>Foto principal {r.imagem&&<span className="mut">(já tem uma; envie outra só para trocar)</span>}<ImageInput name="foto"/></label>
<label>Fotos extras (pode escolher várias){r.fotos?.length>0&&<span className="mut"> (já tem {r.fotos.length}; as novas são somadas)</span>}<ImageInput name="fotos" multiple/></label>
{r.fotos?.length>0&&<label><input type="checkbox" name="limpar" style={{width:'auto'}}/> Apagar as fotos extras atuais</label>}
<label><input type="checkbox" name="destaque" defaultChecked={r.destaque} style={{width:'auto'}}/> Mostrar na página inicial</label><button className="btn">Salvar receita</button></form></>);}
