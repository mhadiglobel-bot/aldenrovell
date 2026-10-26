import {buildWatch} from './watch3d.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const mix=(a,b,t)=>a+(b-a)*t;
const smoother=(a,b,p)=>{let t=clamp((p-a)/(b-a),0,1);return t*t*(3-2*t)};
let threePromise;
function timeout(p,ms){return new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(new Error('CDN timeout')),ms);p.then(v=>{clearTimeout(t);resolve(v)},e=>{clearTimeout(t);reject(e)})})}
function loadThree(){
 if(!threePromise){threePromise=timeout(import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js'),7000)
  .catch(()=>timeout(import('https://unpkg.com/three@0.180.0/build/three.module.js'),6000));
 }return threePromise;
}
export class WatchViewer {
 constructor(element,{mode='hero',finish='champagne'}={}){
  this.el=element;this.mode=mode;this.finish=finish;this.active=true;this.ready=false;this.disposed=false;this.pointer={x:0,y:0};this.drag={x:0,y:0};this.targetProgress=0;this.progress=0;this.inspectExplode=false;this.zoom=1;this.previousTime=0;this.lastWidth=0;
  this.dragging=false;this.reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  this.bindControls();this.init();
 }
 async init(){
  try{
   const T=await loadThree();if(this.disposed)return;this.T=T;
   const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
   renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,window.innerWidth<650?1.35:1.75));
   renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.65;renderer.setClearColor(0x000000,0);
   renderer.domElement.className='watch-webgl';renderer.domElement.setAttribute('aria-hidden','true');
   this.renderer=renderer;this.el.appendChild(renderer.domElement);
   const scene=new T.Scene();const camera=new T.PerspectiveCamera(34,1,.05,120);camera.position.set(0,0,15.6);camera.lookAt(0,0,0);this.scene=scene;this.camera=camera;
   scene.add(new T.AmbientLight(0xffffff,1.12));
   const hemi=new T.HemisphereLight(0xf8e7c7,0x1a2334,2.0);scene.add(hemi);
   const light=(color,intensity,x,y,z)=>{const l=new T.DirectionalLight(color,intensity);l.position.set(x,y,z);scene.add(l)};
   light(0xffe3bd,4.5,-5,7,9);light(0xbfd3ff,3.5,7,-2,6);light(0xffffff,2.0,2,6,-5);light(0xffdeb0,2.5,-6,-7,3);
   const w=buildWatch(T,this.finish);this.watch=w;scene.add(w.root);
   this.resize();this.ro=new ResizeObserver(()=>this.resize());this.ro.observe(this.el);
   this.io=new IntersectionObserver(es=>{this.active=es[0]?.isIntersecting??true},{rootMargin:'220px 0px 220px 0px'});this.io.observe(this.el);
   renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();this.ready=false;this.el.classList.remove('has-webgl')});
   renderer.domElement.addEventListener('webglcontextrestored',()=>{this.ready=true;this.el.classList.add('has-webgl')});
   this.ready=true;this.entryTime=performance.now();this.explodeCurrent=(this.mode==='hero'&&!this.reduced)?.74:0;this.lastTime=this.entryTime;this.animate(this.lastTime);
  }catch(e){console.warn('3D unavailable; accessible fallback shown.',e);this.el.classList.add('watch-static');this.el.dataset.viewerStatus='fallback';const note=this.el.querySelector('.viewer-message');if(note)note.textContent='STATIC PREVIEW / 3D UNAVAILABLE';}
 }
 resize(){if(!this.renderer)return;const {width,height}=this.el.getBoundingClientRect();if(width<5||height<5)return;this.renderer.setSize(Math.floor(width),Math.floor(height),false);this.camera.aspect=width/height;this.camera.updateProjectionMatrix();this.isMobile=width<600;this.lastWidth=width;}
 setProgress(p){this.targetProgress=clamp(p,0,1)}
 setFinish(finish){this.finish=finish;this.watch?.setFinish(finish)}
 setExploded(on){this.inspectExplode=!!on}
 setZoom(factor){this.zoom=clamp(this.zoom*factor,.66,1.5)}
 reset(){this.drag.x=0;this.drag.y=0;this.zoom=1;this.inspectExplode=false;this.targetProgress=0}
 bindControls(){
  this.onPointerMove=e=>{const r=this.el.getBoundingClientRect();this.pointer.x=clamp((e.clientX-r.left)/Math.max(r.width,1)*2-1,-1,1);this.pointer.y=clamp((e.clientY-r.top)/Math.max(r.height,1)*2-1,-1,1);
   if(this.dragging){this.drag.x=clamp(this.drag.startX+(e.clientX-this.drag.originX)*.008,-1.5,1.5);this.drag.y=clamp(this.drag.startY+(e.clientY-this.drag.originY)*.006,-.75,.75)}};
  this.onPointerDown=e=>{if(this.mode!=='inspector'||e.button!==0)return;this.dragging=true;this.drag.originX=e.clientX;this.drag.originY=e.clientY;this.drag.startX=this.drag.x;this.drag.startY=this.drag.y;this.el.setPointerCapture?.(e.pointerId)};
  this.onPointerUp=()=>{this.dragging=false};
  this.onWheel=e=>{if(this.mode!=='inspector')return;e.preventDefault();this.setZoom(e.deltaY>0?.94:1.06)};
  this.el.addEventListener('pointermove',this.onPointerMove);this.el.addEventListener('pointerdown',this.onPointerDown);this.el.addEventListener('pointerup',this.onPointerUp);this.el.addEventListener('pointercancel',this.onPointerUp);this.el.addEventListener('wheel',this.onWheel,{passive:false});
 }
 animate(time){if(this.disposed)return;this.raf=requestAnimationFrame(t=>this.animate(t));if(!this.ready||!this.active||document.hidden)return;
  let dt=clamp((time-this.lastTime)/1000,.003,.05);this.lastTime=time;
  let w=this.watch;this.progress=mix(this.progress,this.targetProgress,this.reduced?1:.065);
  let explode=0,rx=-.09,ry=-.34,rz=-.17,scale=1,px=0,py=0;
  if(this.mode==='story'){
   const p=this.progress;const opening=smoother(.12,.53,p);const closing=smoother(.72,.98,p);explode=opening*(1-closing);
   rx=mix(-.12,.19,opening)-closing*.20;ry=mix(-.32,.70,opening)-closing*.90;rz=mix(-.10,-.05,opening)-closing*.06;
   scale=1-.19*explode;
   px=mix(.0,.45,smoother(.15,.45,p))-.45*closing;
  }else if(this.mode==='inspector'){
   explode=this.inspectExplode?1:0;rx=-.08+this.drag.y;ry=-.36+this.drag.x;rz=-.13;scale=1.0;
  }else{
   rx=-.08+(this.reduced?0:this.pointer.y*.07);ry=-.32+(this.reduced?0:this.pointer.x*.12+Math.sin(time*.00024)*.055);rz=-.16;scale=1.05;px=.03;explode=this.reduced?0:.74*(1-smoother(200,2450,time-this.entryTime));
  }
  const root=w.root, targetX=rx,targetY=ry,targetZ=rz;
  root.rotation.x=mix(root.rotation.x,targetX,.055);root.rotation.y=mix(root.rotation.y,targetY,.055);root.rotation.z=mix(root.rotation.z,targetZ,.055);
  root.scale.setScalar(mix(root.scale.x,scale,.055));root.position.x=mix(root.position.x,px,.06);root.position.y=mix(root.position.y,py,.06);
  this.explodeCurrent=mix(this.explodeCurrent??0,explode,.065);w.setExplode(this.explodeCurrent);
  w.tick(this.reduced?0:dt);
  const baseDist=this.mode==='story'?16.9:this.mode==='inspector'?15.0:15.9;
  const mobile=this.isMobile?1.23:1;const zoom=this.mode==='inspector'?this.zoom:1;
  this.camera.position.z=mix(this.camera.position.z,baseDist*mobile/zoom+(explode*1.25),.055);
  this.renderer.render(this.scene,this.camera);if(!this.firstFrame){this.firstFrame=true;this.el.classList.add('has-webgl');this.el.dataset.viewerStatus='ready';}
 }
 dispose(){this.disposed=true;cancelAnimationFrame(this.raf);this.ro?.disconnect();this.io?.disconnect();this.el.removeEventListener('pointermove',this.onPointerMove);this.el.removeEventListener('pointerdown',this.onPointerDown);this.el.removeEventListener('pointerup',this.onPointerUp);this.el.removeEventListener('pointercancel',this.onPointerUp);this.el.removeEventListener('wheel',this.onWheel);this.watch?.dispose();this.renderer?.dispose();this.renderer?.domElement.remove();}
}
