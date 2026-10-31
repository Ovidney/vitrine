import {NextResponse} from 'next/server';import {checkToken} from './lib/auth';
export async function middleware(req){const p=req.nextUrl.pathname;if(p==='/admin/login')return NextResponse.next();
if(await checkToken(req.cookies.get('adm')?.value))return NextResponse.next();return NextResponse.redirect(new URL('/admin/login',req.url));}
export const config={matcher:['/admin/:path*']};
