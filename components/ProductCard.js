import Image from 'next/image';import {brl} from '../lib/db';
export default function ProductCard({p}){return(<article className="card"><div className="ph">{p.imagem?<Image src={p.imagem} alt={p.nome} fill sizes="(max-width:700px) 50vw,300px"/>:<span>{p.nome[0]}</span>}</div>
<div className="cb"><h3>{p.nome}</h3>{p.descricao&&<p className="mut">{p.descricao}</p>}
<div className="meta">{p.preco!=null&&<b className="preco">{brl(p.preco)}</b>}{p.loja&&<span className="mut">na {p.loja}</span>}</div>
<a className="btn" href={p.link_afiliado} target="_blank" rel="sponsored noopener noreferrer">Comprar aqui</a></div></article>);}
