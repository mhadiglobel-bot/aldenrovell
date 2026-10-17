'use client';
import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import type {CartItem} from '@/lib/types';
type CartContextType={items:CartItem[];count:number;add:(id:string,quantity?:number)=>void;change:(id:string,quantity:number)=>void;clear:()=>void};
const Context=createContext<CartContextType|null>(null);
const KEY='alden-rovell-cart-v1';
export function CartProvider({children}:{children:ReactNode}){
 const [items,setItems]=useState<CartItem[]>([]),[ready,setReady]=useState(false);
 useEffect(()=>{try{const stored=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(stored))setItems(stored.filter(x=>typeof x.id==='string'&&Number.isInteger(x.quantity)&&x.quantity>0).slice(0,15));}catch{}setReady(true);},[]);
 useEffect(()=>{if(ready)localStorage.setItem(KEY,JSON.stringify(items));},[items,ready]);
 const change=(id:string,quantity:number)=>setItems(old=>quantity<=0?old.filter(x=>x.id!==id):old.map(x=>x.id===id?{...x,quantity:Math.min(quantity,10)}:x));
 const add=(id:string,quantity=1)=>setItems(old=>old.find(x=>x.id===id)?old.map(x=>x.id===id?{...x,quantity:Math.min(x.quantity+quantity,10)}:x):[...old,{id,quantity:Math.min(quantity,10)}]);
 return <Context.Provider value={{items,count:items.reduce((n,p)=>n+p.quantity,0),add,change,clear:()=>setItems([])}}>{children}</Context.Provider>;
}
export function useCart(){const ctx=useContext(Context);if(!ctx)throw new Error('CartProvider missing');return ctx;}
