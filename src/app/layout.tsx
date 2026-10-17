import type {Metadata} from 'next';
import '@/app/globals.css';
import {CartProvider} from '@/components/cart-provider';import {Header}from '@/components/header';import {Footer} from '@/components/footer';
const site=process.env.NEXT_PUBLIC_SITE_URL||'https://example.com';
export const metadata:Metadata={metadataBase:new URL(site),title:{default:'Alden Rovell | Thoughtful Everyday Finds',template:'%s | Alden Rovell'},description:'Explore an evolving edit of lifestyle, accessories, and footwear at Alden Rovell, a multi-category retail concept in Pakistan.',robots:process.env.NEXT_PUBLIC_STORE_LIVE==='true'?{index:true,follow:true}:{index:false,follow:false},icons:{icon:'/brand/symbol-transparent.png'},openGraph:{type:'website',title:'Alden Rovell',description:'A considered collection for everyday living.',images:['/brand/landscape-cover.png']}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><CartProvider><a href="#main-content" className="skip-link">Skip to content</a><Header/><main id="main-content">{children}</main><Footer/></CartProvider></body></html>}
