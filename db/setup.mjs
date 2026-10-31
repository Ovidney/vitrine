import {neon} from '@neondatabase/serverless';import fs from 'fs';
const sql=neon(process.env.DATABASE_URL);
for(const s of fs.readFileSync(new URL('./schema.sql',import.meta.url),'utf8').split(/;\s*\n/).filter(x=>x.trim()))await sql(s);
console.log('Banco pronto.');
