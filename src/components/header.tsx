'use client';
import Link from 'next/link';import Image from 'next/image';import {usePathname} from 'next/navigation';import {Search,ShoppingBag,Menu,X,ArrowUpRight} from 'lucide-react';import {useState,useEffect} from 'react';import {useCart} from './cart-provider';
const pages=[['Shop','/shop'],['Lifestyle','/shop?category=Lifestyle'],['Accessories','/shop?category=Accessories'],['Footwear','/shop?category=Footwear'],['Our Story','/about']];
export function Header(){const [open,setOpen]=useState(false),pathname=usePathname();const {count}=useCart();useEffect(()=>setOpen(false),[pathname]);return <>
 <div className="announcement">A considered collection, made for everyday discovery <span aria-hidden="true">✦</span> Pakistan storefront preview</div>
 <header className="site-header"><div className="container header-inner">
 <button className="icon-button mobile-only" onClick={()=>setOpen(!open)} aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open}>{open?<X size={24}/>:<Menu size={24}/>}</button>
 <Link href="/" className="brand" aria-label="Alden Rovell home"><Image src="/brand/primary-logo.png" alt="Alden Rovell" width={260} height={87} priority className="brand-image"/></Link>
 <nav className="desktop-nav" aria-label="Main navigation">{pages.map(([t,h])=><Link key={t} className={pathname===h?'nav-active':''} href={h}>{t}</Link>)}</nav>
 <div className="header-actions"><Link href="/shop" className="icon-button search-action" aria-label="Browse and search"><Search size={21}/></Link><Link href="/cart" className="cart-button" aria-label={`Cart with ${count} items`}><ShoppingBag size={21}/>{count>0&&<span className="cart-count">{count}</span>}</Link></div>
 </div></header>
 {open&&<div className="mobile-nav" id="mobile-nav"><nav aria-label="Mobile navigation">{pages.map(([t,h])=><Link href={h} key={t} onClick={()=>setOpen(false)}>{t}<ArrowUpRight size={18}/></Link>)}</nav><div className="mobile-nav-foot">Refined finds. Thoughtfully selected.</div></div>}
 </>}
