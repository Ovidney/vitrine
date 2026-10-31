'use client';
async function encolher(f){try{const b=await createImageBitmap(f);const m=1400,s=Math.min(1,m/Math.max(b.width,b.height));const c=document.createElement('canvas');c.width=Math.round(b.width*s);c.height=Math.round(b.height*s);
c.getContext('2d').drawImage(b,0,0,c.width,c.height);const blob=await new Promise(r=>c.toBlob(r,'image/jpeg',0.82));if(!blob)return f;return new File([blob],f.name.replace(/\.[^.]+$/,'')+'.jpg',{type:'image/jpeg'});}catch(e){return f;}}
export default function ImageInput({name,multiple}){return <input type="file" name={name} accept="image/*" multiple={multiple} onChange={async e=>{const t=e.target,d=new DataTransfer();for(const f of [...t.files])d.items.add(await encolher(f));t.files=d.files;}}/>;}
