/* CHRONOS V2 — independently modeled, true Three.js mechanical watch.
   All components are geometry, not flat image sequences. */
const PALETTES={
  champagne:{metal:0xc5a677,edge:0xf0d9ab,accent:0xe3c58c,dial:'#16171b',strap:0x1a1b20},
  onyx:{metal:0x878c96,edge:0xe0e1e5,accent:0xb6b9c3,dial:'#0c1015',strap:0x13151a},
  glacier:{metal:0x9ebbc3,edge:0xe4f3f2,accent:0xaad2d7,dial:'#17282f',strap:0x182c32}
};
export const finishes=PALETTES;
const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=(a,b,v)=>{const t=Math.min(1,Math.max(0,(v-a)/(b-a)));return t*t*(3-2*t)};

export function buildWatch(T, chosen='champagne'){
 const palette=PALETTES[chosen]||PALETTES.champagne;
 const root=new T.Group(); root.name='CHRONOS_REFERENCE_01';
 const groups={};
 const metal=new T.MeshStandardMaterial({color:palette.metal,metalness:.83,roughness:.23});
 const highlight=new T.MeshStandardMaterial({color:palette.edge,metalness:.72,roughness:.18});
 const warm=new T.MeshStandardMaterial({color:palette.accent,metalness:.8,roughness:.27});
 const steel=new T.MeshStandardMaterial({color:0x7e858e,metalness:.76,roughness:.26});
 const black=new T.MeshStandardMaterial({color:0x101114,metalness:.3,roughness:.49});
 const charcoal=new T.MeshStandardMaterial({color:0x242529,metalness:.18,roughness:.65});
 const strapMat=new T.MeshStandardMaterial({color:palette.strap,metalness:.08,roughness:.84});
 const luminous=new T.MeshStandardMaterial({color:0xe6ddc7,metalness:.24,roughness:.32,emissive:0x453b27,emissiveIntensity:.08});
 const glassMat=new T.MeshPhysicalMaterial({color:0xdbe3e7,metalness:.02,roughness:.025,transmission:.84,thickness:.12,ior:1.48,transparent:true,opacity:.33,side:T.DoubleSide,depthWrite:false});
 const mats={metal,highlight,warm,steel,black,charcoal,strapMat,luminous,glassMat};
 const cyl=(r1,r2,h,mat,seg=96)=>new T.Mesh(new T.CylinderGeometry(r1,r2,h,seg),mat);
 const disc=(r,h,mat,z,parent)=>{const m=cyl(r,r,h,mat);m.rotation.x=Math.PI/2;m.position.z=z;parent.add(m);return m};
 const ring=(r,tube,mat,z,parent)=>{const m=new T.Mesh(new T.TorusGeometry(r,tube,12,128),mat);m.position.z=z;parent.add(m);return m};
 const box=(sx,sy,sz,mat,parent,x=0,y=0,z=0)=>{const m=new T.Mesh(new T.BoxGeometry(sx,sy,sz),mat);m.position.set(x,y,z);parent.add(m);return m};
 const sphere=(r,mat,parent,x=0,y=0,z=0)=>{const m=new T.Mesh(new T.SphereGeometry(r,14,12),mat);m.position.set(x,y,z);parent.add(m);return m};
 function extrudeShape(points, depth, mat, parent, z=0, bevel=.025){const s=new T.Shape();s.moveTo(...points[0]);for(let i=1;i<points.length;i++)s.lineTo(...points[i]);s.closePath();const g=new T.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelThickness:bevel,bevelSize:bevel,bevelSegments:2,curveSegments:6});const m=new T.Mesh(g,mat);m.position.z=z;parent.add(m);return m}
 function group(name){const g=new T.Group();g.name=name;groups[name]=g;root.add(g);return g}
 // TWO SCULPTED STRAPS. They're actual extruded 3D surfaces with individual stitches.
 function strap(isTop){const g=group(isTop?'upperStrap':'lowerStrap');const s=isTop?1:-1;
   const shape=new T.Shape();shape.moveTo(-.81,s*1.58);shape.lineTo(.81,s*1.58);shape.lineTo(.88,s*2.10);shape.lineTo(.82,s*4.15);shape.quadraticCurveTo(.7,s*4.58,.45,s*4.7);shape.lineTo(-.45,s*4.7);shape.quadraticCurveTo(-.7,s*4.58,-.82,s*4.15);shape.lineTo(-.88,s*2.10);shape.closePath();
   const geo=new T.ExtrudeGeometry(shape,{depth:.17,bevelEnabled:true,bevelThickness:.065,bevelSize:.055,bevelSegments:3,steps:1,curveSegments:10});const m=new T.Mesh(geo,strapMat);m.position.z=-.34;g.add(m);
   // central flexible ribbing + edge stitching
   for(let i=0;i<18;i++){const y=s*(1.98+i*.14);box(1.47,.012,.012,charcoal,g,0,y,-.145)}
   for(let side of [-1,1])for(let i=0;i<27;i++){const y=s*(1.83+i*.102);const x=side*(.725+Math.max(0,i-18)*-.004);box(.033,.042,.015,warm,g,x,y,-.135)}
   // distal leather perforation row
   if(!isTop){for(let i=0;i<5;i++){const y=-2.95-i*.30;disc(.045,.015,black,-.10,g).position.y=y;}}
   else{box(1.36,.22,.17,metal,g,0,s*4.0,-.12);box(1.13,.12,.19,highlight,g,0,s*4.11,-.02)}
   return g;}
 strap(true);strap(false);
 // CASE BACK + SCREWS
 const back=group('caseBack');disc(1.78,.26,steel,-.53,back);ring(1.59,.055,metal,-.72,back);disc(1.39,.025,black,-.69,back);ring(1.34,.035,metal,-.66,back);
 for(let i=0;i<8;i++){let a=i*Math.PI/4;sphere(.044,highlight,back,1.62*Math.cos(a),1.62*Math.sin(a),-.7)}
 // MOVEMENT gears and skeleton bridges
 const engine=group('calibre');disc(1.39,.085,steel,-.11,engine);
 const goldGear=new T.MeshStandardMaterial({color:0xb89457,metalness:.83,roughness:.25});
 const roseGear=new T.MeshStandardMaterial({color:0xd2b783,metalness:.7,roughness:.28});
 const darkGear=new T.MeshStandardMaterial({color:0x59616a,metalness:.76,roughness:.28});
 const gears=[];
 function toothedGear(x,y,r,teeth,material,z){
   const path=new T.Shape();for(let i=0;i<teeth*4;i++){const a=(i/(teeth*4))*Math.PI*2;const rad=r*(i%4===0||i%4===3?.83:1.04);const px=Math.cos(a)*rad,py=Math.sin(a)*rad;if(!i)path.moveTo(px,py);else path.lineTo(px,py)}path.closePath();
   const mesh=new T.Mesh(new T.ExtrudeGeometry(path,{depth:.10,bevelEnabled:true,bevelThickness:.012,bevelSize:.014,bevelSegments:1,curveSegments:2}),material);mesh.position.set(x,y,z);engine.add(mesh);ring(r*.55,.03,steel,z+.12,mesh /* local ring needs local z only? */);
   const hole=new T.Mesh(new T.TorusGeometry(r*.28,.025,8,42),highlight);hole.position.set(x,y,z+.13);engine.add(hole);
   for(let s=0;s<5;s++){const a=s*Math.PI*2/5;const spoke=box(r*.56,.065,.025,steel,engine,x+Math.cos(a)*r*.22,y+Math.sin(a)*r*.22,z+.13);spoke.rotation.z=a}
   sphere(.068,luminous,engine,x,y,z+.16);gears.push({mesh,dir:gears.length%2?-1:1,speed:.18+r*.2});return mesh;
 }
 toothedGear(-.45,-.38,.51,16,goldGear,-.01);toothedGear(.59,.33,.43,14,roseGear,-.02);toothedGear(-.65,.54,.30,12,darkGear,.02);toothedGear(.36,-.73,.28,12,goldGear,.035);toothedGear(.14,.00,.24,10,roseGear,.075);
 // partial open bridges over the gear train
 function bridge(x,y,rot,length,material){const b=box(length,.12,.10,material,engine,x,y,.15);b.rotation.z=rot;for(let s of [-1,1])sphere(.055,highlight,engine,x+Math.cos(rot)*s*length*.39,y+Math.sin(rot)*s*length*.39,.24)}
 bridge(.22,.58,.3,1.25,steel);bridge(-.20,-.65,-.34,1.4,steel);
 // MAIN CASE, with actual lugs, fluting and crown
 const caseGroup=group('case');
 const caseBarrel=new T.Mesh(new T.CylinderGeometry(1.78,1.78,.40,96,1,true),metal);caseBarrel.rotation.x=Math.PI/2;caseGroup.add(caseBarrel);
 ring(1.66,.16,metal,.12,caseGroup);ring(1.68,.14,metal,-.16,caseGroup);
 // A hollow case frame ensures the actual gear train is visible when the dial lifts.
 for(const sy of [-1,1])for(const sx of [-1,1]){const lug=box(.52,.55,.36,metal,caseGroup,sx*1.02,sy*1.49,-.16);lug.rotation.z=sx*sy*.17;box(.32,.18,.16,highlight,caseGroup,sx*.99,sy*1.68,.04)}
 const crown=cyl(.20,.20,.42,metal,32);crown.rotation.z=Math.PI/2;crown.position.set(1.92,0,.02);caseGroup.add(crown);for(let j=0;j<12;j++){const a=j*Math.PI*2/12;box(.31,.028,.026,highlight,caseGroup,2.0,.17*Math.cos(a),.02+.17*Math.sin(a))}
 // bezel fluting as instanced metals
 const flutingGeometry=new T.BoxGeometry(.10,.17,.20);const fluting=new T.InstancedMesh(flutingGeometry,highlight,64);const dummy=new T.Object3D();for(let i=0;i<64;i++){const a=i*Math.PI*2/64;dummy.position.set(Math.sin(a)*1.77,Math.cos(a)*1.77,.09);dummy.rotation.z=-a;dummy.updateMatrix();fluting.setMatrixAt(i,dummy.matrix)}fluting.instanceMatrix.needsUpdate=true;caseGroup.add(fluting);
 // dial with a bespoke printed texture, plus real applied hour indices
 const dial=group('dial');
 function dialCanvas(col){const cvs=document.createElement('canvas');cvs.width=cvs.height=1024;const c=cvs.getContext('2d');const R=512;
   const grad=c.createRadialGradient(400,330,60,R,R,510);grad.addColorStop(0,col==='#17282f'?'#284149':'#2d2b2b');grad.addColorStop(.48,col);grad.addColorStop(1,'#080a0e');c.fillStyle=grad;c.fillRect(0,0,1024,1024);
   c.save();c.translate(R,R);for(let i=0;i<240;i++){const a=i*Math.PI*2/240;c.strokeStyle=i%2?'rgba(255,255,255,.017)':'rgba(255,255,255,.01)';c.lineWidth=1;c.beginPath();c.moveTo(Math.cos(a)*30,Math.sin(a)*30);c.lineTo(Math.cos(a)*490,Math.sin(a)*490);c.stroke()}
   // micro chapter rings
   for(let rr of [350,380,425]){c.beginPath();c.arc(0,0,rr,0,Math.PI*2);c.strokeStyle='rgba(242,225,188,.12)';c.lineWidth=3;c.stroke()}
   for(let i=0;i<60;i++){const a=(i/60)*Math.PI*2-Math.PI/2;const r1=i%5===0?395:413;const r2=431;c.strokeStyle=i%5===0?'rgba(241,215,164,.70)':'rgba(236,237,232,.31)';c.lineWidth=i%5===0?7:3;c.beginPath();c.moveTo(Math.cos(a)*r1,Math.sin(a)*r1);c.lineTo(Math.cos(a)*r2,Math.sin(a)*r2);c.stroke()}
   c.fillStyle='#e7dfcb';c.textAlign='center';c.font='700 54px Arial';c.letterSpacing='8px';c.fillText('CHRONOS',0,-215);c.fillStyle='#b9a98c';c.font='500 24px Arial';c.letterSpacing='7px';c.fillText('ATELIER / 01',0,-177);
   c.fillStyle='#c6b89d';c.font='600 23px Arial';c.letterSpacing='5px';c.fillText('AUTOMATIC',0,238);c.fillStyle='#8f8c86';c.font='400 19px Arial';c.letterSpacing='5px';c.fillText('MECHANICAL STUDY',0,269);
   // sub-dials printed under raised metal rings
   for(const [sx,sy,rad] of [[-195,60,102],[195,60,102],[0,135,81]]){const g=c.createRadialGradient(sx-20,sy-20,4,sx,sy,rad);g.addColorStop(0,'#252526');g.addColorStop(1,'#0c0d10');c.fillStyle=g;c.beginPath();c.arc(sx,sy,rad,0,Math.PI*2);c.fill();c.strokeStyle='#857358';c.lineWidth=6;c.stroke();for(let n=0;n<12;n++){let a=n*Math.PI/6;c.strokeStyle='#b7a07f';c.lineWidth=3;c.beginPath();c.moveTo(sx+Math.sin(a)*(rad-17),sy-Math.cos(a)*(rad-17));c.lineTo(sx+Math.sin(a)*(rad-5),sy-Math.cos(a)*(rad-5));c.stroke()}c.strokeStyle='#d6c39c';c.lineWidth=4;c.beginPath();c.moveTo(sx,sy);c.lineTo(sx+rad*.3,sy-rad*.47);c.stroke()}
   c.restore();return cvs;}
 let dialTexture=new T.CanvasTexture(dialCanvas(palette.dial));dialTexture.colorSpace=T.SRGBColorSpace;const dialMat=new T.MeshStandardMaterial({map:dialTexture,metalness:.22,roughness:.58});disc(1.515,.07,dialMat,.34,dial);
 for(let i=0;i<12;i++){const a=i*Math.PI*2/12;const baton=box(i%3===0?.052:.029,i%3===0?.24:.155,.037,highlight,dial,Math.sin(a)*1.30,Math.cos(a)*1.30,.399);baton.rotation.z=-a}
 // brushed concentric subdial bezels physically raised
 for(const [x,y,r] of [[-.59,-.18,.33],[.59,-.18,.33],[0,-.41,.27]]){const tor=ring(r,.014,metal,.402,dial);tor.position.x=x;tor.position.y=y}
 // hands assembly
 const hands=group('hands');function needle(len,width,rotation,material,z){const shape=new T.Shape();shape.moveTo(-width,-.22);shape.lineTo(-width*.72,len*.74);shape.lineTo(0,len);shape.lineTo(width*.72,len*.74);shape.lineTo(width,-.22);shape.closePath();const m=new T.Mesh(new T.ExtrudeGeometry(shape,{depth:.022,bevelEnabled:true,bevelThickness:.010,bevelSize:.008,bevelSegments:1}),material);m.position.z=z;m.rotation.z=rotation;hands.add(m);return m}
 const hour=needle(.85,.07,-.58,highlight,.46);const minute=needle(1.18,.05,1.10,highlight,.49);const second=needle(1.39,.018,2.1,warm,.54);sphere(.077,metal,hands,0,0,.58);
 // case bezel separated as a distinct group
 const bezel=group('bezel');ring(1.68,.135,metal,.39,bezel);ring(1.565,.036,highlight,.46,bezel);ring(1.763,.018,highlight,.31,bezel);
 for(let i=0;i<12;i++){let a=i*Math.PI/6;const mark=box(.037,.094,.03,highlight,bezel,Math.sin(a)*1.70,Math.cos(a)*1.70,.50);mark.rotation.z=-a}
 // sapphire crystal & reflection curve
 const crystal=group('crystal');const surface=new T.Mesh(new T.CircleGeometry(1.58,96),glassMat);surface.position.z=.56;crystal.add(surface);ring(1.58,.014,highlight,.57,crystal);
 const arc=new T.Mesh(new T.TorusGeometry(1.27,.013,6,90,1.08),new T.MeshBasicMaterial({color:0xe6edf0,transparent:true,opacity:.52}));arc.position.z=.60;arc.rotation.z=.42;crystal.add(arc);
 // raised screws around front ring
 for(let i=0;i<8;i++){let a=(i+.5)*Math.PI/4;sphere(.035,highlight,bezel,1.66*Math.cos(a),1.66*Math.sin(a),.51)}
 // transform stores
 const base={};for(const [name,g] of Object.entries(groups))base[name]={position:g.position.clone(),rotation:g.rotation.clone()};
 function setExplode(amt){const e=Math.max(0,Math.min(1,amt));const spread={upperStrap:[0,1.35,-.3],lowerStrap:[0,-1.35,-.3],caseBack:[0,0,-3.8],calibre:[0,0,-2.1],case:[0,0,-.45],dial:[0,0,1.28],hands:[.10,0,2.20],bezel:[0,0,3.03],crystal:[0,0,4.0]};for(let [key,offset] of Object.entries(spread)){let g=groups[key];g.position.set(...offset.map(v=>v*e));}groups.upperStrap.rotation.x=-e*.16;groups.lowerStrap.rotation.x=e*.16;groups.hands.rotation.z=e*.08;}
 function tick(delta){gears.forEach(g=>g.mesh.rotation.z+=delta*g.dir*g.speed);second.rotation.z-=delta*.11;}
 function setFinish(key){const p=PALETTES[key]||PALETTES.champagne;metal.color.setHex(p.metal);highlight.color.setHex(p.edge);warm.color.setHex(p.accent);strapMat.color.setHex(p.strap);dialTexture.dispose();dialTexture=new T.CanvasTexture(dialCanvas(p.dial));dialTexture.colorSpace=T.SRGBColorSpace;dialMat.map=dialTexture;dialMat.needsUpdate=true;}
 function dispose(){root.traverse(o=>{if(o.geometry)o.geometry.dispose()});const materials=new Set();root.traverse(o=>{if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m))});materials.forEach(m=>m.dispose());dialTexture.dispose();}
 return {root,groups,gears,setExplode,tick,setFinish,dispose};
}
