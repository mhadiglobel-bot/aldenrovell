import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import draftData from '@/data/catalog.json';
import type { Product,StoreSettings } from '@/lib/types';
const draft = draftData as Product[];
export function adminDb():SupabaseClient|null {
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)return null;
 return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
}
export function publicAuth(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 return url&&key?createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}}):null;
}
export async function getProducts():Promise<Product[]>{
 const db=adminDb();if(!db)return draft;
 const {data,error}=await db.from('store_products').select('id,price_pkr,stock,is_published,images_approved,sales_unit_verified');
 if(error){console.error('Catalog unavailable',error.message);return draft;}
 const byId=new Map((data??[]).map(x=>[x.id,x]));
 return draft.map(p=>{const row=byId.get(p.id);return row?{...p,pricePkr:row.price_pkr,stock:row.stock,published:row.is_published,imagesApproved:row.images_approved,salesUnitVerified:row.sales_unit_verified}:p});
}
export async function getSettings():Promise<StoreSettings>{
 const db=adminDb();if(!db)return {codEnabled:false,shippingFeePkr:null,notice:null};
 const {data,error}=await db.from('store_settings').select('cod_enabled,shipping_fee_pkr,notice').eq('id',1).maybeSingle();
 if(error||!data)return {codEnabled:false,shippingFeePkr:null,notice:null};
 return {codEnabled:data.cod_enabled,shippingFeePkr:data.shipping_fee_pkr,notice:data.notice};
}
export async function requireAdmin(req:Request):Promise<{ok:true;db:SupabaseClient}|{ok:false;status:number;message:string}>{
 const db=adminDb(),auth=publicAuth();
 if(!db||!auth||!process.env.ADMIN_EMAIL)return{ok:false,status:503,message:'Admin backend is not configured.'};
 const token=req.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1];
 if(!token)return{ok:false,status:401,message:'Sign in required.'};
 const {data,error}=await auth.auth.getUser(token);
 if(error||!data.user||data.user.email?.toLowerCase()!==process.env.ADMIN_EMAIL.toLowerCase())return{ok:false,status:403,message:'Not authorized.'};
 return{ok:true,db};
}
