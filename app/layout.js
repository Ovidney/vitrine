import './globals.css';import Link from 'next/link';import {Bricolage_Grotesque,Figtree} from 'next/font/google';
const d=Bricolage_Grotesque({subsets:['latin'],variable:'--fd'});const b=Figtree({subsets:['latin'],variable:'--fb'});
export const metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000'),title:{default:'Luciana Rodrigues — Casa e receitas',template:'%s | Luciana Rodrigues'},description:'Os produtos que uso em casa e as receitas que faço, com links para comprar.'};
export default function L({children}){return(<html lang="pt-BR" className={d.variable+' '+b.variable}><body>
<header className="top"><Link href="/" className="logo">Luciana Rodrigues</Link><nav><Link href="/produtos">Produtos</Link><Link href="/receitas">Receitas</Link></nav></header>
<main>{children}</main><footer>Alguns links são de afiliados: se você comprar por eles, posso receber uma comissão, sem custo extra para você.</footer></body></html>);}
