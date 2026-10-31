import {login} from '../actions';export const metadata={title:'Entrar',robots:'noindex'};
export default function P({searchParams}){return(<form className="f" action={login}><h1>Área administrativa</h1><input type="password" name="senha" placeholder="Senha" required autoFocus/>{searchParams.erro&&<p role="alert">Senha incorreta.</p>}<button className="btn">Entrar</button></form>);}
