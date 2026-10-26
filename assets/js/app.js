import { $, $$, icon,emblem,toast,clamp,prefersReducedMotion } from './utils.js';
import { NAV,worlds,getWorld,systems } from './data.js';
import {homePage} from './pages/home.js';
import {worldsPage} from './pages/worlds.js';
import {worldDetailPage} from './pages/worldDetail.js';
import {missionsPage} from './pages/missions.js';
import {technologyPage,systemPanel} from './pages/technology.js';
import {aboutPage} from './pages/about.js';
import {contactPage} from './pages/contact.js';
import {notFoundPage} from './pages/notFound.js';
import {PlanetScene} from './scene.js';
import {Starfield} from './stars.js';
import {AmbientAudio} from './audio.js';

const scene=new PlanetScene($('#space-scene'));
const stars=new Starfield($('#starfield'));
const audio=new AmbientAudio();
const app=$('#app'),header=$('#site-header'),footer=$('#site-footer'),overlay=$('#site-overlay');
let observer,scrollRaf=0,lastScroll=0,currentPath='',currentPage='',mobileOpen=false,overlayType='';
const pages={'/':homePage,'/worlds':worldsPage,'/missions':missionsPage,'/technology':technologyPage,'/about':aboutPage,'/contact':contactPage};

function headerHTML(path){return `<a class="skip-link" href="#app">Skip to main content</a><div class="nav-shell"><a class="brand" href="/" data-link aria-label="ORBIT home"><span class="brand-mark">${emblem(37)}</span><span>ORBIT<span class="brand-reg">®</span></span></a><nav class="nav-desktop" aria-label="Primary navigation">${NAV.map(n=>`<a href="${n.href}" data-link class="${path===n.href||n.href==='/worlds'&&path.startsWith('/worlds/')?'active':''}" ${path===n.href?'aria-current="page"':''}>${n.label}</a>`).join('')}</nav><div class="nav-actions"><button type="button" class="icon-button sound-toggle" data-action="audio" aria-pressed="${audio.active}" aria-label="${audio.active?'Mute ambient sound':'Enable ambient sound'}" title="Ambient sound (optional)">${icon(audio.active?'sound':'mute',19)}</button><button type="button" class="icon-button search-toggle" data-action="search" aria-label="Open quick navigation" title="Quick navigation (Ctrl+K)">${icon('search',19)}</button><a href="/worlds" data-link class="nav-cta">START EXPLORING <span>${icon('diagonal',16)}</span></a><button type="button" class="icon-button mobile-toggle" data-action="menu" aria-label="Open navigation" aria-expanded="false">${icon('menu',23)}</button></div></div>`;}
function footerHTML(){return `<div class="footer-top section-wrap"><div class="footer-info"><a class="footer-brand" href="/" data-link>${emblem(44)} ORBIT<span>®</span></a><p>A cinematic digital exploration of<br/>imagined worlds and endless possibility.</p><span class="footer-note">FICTIONAL UNIVERSE / INTERACTIVE CONCEPT</span></div><div class="footer-cols"><div><strong>EXPLORE</strong><a href="/" data-link>Experience</a><a href="/worlds" data-link>Worlds</a><a href="/missions" data-link>Missions</a></div><div><strong>DISCOVER</strong><a href="/technology" data-link>Technology</a><a href="/about" data-link>Our story</a><a href="/contact" data-link>Contact</a></div></div></div><div class="footer-bottom section-wrap"><span>© 2026 ORBIT CONCEPT. IMAGINED, NOT REAL.</span><span>DESIGNED FOR THE CURIOUS.</span><a href="#top" data-scroll>BACK TO TOP ↑</a></div>`;}

function pageFor(path){if(pages[path])return {name:path==='/'?'home':path.slice(1),html:pages[path]()};if(path.startsWith('/worlds/')&&getWorld(path.split('/')[2]))return {name:'world-detail',html:worldDetailPage(path.split('/')[2])};return {name:'not-found',html:notFoundPage()};}
function render(path,{preserveScroll=false}={}){
 closeOverlay(false);mobileOpen=false;
 path=path.replace(/\/+$/,'')||'/';
 const page=pageFor(path);currentPath=path;currentPage=page.name;
 for(const c of [...document.body.classList])if(c.startsWith('route-'))document.body.classList.remove(c);
 document.body.classList.add('route-'+page.name);
 document.body.classList.remove('ready','menu-open');
 app.innerHTML=page.html;header.innerHTML=headerHTML(path);footer.innerHTML=footerHTML();
 document.title=(path==='/'?'Beyond the Known':page.name==='world-detail'?`${getWorld(path.split('/')[2]).name} — Explore the World`:({worlds:'The Worlds',missions:'Our Missions',technology:'Technology',about:'Our Story',contact:'Get in Touch'}[page.name]||'Lost Coordinates'))+' | ORBIT';
 scene.setRoute(page.name==='not-found'?'/':path);
 if(!preserveScroll){window.scrollTo({top:0,behavior:'instant'});}
 else window.scrollTo({top:window.scrollY,behavior:'instant'});
 initReveal();lastScroll=0;header.classList.remove('nav-hidden');updateScroll();
 requestAnimationFrame(()=>requestAnimationFrame(()=>document.body.classList.add('ready')));
}

function navigate(path,{replace=false}={}){if(path===currentPath){scrollTo({top:0,behavior:prefersReducedMotion()?'instant':'smooth'});return;}
 if(!replace)history.pushState({path},'',path);else history.replaceState({path},'',path);render(path);}
function smoothAnchor(href){const el=href==='#top'?document.body:$(href);if(el)el.scrollIntoView({behavior:prefersReducedMotion()?'instant':'smooth',block:'start'});else if(href==='#app')app.focus();}
function initReveal(){observer?.disconnect();if(prefersReducedMotion()){$$('.reveal').forEach(x=>x.classList.add('is-visible'));return;}
 observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}},{threshold:.075,rootMargin:'0px 0px -30px 0px'});
 $$('.reveal').forEach(el=>observer.observe(el));}

function updateScroll(){const y=scrollY,remaining=document.documentElement.scrollHeight-innerHeight,percent=remaining>0?y/remaining:0;
 $('#scroll-progress').style.transform=`scaleX(${clamp(percent,0,1)})`;
 document.body.classList.toggle('scrolled',y>60);if(y<175||y<lastScroll-4)header.classList.remove('nav-hidden');else if(y>260&&y>lastScroll+4&&!mobileOpen)header.classList.add('nav-hidden');lastScroll=y;scene.onScroll();stars.setScroll(y);
 document.body.style.setProperty('--scroll-hero',Math.min(y/Math.max(innerHeight,1),1).toFixed(3));}
window.addEventListener('scroll',()=>{if(scrollRaf)return;scrollRaf=requestAnimationFrame(()=>{updateScroll();scrollRaf=0;});},{passive:true});


function openMenu(){mobileOpen=true;document.body.classList.add('menu-open');$('.mobile-toggle').setAttribute('aria-expanded','true');$('.mobile-toggle').setAttribute('aria-label','Close navigation');$('.mobile-toggle').innerHTML=icon('close',23);overlayType='menu';overlay.innerHTML=`<div class="mobile-menu" role="dialog" aria-modal="true" aria-label="Site menu"><button type="button" class="menu-dismiss" data-action="close-overlay" aria-label="Close navigation">${icon('close',23)}</button><nav>${NAV.map((n,i)=>`<a href="${n.href}" data-link><small>0${i+1} /</small>${n.label}${icon('diagonal',23)}</a>`).join('')}<a href="/contact" data-link><small>06 /</small>Contact ${icon('diagonal',23)}</a></nav><div><span>ORBIT / FICTIONAL SPACE EXPLORATION</span><span>LOOK BEYOND THE OBVIOUS ✳</span></div></div>`;}
function closeOverlay(update=true){document.body.style.overflow='';overlay.innerHTML='';overlayType='';document.body.classList.remove('menu-open','exploring','palette-open');if(mobileOpen){mobileOpen=false;const btn=$('.mobile-toggle');if(btn){btn.setAttribute('aria-expanded','false');btn.innerHTML=icon('menu',23);}}if(update)scene.onScroll();}
function openPalette(){if(overlayType)closeOverlay();overlayType='palette';document.body.classList.add('palette-open');overlay.innerHTML=`<div class="palette-scrim" data-action="close-overlay"></div><div class="command-palette" role="dialog" aria-modal="true" aria-label="Quick navigation"><div class="palette-search">${icon('search',20)}<input id="palette-input" autofocus type="search" placeholder="Where would you like to go?" autocomplete="off" aria-label="Search destinations"/><kbd>ESC</kbd></div><div class="palette-results" id="palette-results"></div><div class="palette-footer"><span>${icon('keyboard',15)} TYPE TO SEARCH</span><span>↵ TO OPEN</span></div></div>`;updatePalette('');requestAnimationFrame(()=>$('#palette-input')?.focus());}
function updatePalette(value){const input=value.toLowerCase().trim();const list=[...NAV,{href:'/contact',label:'Contact'},...worlds.map(w=>({href:'/worlds/'+w.slug,label:w.name+' — '+w.type}))].filter(v=>v.label.toLowerCase().includes(input));const el=$('#palette-results');if(!el)return;el.innerHTML=list.length?list.map((v,i)=>`<a href="${v.href}" data-link class="palette-result ${i===0?'selected':''}"><span>${v.label}</span>${icon('diagonal',17)}</a>`).join(''):`<div class="palette-empty">No matching destinations. Try “Aurelia” or “Missions”.</div>`;}
function openExplorer(){if(currentPage!=='world-detail')return;overlayType='explore';document.body.classList.add('exploring');document.body.style.overflow='hidden';const w=getWorld(currentPath.split('/')[2]);overlay.innerHTML=`<div class="explore-controls"><div class="explore-control-head"><span>${icon('compass',20)} ORBIT / IMMERSIVE OBSERVATION</span><button type="button" data-action="close-overlay" aria-label="Exit immersive view">EXIT VIEW ${icon('close',19)}</button></div><div class="explore-readout"><span>OBJECT ${w.index} / 05</span><h2>${w.name.toUpperCase()}</h2><p>${w.type.toUpperCase()} — ${w.coordinates}</p></div><div class="explore-foot"><span>${icon('mouse',17)} DRAG TO ROTATE</span><span>LIVE PROCEDURAL RENDER</span><button type="button" data-action="close-overlay">CLOSE EXPERIENCE ${icon('close',17)}</button></div></div>`;scene.onScroll();}
function closeExplorer(){document.body.style.overflow='';closeOverlay();}

function handleFilter(filter){$$('.filter').forEach(b=>{const active=b.dataset.filter===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});$$('.catalog-card').forEach(c=>{const on=filter==='all'||c.dataset.family===filter;c.classList.toggle('filtered-out',!on);c.hidden=!on;});}
function handleAccordion(index){$$('.mission-entry').forEach((entry,i)=>{const active=Number(index)===i;entry.classList.toggle('opened',active);const btn=$('.mission-entry-head',entry);btn.setAttribute('aria-expanded',String(active));$('.mission-round',entry).innerHTML=icon(active?'close':'plus',18);});}
function handleSystem(id){const system=systems.find(s=>s.id===id);if(!system)return;$$('.system-tab').forEach(t=>{const active=t.dataset.system===id;t.classList.toggle('active',active);t.setAttribute('aria-selected',String(active));});$('.systems-panes').innerHTML=systemPanel(system);}
function handleView(mode){$$('.view-mode').forEach(b=>{const active=b.dataset.view===mode;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});scene.setMode(mode);}
async function handleContact(form){const feedback=$('.form-feedback',form);const name=$('#contact-name'),email=$('#contact-email'),message=$('#contact-message');
 if(!form.reportValidity()){feedback.textContent='Please complete the required fields with valid information.';return;}
 const text=`ORBIT — CONTACT TRANSMISSION\n\nName: ${name.value.trim()}\nEmail: ${email.value.trim()}\nSubject: ${$('#contact-subject').value}\n\n${message.value.trim()}`;
 try{await navigator.clipboard.writeText(text);feedback.textContent='Transmission copied. Paste it into your email or messaging app.';toast('Transmission copied to clipboard');}
 catch(e){const temp=document.createElement('textarea');temp.value=text;document.body.appendChild(temp);temp.select();const ok=document.execCommand('copy');temp.remove();feedback.textContent=ok?'Transmission copied to clipboard.':'Copy unavailable in this browser. Please select your text and copy it manually.';if(ok)toast('Transmission copied to clipboard');}
}

document.addEventListener('click',async e=>{
 const action=e.target.closest('[data-action]');
 if(action){const name=action.dataset.action;
 if(name==='menu'){e.preventDefault();mobileOpen?closeOverlay():openMenu();return;}
 if(name==='audio'){e.preventDefault();const on=await audio.toggle();$$('.sound-toggle').forEach(b=>{b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',on?'Mute ambient sound':'Enable ambient sound');b.innerHTML=icon(on?'sound':'mute',19);});toast(on?'Ambient sound enabled':'Ambient sound off');return;}
 if(name==='search'){e.preventDefault();openPalette();return;}
 if(name==='close-overlay'){e.preventDefault();closeExplorer();return;}
 if(name==='explore'){e.preventDefault();openExplorer();return;}
 }
 const filt=e.target.closest('[data-filter]');if(filt){handleFilter(filt.dataset.filter);return;}
 const accord=e.target.closest('[data-accordion]');if(accord){handleAccordion(accord.dataset.accordion);return;}
 const system=e.target.closest('[data-system]');if(system){handleSystem(system.dataset.system);return;}
 const view=e.target.closest('[data-view]');if(view){handleView(view.dataset.view);return;}
 const anchor=e.target.closest('a[href]');if(!anchor)return;
 if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0||anchor.target==='_blank'||anchor.hasAttribute('download'))return;
 let href=anchor.getAttribute('href');if(!href)return;
 if(href.startsWith('#')){e.preventDefault();if(overlayType)closeOverlay();smoothAnchor(href);return;}
 if(href.startsWith('/')){e.preventDefault();navigate(href);return;}
});
document.addEventListener('submit',e=>{if(e.target.matches('#contact-form')){e.preventDefault();handleContact(e.target);}});
document.addEventListener('input',e=>{if(e.target.id==='palette-input')updatePalette(e.target.value);});
document.addEventListener('keydown',e=>{
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openPalette();return;}
 if(e.key==='Escape'){if(overlayType){closeExplorer();return;} }
 if(e.key==='Enter'&&overlayType==='palette'&&e.target.id==='palette-input'){e.preventDefault();const selected=$('.palette-result');if(selected)navigate(selected.getAttribute('href'));}
});
window.addEventListener('popstate',()=>render(location.pathname,{preserveScroll:false}));
window.addEventListener('resize',updateScroll,{passive:true});
render(decodeURIComponent(location.pathname));
