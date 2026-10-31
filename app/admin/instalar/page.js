import {instalar} from '../actions';export const metadata={title:'Preparar o site',robots:'noindex'};
export default function P(){return(<form className="f" action={instalar}><h1>Quase lá!</h1><p>Clique uma vez no botão para preparar o seu site. Ele cria os cômodos e um produto e uma receita de exemplo.</p><button className="btn">Preparar meu site</button></form>);}
