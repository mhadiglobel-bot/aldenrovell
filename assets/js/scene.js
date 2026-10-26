import {clamp,lerp,prefersReducedMotion} from './utils.js';
import {worlds} from './data.js';

const vertexShader=`
attribute vec2 a_pos;
void main(){gl_Position=vec4(a_pos,0.,1.);}
`;

const fragmentShader=`
precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_center;
uniform float u_radius;
uniform float u_time;
uniform float u_spin;
uniform float u_tilt;
uniform float u_theme;
uniform float u_ring;
uniform float u_mode;
uniform float u_alpha;
uniform vec2 u_pointer;

float hash3(vec3 p){p=fract(p*.1031);p+=dot(p,p.yzx+33.33);return fract((p.x+p.y)*p.z);}
float noise3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
return mix(mix(mix(hash3(i),hash3(i+vec3(1,0,0)),f.x),mix(hash3(i+vec3(0,1,0)),hash3(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash3(i+vec3(0,0,1)),hash3(i+vec3(1,0,1)),f.x),mix(hash3(i+vec3(0,1,1)),hash3(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float f=0.;float a=.53;for(int i=0;i<4;i++){f+=a*noise3(p);p=p*2.06+vec3(7.3,3.7,1.4);a*=.5;}return f;}
vec3 rotateY(vec3 p,float a){return vec3(cos(a)*p.x+sin(a)*p.z,p.y,-sin(a)*p.x+cos(a)*p.z);}
vec3 rotateX(vec3 p,float a){return vec3(p.x,cos(a)*p.y-sin(a)*p.z,sin(a)*p.y+cos(a)*p.z);}
vec3 palette(float theme,float v,float n){
  vec3 deep,mid,bright;
  if(theme<.5){deep=vec3(.09,.11,.26);mid=vec3(.56,.39,.52);bright=vec3(.99,.80,.68);}
  else if(theme<1.5){deep=vec3(.015,.12,.20);mid=vec3(.03,.44,.59);bright=vec3(.60,.92,.88);}
  else if(theme<2.5){deep=vec3(.10,.09,.27);mid=vec3(.39,.36,.68);bright=vec3(.84,.82,.99);}
  else if(theme<3.5){deep=vec3(.25,.055,.07);mid=vec3(.68,.24,.19);bright=vec3(1.,.66,.39);}
  else {deep=vec3(.02,.03,.10);mid=vec3(.16,.20,.42);bright=vec3(.49,.51,.86);}
  vec3 c=mix(deep,mid,smoothstep(.14,.87,v));
  c=mix(c,bright,smoothstep(.54,.98,v)*(.22+.22*n));
  return c;
}
void main(){
 vec2 uv=(gl_FragCoord.xy-.5*u_resolution)/u_resolution.y;
 vec2 q=(uv-u_center)/max(.001,u_radius);
 float r2=dot(q,q);
 vec3 col=vec3(0.);
 float alpha=0.;
 float theme=u_theme;
 // A slowly revolving thin, multi-track ring with alternating shaded layers.
 float ct=cos(.23),st=sin(.23);
 vec2 rp=vec2(q.x*ct-q.y*st,q.x*st+q.y*ct);
 float er=length(vec2(rp.x/1.61,rp.y/.325));
 float ring1=exp(-pow((er-1.01)/.012,2.))*.84;
 float ring2=exp(-pow((er-.92)/.022,2.))*.48;
 float ring3=exp(-pow((er-1.14)/.014,2.))*.42;
 float ring=(ring1+ring2+ring3)*u_ring;
 vec3 ringColor=theme<.5?vec3(.91,.75,.75):(theme<2.5?vec3(.72,.71,.96):vec3(.50,.57,.88));
 if(er<1.2 && er>.86 && ring>.005){float backRing=ring*(r2>1.0?1.:0.);col+=ringColor*backRing;alpha=max(alpha,backRing);}
 if(r2<1.){
   float nz=sqrt(max(0.,1.-r2));
   vec3 n=normalize(vec3(q,nz));
   vec3 p=rotateX(rotateY(n,u_spin+u_pointer.x*.24),u_tilt+u_pointer.y*.12);
   float detail=fbm(p*4.5);
   float micro=fbm(p*13.);
   float bands=sin(p.y*38.+detail*8.0+sin(p.x*8.0)*.5);
   float ribbons=sin(p.y*74.+detail*11.);
   float v=.46+.23*bands+.11*ribbons+.31*(detail-.48)+.10*(micro-.5);
   if(theme> .5 && theme<1.5){
     float continent=fbm(p*4.7+vec3(2.1));
     v=.20+continent*.62+micro*.14;
   }
   if(theme>2.5 && theme<3.5){
     float volcano=fbm(p*6.6);
     v=.15+volcano*.56+.28*pow(abs(sin(p.x*24.+p.y*17.+detail*7.)),12.);
   }
   vec3 surface=palette(theme,clamp(v,0.,1.),detail);
   if(theme>.5 && theme<1.5){
     float clouds=smoothstep(.66,.86,fbm(p*8.5+vec3(u_time*.015,.0,.0)));
     surface=mix(surface,vec3(.75,.94,.99),clouds*.46);
   }
   if(theme>2.5 && theme<3.5){
     float crack=pow(abs(sin(p.x*24.+p.z*13.+detail*12.)),24.);
     surface+=vec3(.38,.10,.02)*crack*.7;
   }
   vec3 lightDir=normalize(vec3(-.57,.40,.87));
   float diff=max(dot(n,lightDir),0.);
   float shade=.19+.82*diff;
   float rim=pow(1.-nz,3.);
   vec3 glowTint=(theme<.5?vec3(.63,.43,.71):theme<1.5?vec3(.27,.66,.78):theme<2.5?vec3(.55,.46,.96):theme<3.5?vec3(.90,.31,.20):vec3(.36,.46,.9));
   col=surface*shade + glowTint*rim*.22;
   col+=vec3(1.,.91,.86)*pow(max(dot(reflect(-lightDir,n),vec3(0.,0.,1.)),0.),42.)*.095;
   if(u_mode>1.5){col*=.74;}
   if(u_mode>.5 && u_mode<1.5){col+=glowTint*.15*rim;}
   alpha=1.;
   // Front side of the equatorial ring crosses the near hemisphere.
   if(rp.y<-.028 && ring>.003){float f=ring*.78;col=mix(col,ringColor*.95,f);}
 }
 // Atmosphere above the limb. True translucency lets CSS sky show through.
 float r=sqrt(r2);
 float atmosphere=exp(-pow((r-1.01)/.074,2.))*.34;
 atmosphere+=exp(-pow((r-1.05)/.16,2.))*.065;
 if(r>1.){
   vec3 atm=theme<.5?vec3(.59,.44,.82):theme<1.5?vec3(.23,.69,.89):theme<2.5?vec3(.53,.52,.92):theme<3.5?vec3(.93,.37,.22):vec3(.33,.44,.81);
   col=mix(col,atm,clamp(atmosphere*2.,0.,1.));
   alpha=max(alpha,atmosphere);
 }
 if(er<1.2 && er>.86 && ring>.005 && r2>1.0){alpha=max(alpha,ring);col=mix(col,ringColor,min(1.,ring*.85));}
 gl_FragColor=vec4(col,clamp(alpha*u_alpha,0.,1.));
}`;

function shader(gl,type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){console.error('ORBIT shader:',gl.getShaderInfoLog(s));gl.deleteShader(s);return null;}return s;}

export class PlanetScene{
 constructor(canvas){
  this.canvas=canvas;this.gl=null;this.running=true;this.theme=0;this.targetTheme=0;this.spin=.3;this.tilt=.13;this.pointer={x:0,y:0};this.targetPointer={x:0,y:0};this.mode=0;this.targetMode=0;this.route='/';this.frame=0;this.visible=true;this.last=0;
  try{this.gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false,powerPreference:'high-performance'})||canvas.getContext('experimental-webgl',{alpha:true});}catch(e){console.info('WebGL is unavailable, using image fallback.');}
  if(this.gl && this.init()){document.body.classList.add('has-webgl');this.resize();this.tick(0);}else{this.gl=null;canvas.style.display='none';}
  window.addEventListener('resize',()=>this.resize(),{passive:true});
  window.addEventListener('pointermove',e=>{this.targetPointer.x=(e.clientX/innerWidth-.5)*2;this.targetPointer.y=(e.clientY/innerHeight-.5)*2;},{passive:true});
  canvas.addEventListener('pointerdown',e=>{this.drag={x:e.clientX,spin:this.spin};canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(this.drag){this.spin=this.drag.spin+(e.clientX-this.drag.x)/260;}});
  canvas.addEventListener('pointerup',()=>this.drag=null); canvas.addEventListener('pointercancel',()=>this.drag=null);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.running=false;document.body.classList.remove('has-webgl');});
  canvas.addEventListener('webglcontextrestored',()=>{this.init();this.running=true;this.resize();this.tick(0);document.body.classList.add('has-webgl');});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){this.last=0;if(this.gl&&this.running)this.tick(performance.now());}});
 }
 init(){const gl=this.gl,v=shader(gl,gl.VERTEX_SHADER,vertexShader),f=shader(gl,gl.FRAGMENT_SHADER,fragmentShader);if(!v||!f)return false;const p=gl.createProgram();gl.attachShader(p,v);gl.attachShader(p,f);gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS)){console.error(gl.getProgramInfoLog(p));return false;}gl.useProgram(p);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const position=gl.getAttribLocation(p,'a_pos');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);this.program=p;this.loc={};for(const key of ['resolution','center','radius','time','spin','tilt','theme','ring','mode','alpha','pointer'])this.loc[key]=gl.getUniformLocation(p,'u_'+key);return true;}
 resize(){if(!this.gl)return;const quality=Math.min(window.devicePixelRatio||1,innerWidth<720?1.2:1.5);const w=Math.round(innerWidth*quality),h=Math.round(innerHeight*quality);this.canvas.width=w;this.canvas.height=h;this.canvas.style.width='100%';this.canvas.style.height='100%';this.gl.viewport(0,0,w,h);this.quality=quality;}
 setRoute(path){this.route=path;this.mode=0;this.targetMode=0;let slug=path.split('/')[2];let i=worlds.findIndex(w=>w.slug===slug);this.targetTheme=i>=0?i:0;this.theme=this.targetTheme;this.spin=.3;const w=i>=0?worlds[i]:worlds[0];document.getElementById('planet-fallback').style.backgroundImage=`url('${w.image}')`;this.onScroll();}
 setMode(mode){this.targetMode=({surface:0,atmosphere:1,orbit:2})[mode]??0;}
 onScroll(){if(!this.gl)return;const scroll=window.scrollY,view=Math.max(1,innerHeight);const progress=clamp(scroll/view,0,1);const detail=this.route.startsWith('/worlds/'),home=this.route==='/';let fade=1;
 if(home)fade=clamp(1-progress*1.55,0,1);
 else if(detail)fade=clamp(1-progress*1.35,0,1);
 else fade=clamp(1-progress*1.9,0,1)*.58;
 if(document.body.classList.contains('exploring'))fade=1;
 this.canvas.style.opacity=String(fade);
 const fallback=document.getElementById('planet-fallback');fallback.style.opacity=String(fade*.8);
 this.scrollProgress=progress;
 }
 tick(t){if(!this.gl||!this.running||document.hidden)return;this.frame=requestAnimationFrame(n=>this.tick(n));if(t-this.last<(innerWidth<760?32:18))return;const dt=Math.min((t-this.last)/1000,.05)||.016;this.last=t;
 this.pointer.x=lerp(this.pointer.x,this.targetPointer.x,.035);this.pointer.y=lerp(this.pointer.y,this.targetPointer.y,.035);
 if(!prefersReducedMotion())this.spin+=dt*.052;
 this.mode=lerp(this.mode,this.targetMode,.1);
 const gl=this.gl,w=innerWidth,h=innerHeight,small=w<760,home=this.route==='/',detail=this.route.startsWith('/worlds/'),exp=document.body.classList.contains('exploring');
 let centerX=small?.50:(home?.76:detail?.72:.80);
 let centerY=small?.45:(home?.50:detail?.51:.47);
 let radius=small?Math.min(w*.38,h*.26):Math.min(h*.39,w*.306);
 if(!home&&!detail)radius*=.82;
 if(exp){centerX=.50;centerY=.51;radius=small?Math.min(w*.43,h*.34):Math.min(h*.46,w*.34);}
 else if(this.mode>1.0){radius*=1.-.20*(this.mode-1.);}
 const scroll=this.scrollProgress||0;
 if(!exp&&home){centerX+=scroll*.08;centerY+=scroll*.10;radius*=1.+scroll*.22;}
 const cx=(centerX*w-w*.5)/h,cy=(h*.5-centerY*h)/h;
 this.current=this.current||{cx,cy,radius:radius/h};this.current.cx=lerp(this.current.cx,cx,.075);this.current.cy=lerp(this.current.cy,cy,.075);this.current.radius=lerp(this.current.radius,radius/h,.075);
 gl.viewport(0,0,this.canvas.width,this.canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(this.program);
 gl.uniform2f(this.loc.resolution,this.canvas.width,this.canvas.height);
 gl.uniform2f(this.loc.center,this.current.cx,this.current.cy);gl.uniform1f(this.loc.radius,this.current.radius);
 gl.uniform1f(this.loc.time,t*.001);gl.uniform1f(this.loc.spin,this.spin);gl.uniform1f(this.loc.tilt,this.tilt);gl.uniform1f(this.loc.theme,this.theme);
 gl.uniform1f(this.loc.ring,this.theme===0||this.theme===2||this.theme===4?1.:.0);
 gl.uniform1f(this.loc.mode,this.mode);gl.uniform1f(this.loc.alpha,1.);
 gl.uniform2f(this.loc.pointer,this.pointer.x,this.pointer.y);gl.drawArrays(gl.TRIANGLES,0,3);
 }
}
