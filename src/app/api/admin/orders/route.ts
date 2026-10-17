import {NextResponse} from 'next/server';import {requireAdmin} from '@/lib/store';
export async function GET(req:Request){
 const a=await requireAdmin(req);if(!a.ok)return NextResponse.json({error:a.message},{status:a.status});
 const {data,error}=await a.db.from('store_orders').select('id,reference,customer_name,phone,city,province,address,notes,items,subtotal_pkr,shipping_pkr,total_pkr,status,created_at').order('created_at',{ascending:false}).limit(100);
 return error?NextResponse.json({error:'Could not fetch orders'},{status:500}):NextResponse.json({orders:data??[]});
}
export async function PATCH(req:Request){
 const a=await requireAdmin(req);if(!a.ok)return NextResponse.json({error:a.message},{status:a.status});
 let x:Record<string,unknown>;try{x=await req.json();}catch{return NextResponse.json({error:'Bad JSON'},{status:400});}
 if(typeof x.id!=='string'||!/^[\da-f-]{36}$/i.test(x.id)||!['confirmed','shipped','completed','canceled'].includes(String(x.status)))return NextResponse.json({error:'Invalid status update'},{status:400});
 const {error}=await a.db.rpc('admin_set_order_status',{p_order_id:x.id,p_status:x.status});
 return error?NextResponse.json({error:'Status transition rejected'},{status:409}):NextResponse.json({ok:true});
}
