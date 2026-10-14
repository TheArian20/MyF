const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const canvas = document.getElementById('sky');
const ctx = canvas.getContext('2d');
let width = 0, height = 0, stars = [], shooting = [], frame = null;
const pointer = {x:0,y:0};
function resizeSky() {
  width = innerWidth; height = innerHeight;
  const scale = Math.min(devicePixelRatio || 1,2);
  canvas.width=width*scale;canvas.height=height*scale;ctx.setTransform(scale,0,0,scale,0,0);
  stars=Array.from({length:width<700?65:140},()=>({x:Math.random()*width,y:Math.random()*height,r:Math.random()*1.3+.35,phase:Math.random()*6.28,depth:Math.random()}));
  if(reducedMotion.matches)drawSky(0);
}
function drawSky(time) {
  ctx.clearRect(0,0,width,height);
  for(const star of stars){ctx.globalAlpha=.25+(Math.sin(time*.0006+star.phase)+1)*.23;ctx.fillStyle='#f9dce9';ctx.beginPath();ctx.arc(star.x+pointer.x*star.depth*12,star.y+pointer.y*star.depth*12,star.r,0,Math.PI*2);ctx.fill();}
  ctx.globalAlpha=1;shooting=shooting.filter(star=>time-star.start<1500);
  for(const star of shooting){const p=(time-star.start)/1500,x=star.x+p*width*.7,y=star.y+p*height*.45;const gradient=ctx.createLinearGradient(x-95,y-60,x,y);gradient.addColorStop(0,'transparent');gradient.addColorStop(1,'#ffe4ee');ctx.globalAlpha=Math.sin(p*Math.PI);ctx.strokeStyle=gradient;ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(x-95,y-60);ctx.lineTo(x,y);ctx.stroke();}ctx.globalAlpha=1;
}
function animate(time){drawSky(time);frame=requestAnimationFrame(animate);}
function manageAnimation(){if(frame!==null)cancelAnimationFrame(frame);frame=null;if(!document.hidden&&!reducedMotion.matches)frame=requestAnimationFrame(animate);else drawSky(0);}
resizeSky();manageAnimation();addEventListener('resize',resizeSky);document.addEventListener('visibilitychange',manageAnimation);reducedMotion.addEventListener('change',manageAnimation);
addEventListener('pointermove',event=>{if(reducedMotion.matches||event.pointerType==='touch')return;pointer.x=event.clientX/width-.5;pointer.y=event.clientY/height-.5;const art=document.querySelector('.hero-art');art.style.setProperty('--px',pointer.x*12+'px');art.style.setProperty('--py',pointer.y*10+'px');},{passive:true});
if(!reducedMotion.matches&&'IntersectionObserver' in window){document.documentElement.classList.add('js-motion');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(section=>observer.observe(section));}
function updateProgress(){const total=document.documentElement.scrollHeight-innerHeight;document.querySelector('.progress').style.width=(total>0?scrollY/total*100:0)+'%';}
addEventListener('scroll',updateProgress,{passive:true});addEventListener('resize',updateProgress);updateProgress();
// 5 de febrero de 2024, medianoche de Colombia.
const origin=new Date('2024-02-05T00:00:00-05:00').getTime();
function updateTime(){const elapsed=Math.max(0,Date.now()-origin);document.getElementById('days').textContent=Math.floor(elapsed/86400000).toLocaleString('es-CO');document.getElementById('hours').textContent=String(Math.floor(elapsed/3600000)%24).padStart(2,'0');document.getElementById('minutes').textContent=String(Math.floor(elapsed/60000)%60).padStart(2,'0');}updateTime();setInterval(updateTime,15000);
let wishIndex=0;const wishes=['Que algo bonito encuentre su camino hacia ti. ♡','Que nunca te falten razones para sonreír. ✧','Que tus sueños encuentren un cielo donde brillar. ☾','Que los pequeños momentos se vuelvan grandes recuerdos. ♡'];
document.getElementById('wish').addEventListener('click',()=>{document.getElementById('wish-message').textContent=wishes[wishIndex++%wishes.length];if(!reducedMotion.matches)shooting.push({x:width*.08,y:height*.15,start:performance.now()});});
const letterDialog=document.getElementById('letter-dialog');document.getElementById('open-letter').addEventListener('click',()=>letterDialog.showModal());
const photoDialog=document.getElementById('photo-dialog');
const photos=[{src:'assets/manuel.png',caption:'Manuel · La luna de este universo',alt:'Manuel frente al espejo'},{src:'assets/fernanda.jpeg',caption:'Fernanda · Mi estrella favorita',alt:'Fernanda con gafas'},{src:'assets/fernanda-espejo.jpeg',caption:'Fernanda · Otro pequeño recuerdo',alt:'Fernanda frente al espejo'}];let photoIndex=0;
function showPhoto(index){photoIndex=(index+photos.length)%photos.length;const photo=photos[photoIndex];document.getElementById('full-photo').src=photo.src;document.getElementById('full-photo').alt=photo.alt;document.getElementById('full-caption').textContent=photo.caption;document.getElementById('photo-count').textContent=`${photoIndex+1} / ${photos.length}`;}
document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{showPhoto(Number(button.dataset.photo));photoDialog.showModal();}));document.getElementById('previous-photo').addEventListener('click',()=>showPhoto(photoIndex-1));document.getElementById('next-photo').addEventListener('click',()=>showPhoto(photoIndex+1));photoDialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft')showPhoto(photoIndex-1);if(event.key==='ArrowRight')showPhoto(photoIndex+1);});
// Permite cambiar de foto deslizando el dedo sin bloquear el desplazamiento vertical.
let swipeStart = null;
const fullPhoto = document.getElementById('full-photo');
fullPhoto.addEventListener('touchstart', event => {
  swipeStart = event.touches.length === 1
    ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
}, { passive: true });
fullPhoto.addEventListener('touchend', event => {
  if (!swipeStart || !event.changedTouches.length) return;
  const dx = event.changedTouches[0].clientX - swipeStart.x;
  const dy = event.changedTouches[0].clientY - swipeStart.y;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
    showPhoto(photoIndex + (dx < 0 ? 1 : -1));
  }
  swipeStart = null;
}, { passive: true });
fullPhoto.addEventListener('touchcancel', () => { swipeStart = null; }, { passive: true });
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.style.overflow='';});});
const dialogObserver=new MutationObserver(()=>{document.body.style.overflow=document.querySelector('dialog[open]')?'hidden':'';});document.querySelectorAll('dialog').forEach(dialog=>dialogObserver.observe(dialog,{attributes:true,attributeFilter:['open']}));
