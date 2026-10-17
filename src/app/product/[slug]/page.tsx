import {notFound} from 'next/navigation';import type{Metadata}from 'next';import {getProducts}from '@/lib/store';import {ProductDetail}from '@/components/product-detail';
export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const p=(await getProducts()).find(x=>x.slug===slug);return p?{title:p.title,description:p.metaDescription,robots:p.published?undefined:{index:false,follow:false},openGraph:{images:[p.images[0].src]}}:{title:'Not found'};}
export default async function ProductPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=(await getProducts()).find(x=>x.slug===slug);if(!p)notFound();return <ProductDetail product={p}/>}
