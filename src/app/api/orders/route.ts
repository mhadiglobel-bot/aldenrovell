import { NextResponse } from 'next/server';
import { adminDb, getSettings } from '@/lib/store';
import { validateOrderPayload } from '@/lib/validate';
export const runtime='nodejs';
export async function POST(request:Request){
 let input:unknown;try{input=await request.json();}catch{return NextResponse.json({error:'Invalid JSON.'},{status:400});}
 const checked=validateOrderPayload(input);if(!checked.ok)return NextResponse.json({error:checked.message},{status:400});
 const db=adminDb();if(!db)return NextResponse.json({error:'Orders are not active. Database setup is required.'},{status:503});
 const settings=await getSettings();
 if(!settings.codEnabled||settings.shippingFeePkr===null)return NextResponse.json({error:'Cash on Delivery is not active yet.'},{status:503});
 const {customer,items,idempotencyKey}=checked.value;
 const {data,error}=await db.rpc('place_cod_order',{p_customer:customer,p_lines:items,p_idempotency:idempotencyKey});
 if(error){console.error('Order insert rejected',error.code,error.message);return NextResponse.json({error:'Could not place the order. Check availability and try again.'},{status:409});}
 if(!data?.reference)return NextResponse.json({error:'Order receipt unavailable.'},{status:500});
 let notified=false;
 const key=process.env.RESEND_API_KEY, to=process.env.ORDER_NOTIFY_EMAIL, from=process.env.ORDER_FROM_EMAIL;
 if(key&&to&&from&&!data.already_received){
  try{
   const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],subject:`New Alden Rovell COD request ${data.reference}`,text:`New COD order: ${data.reference}\nCustomer: ${customer.name}\nPhone: ${customer.phone}\nCity: ${customer.city}, ${customer.province}\nAddress: ${customer.address}\nProducts: ${items.map(i=>`${i.id} x ${i.quantity}`).join(', ')}\nTotal: Rs. ${data.total_pkr}\nConfirm with customer before fulfillment.`})});
   notified=response.ok;if(!response.ok)console.error('Order notification delivery rejected',response.status);
  }catch(e){console.error('Order notification request failed',e);}
 }
 return NextResponse.json({reference:data.reference,totalPkr:data.total_pkr,shippingPkr:data.shipping_pkr,status:'pending_confirmation',notificationSent:notified},{status:201});
}
