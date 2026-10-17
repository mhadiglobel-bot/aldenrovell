import {NextResponse} from 'next/server';import {requireAdmin} from '@/lib/store';
export async function PATCH(req:Request){
 const a=await requireAdmin(req);if(!a.ok)return NextResponse.json({error:a.message},{status:a.status});
 let x:Record<string,unknown>;try{x=await req.json();}catch{return NextResponse.json({error:'Invalid payload'},{status:400});}
 if(typeof x.id!=='string'||!/^P0[1-4]$/.test(x.id))return NextResponse.json({error:'Invalid product'},{status:400});
 const integerOrNull=(n:unknown)=>n===null||(typeof n==='number'&&Number.isSafeInteger(n)&&n>=0&&n<=100000000);
 if(!integerOrNull(x.pricePkr)||!integerOrNull(x.stock)||typeof x.published!=='boolean'||typeof x.imagesApproved!=='boolean'||typeof x.salesUnitVerified!=='boolean')return NextResponse.json({error:'Invalid fields'},{status:400});
 if(x.published&&(!x.imagesApproved||!x.salesUnitVerified||x.pricePkr===null||x.stock===null))return NextResponse.json({error:'Approve imagery and selling unit, enter price and stock before publishing.'},{status:400});
 const {error}=await a.db.from('store_products').update({price_pkr:x.pricePkr,stock:x.stock,is_published:x.published,images_approved:x.imagesApproved,sales_unit_verified:x.salesUnitVerified}).eq('id',x.id);
 return error?NextResponse.json({error:'Could not update product'},{status:500}):NextResponse.json({ok:true});
}
