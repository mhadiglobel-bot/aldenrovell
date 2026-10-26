import {prefersReducedMotion} from './utils.js';
export class Starfield{
 constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.stars=[];this.start=performance.now();this.scroll=0;this.resize();window.addEventListener('resize',()=>this.resize(),{passive:true});this.draw(0);}
 resize(){const scale=Math.min(devicePixelRatio||1,1.5);this.canvas.width=Math.floor(innerWidth*scale);this.canvas.height=Math.floor(innerHeight*scale);this.ctx.setTransform(scale,0,0,scale,0,0);this.w=innerWidth;this.h=innerHeight;const count=Math.round(Math.min(310,Math.max(100,this.w*this.h/4900)));let seed=333;const rand=()=>((seed=seed*1664525+1013904223>>>0)/4294967296);this.stars=Array.from({length:count},(_,i)=>({x:rand()*this.w,y:rand()*this.h,size:rand()*1.45+.28,phase:rand()*6.28,speed:rand()*.4+.12,depth:rand()*.9+.1,bright:rand()*.7+.3}));}
 draw(t){requestAnimationFrame(n=>this.draw(n));if(document.hidden)return;if(t-this._last<32)return;this._last=t;const ctx=this.ctx;ctx.clearRect(0,0,this.w,this.h);const still=prefersReducedMotion();for(const s of this.stars){const twinkle=still?.7:(.64+.36*Math.sin(t*.001*s.speed+s.phase));const y=(s.y+this.scroll*s.depth*.06)%this.h;ctx.globalAlpha=s.bright*twinkle*.8;ctx.fillStyle='#e8e9ff';ctx.beginPath();ctx.arc(s.x,y,s.size,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;}
 setScroll(y){this.scroll=y;}
}
