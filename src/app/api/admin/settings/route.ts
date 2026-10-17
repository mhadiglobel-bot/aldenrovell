import {NextResponse} from 'next/server';import {requireAdmin,getSettings} from '@/lib/store';
export async function GET(req:Request){const a=await requireAdmin(req);if(!a.ok)return NextResponse.json({error:a.message},{status:a.status});return NextResponse.json({settings:await getSettings(),notificationConfigured:!!(process.env.RESEND_API_KEY&&process.env.ORDER_NOTIFY_EMAIL&&process.env.ORDER_FROM_EMAIL)});}
export async function PATCH(req:Request){const a=await requireAdmin(req);if(!a.ok)return NextResponse.json({error:a.message},{status:a.status});
 let x:Record<string,unknown>;try{x=await req.json();}catch{return NextResponse.json({error:'Invalid JSON'},{status:400});}
 if(typeof x.codEnabled!=='boolean'||!(x.shippingFeePkr===null||typeof x.shippingFeePkr==='number'&&Number.isInteger(x.shippingFeePkr)&&x.shippingFeePkr>=0&&x.shippingFeePkr<=100000)||x.codEnabled&&x.shippingFeePkr===null)return NextResponse.json({error:'Valid shipping fee required for COD.'},{status:400});
 const {error}=await a.db.from('store_settings').update({cod_enabled:x.codEnabled,shipping_fee_pkr:x.shippingFeePkr}).eq('id',1);
 return error?NextResponse.json({error:'Could not save settings'},{status:500}):NextResponse.json({ok:true});}
