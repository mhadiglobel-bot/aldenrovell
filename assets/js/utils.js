export const $=(selector,scope=document)=>scope.querySelector(selector);
export const $$=(selector,scope=document)=>[...scope.querySelectorAll(selector)];
export const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
export const lerp=(a,b,t)=>a+(b-a)*t;
export const escapeHtml=(value='')=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const prefersReducedMotion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const icon=(name,size=18)=>{
 const paths={
  arrow:'<path d="M5 12h14m-7-7 7 7-7 7"/>',
  diagonal:'<path d="M7 17 17 7M8 7h9v9"/>',
  chevron:'<path d="m9 18 6-6-6-6"/>',
  down:'<path d="m6 9 6 6 6-6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  close:'<path d="M18 6 6 18M6 6l12 12"/>',
  menu:'<path d="M4 8h16M4 16h16"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18M12 3c-5 5-5 13 0 18"/>',
  sound:'<path d="m4 10 4 0 5-4v12l-5-4H4zM17 9c2 1 2 5 0 6M19 6c5 4 5 8 0 12"/>',
  mute:'<path d="m4 10h4l5-4v12l-5-4H4zM17 9l5 6m0-6-5 6"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  copy:'<rect x="8" y="8" width="11" height="11" rx="2"/><path d="M5 15V5h10"/>',
  search:'<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
  sparkle:'<path d="m12 2 2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2Z"/>',
  pause:'<path d="M8 5v14M16 5v14"/>',
  play:'<path d="m8 5 11 7-11 7V5Z"/>',
  external:'<path d="M13 5h6v6M19 5l-9 9M19 13v6H5V5h6"/>',
  back:'<path d="M19 12H5m7 7-7-7 7-7"/>',
  compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-2.4 5.6L8 16l2.4-5.6L16 8Z"/>',
  mouse:'<rect x="6" y="2" width="12" height="20" rx="6"/><path d="M12 6v4"/>',
  keyboard:'<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M6 10h1m3 0h1m3 0h1m3 0h0M7 15h10"/>'
 };
 return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.sparkle}</svg>`;
};
export const emblem=(size=36)=>`<svg width="${size}" height="${size}" viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="9.5" fill="currentColor"/><ellipse cx="28" cy="28" rx="25" ry="11.5" transform="rotate(-26 28 28)" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="48" cy="17" r="3" fill="#F6B79D"/></svg>`;
export const link=(href,label,extra='')=>`<a href="${href}" data-link ${extra}>${label}</a>`;
export const pill=(href,label,extra='')=>`<a class="btn btn-primary ${extra}" href="${href}" data-link><span>${label}</span><span class="btn-icon">${icon('diagonal',17)}</span></a>`;
export function toast(message){ const el=$('#toast');if(!el)return;el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),3200);}
