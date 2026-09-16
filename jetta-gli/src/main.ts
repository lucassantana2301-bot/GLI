const menu = document.querySelector<HTMLButtonElement>('.menu-toggle')!;
const nav = document.querySelector<HTMLElement>('#nav')!;
const setMenu = (open: boolean) => {
 menu.setAttribute('aria-expanded',String(open));
 nav.classList.toggle('is-open',open);
};
menu.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
nav.addEventListener('click',event=>{if((event.target as Element).closest('a'))setMenu(false)});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){setMenu(false);menu.focus()}});
document.addEventListener('click',event=>{if(!(event.target as Element).closest('.header'))setMenu(false)});
matchMedia('(min-width:601px)').addEventListener('change',()=>setMenu(false));

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const reveals = document.querySelectorAll<HTMLElement>('[data-reveal]');
if('IntersectionObserver' in window){
 document.documentElement.classList.add('motion-ready');
 const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12});
 reveals.forEach(element=>observer.observe(element));
}
const steps = [...document.querySelectorAll<HTMLElement>('.story-step')];
const counter = document.querySelector<HTMLElement>('#detail-count')!;
const parallax = document.querySelector<HTMLElement>('.parallax')!;
const parallaxImage = parallax.querySelector<HTMLImageElement>('img')!;
let scheduled = false;
function updateScroll(){
 scheduled=false;
 const middle=innerHeight*.5;
 let nearest=0, distance=Infinity;
 steps.forEach((step,index)=>{const rect=step.getBoundingClientRect();const d=Math.abs(rect.top+rect.height/2-middle);if(d<distance){nearest=index;distance=d}});
 steps.forEach((step,index)=>step.classList.toggle('is-active',index===nearest));
 counter.textContent=String(nearest+1).padStart(2,'0');
 if(!reduced.matches&&innerWidth>600){const rect=parallax.getBoundingClientRect();if(rect.bottom>0&&rect.top<innerHeight){const offset=Math.max(-18,Math.min(18,(rect.top+rect.height/2-middle)*.045));parallaxImage.style.transform=`scale(1.045) translateY(${offset}px)`}}
 else parallaxImage.style.transform='';
}
const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateScroll)}};
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduced.addEventListener('change',schedule);updateScroll();

const gallery=[...document.querySelectorAll<HTMLAnchorElement>('[data-gallery]')];
const dialog=document.querySelector<HTMLDialogElement>('#lightbox')!;
const enlarged=document.querySelector<HTMLImageElement>('#lightbox-image')!;
const caption=document.querySelector<HTMLElement>('#lightbox-caption')!;
const galleryCount=document.querySelector<HTMLElement>('#lightbox-counter')!;
let current=0;
let opener: HTMLAnchorElement | null=null;
function showImage(index:number){
 current=(index+gallery.length)%gallery.length;
 const selected=gallery[current];
 const original=selected.querySelector<HTMLImageElement>('img')!;
 enlarged.src=selected.href;enlarged.alt=original.alt;caption.textContent=original.alt;
 galleryCount.textContent=`${String(current+1).padStart(2,'0')} / ${String(gallery.length).padStart(2,'0')}`;
}
gallery.forEach((link,index)=>link.addEventListener('click',event=>{event.preventDefault();opener=link;showImage(index);dialog.showModal();document.body.classList.add('modal-open')}));
dialog.querySelector<HTMLButtonElement>('.close')!.addEventListener('click',()=>dialog.close());
document.querySelector('#previous')!.addEventListener('click',()=>showImage(current-1));
document.querySelector('#next')!.addEventListener('click',()=>showImage(current+1));
dialog.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();showImage(current+1)}if(event.key==='ArrowLeft'){event.preventDefault();showImage(current-1)}});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');opener?.focus()});
let touchX=0,touchY=0;
enlarged.addEventListener('touchstart',event=>{touchX=event.changedTouches[0].clientX;touchY=event.changedTouches[0].clientY},{passive:true});
enlarged.addEventListener('touchend',event=>{const dx=event.changedTouches[0].clientX-touchX,dy=event.changedTouches[0].clientY-touchY;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy))showImage(current+(dx<0?1:-1))},{passive:true});
