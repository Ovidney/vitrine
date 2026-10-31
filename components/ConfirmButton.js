'use client';
export default function ConfirmButton({msg,children}){return <button onClick={e=>{if(!confirm(msg))e.preventDefault();}}>{children}</button>;}
