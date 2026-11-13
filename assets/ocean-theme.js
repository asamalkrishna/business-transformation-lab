(function(){
'use strict';
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var D=document, W, H, dpr=Math.min(devicePixelRatio||1,1.5), mx=-999, my=-999, sy=0;

/* ---------- Live ocean canvas ---------- */
var c=D.createElement('canvas');c.id='oc-canvas';c.setAttribute('aria-hidden','true');D.body.prepend(c);
var x=c.getContext('2d');
function size(){W=innerWidth;H=innerHeight;c.width=W*dpr;c.height=H*dpr;c.style.width=W+'px';c.style.height=H+'px';x.setTransform(dpr,0,0,dpr,0,0)}
size();addEventListener('resize',size);
addEventListener('scroll',function(){sy=scrollY;var m=D.documentElement.scrollHeight-innerHeight;depth=m>0?Math.min(1,scrollY/m):0},{passive:true});
addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY},{passive:true});

var depth=0,R=Math.random, bub=[], plank=[], fish=[];
for(var i=0;i<38;i++)bub.push({x:R()*2000,y:R()*1200,r:2+R()*9,s:.25+R()*.7,p:R()*6.28,w:.5+R()*1.4});
for(i=0;i<130;i++)plank.push({x:R()*2000,y:R()*1200,r:.6+R()*1.4,s:.08+R()*.25,p:R()*6.28});
for(i=0;i<0;i++)fish.push({x:R()*2000,y:.2*1000+R()*600,s:(.5+R()*1.1)*(R()<.5?-1:1),z:.6+R()*1.2,p:R()*6.28,h:R()<.5?190:170});

function fishShape(f,t){
  var d=f.s>0?1:-1,L=22*f.z,tail=Math.sin(t*5+f.p)*.35;
  x.save();x.translate(f.x,f.y+Math.sin(t*1.2+f.p)*14);x.scale(d,1);
  x.fillStyle='hsla('+f.h+',85%,70%,'+(.16+.08*f.z)+')';
  x.beginPath();x.ellipse(0,0,L,L*.42,0,0,6.283);x.fill();
  x.beginPath();x.moveTo(-L*.8,0);x.lineTo(-L*1.5,-L*.45+tail*L);x.lineTo(-L*1.5,L*.45+tail*L);x.closePath();x.fill();
  x.fillStyle='rgba(255,255,255,.35)';x.beginPath();x.arc(L*.55,-L*.1,1.6*f.z,0,6.283);x.fill();
  x.restore();
}
var waves=[
 {a:48,f:.005,s:.6, y:.84,c:'rgba(94,234,212,.13)'},
 {a:36,f:.008,s:-.8,y:.88,c:'rgba(34,211,238,.12)'},
 {a:26,f:.011,s:1.1,y:.92,c:'rgba(20,150,170,.30)'},
 {a:18,f:.015,s:-1.4,y:.96,c:'rgba(6,90,120,.55)'}
];
var last=0, run=true;
D.addEventListener('visibilitychange',function(){run=!D.hidden;if(run)requestAnimationFrame(loop)});

function loop(ts){
  if(!run)return; var t=ts/1000; last=t;
  x.clearRect(0,0,W,H);
  /* plankton */
  for(var p of plank){
    p.y-=p.s;p.x+=Math.sin(t+p.p)*.25; if(p.y<-10){p.y=H+10;p.x=R()*W}
    var px=((p.x%W)+W)%W; var tw=.25+.35*Math.sin(t*1.6+p.p),hu=p.r>1.2?172:198;
    x.fillStyle='hsla('+hu+',100%,65%,'+(tw*.16)+')';x.beginPath();x.arc(px,p.y,p.r*5,0,6.283);x.fill();
    x.fillStyle='hsla('+hu+',100%,80%,'+(tw+.2)+')';x.beginPath();x.arc(px,p.y,p.r,0,6.283);x.fill();
  }
  /* fish */
  for(var f of fish){
    f.x+=f.s*f.z; if(f.s>0&&f.x>W+120){f.x=-120;f.y=H*(.2+R()*.6)} if(f.s<0&&f.x<-120){f.x=W+120;f.y=H*(.2+R()*.6)}
    fishShape(f,t);
  }
  /* bubbles (flee the cursor) */
  for(var b of bub){
    b.y-=b.s; b.x+=Math.sin(t*b.w+b.p)*.5;
    var dx=b.x-mx, dy=b.y-my, d=Math.hypot(dx,dy);
    if(d<110){b.x+=dx/d*(110-d)*.06;b.y+=dy/d*(110-d)*.06}
    if(b.y<-20){b.y=H+20;b.x=R()*W}
    var bxx=((b.x%W)+W)%W, gr=x.createRadialGradient(bxx-b.r*.3,b.y-b.r*.3,b.r*.1,bxx,b.y,b.r);
    gr.addColorStop(0,'rgba(255,255,255,.55)');gr.addColorStop(.6,'rgba(167,243,240,.10)');gr.addColorStop(1,'rgba(167,243,240,.28)');
    x.fillStyle=gr;x.beginPath();x.arc(bxx,b.y,b.r,0,6.283);x.fill();
  }
  /* parallax waves at the bottom */
  for(var w of waves){
    var base=H*w.y+sy*.03*(1+w.f*40); x.fillStyle=w.c;x.beginPath();x.moveTo(0,H);
    for(var X=0;X<=W+8;X+=8)x.lineTo(X,base+Math.sin(X*w.f+t*w.s)*w.a+Math.sin(X*w.f*2.3-t*w.s*.7)*w.a*.4);
    x.lineTo(W,H);x.closePath();x.fill();
    if(w.a>30){x.strokeStyle='rgba(180,235,255,.16)';x.lineWidth=1.5;x.beginPath();
      for(X=0;X<=W+8;X+=8){var yy=base+Math.sin(X*w.f+t*w.s)*w.a+Math.sin(X*w.f*2.3-t*w.s*.7)*w.a*.4;X?x.lineTo(X,yy):x.moveTo(X,yy)}x.stroke()}
  }
  requestAnimationFrame(loop);
}
if(reduce){loop(0);run=false}else requestAnimationFrame(loop);

if(reduce)return;

/* ---------- Cursor light + click ripples ---------- */
var glow=D.createElement('div');glow.className='oc-cursor';D.body.appendChild(glow);
var gx=0,gy=0;
(function mv(){gx+=(mx-gx)*.14;gy+=(my-gy)*.14;glow.style.transform='translate('+(gx-210)+'px,'+(gy-210)+'px)';requestAnimationFrame(mv)})();
addEventListener('pointerdown',function(e){
  for(var i=0;i<3;i++){var r=D.createElement('span');r.className='oc-ripple';
    r.style.left=e.clientX+'px';r.style.top=e.clientY+'px';r.style.animationDelay=(i*.15)+'s';
    D.body.appendChild(r);setTimeout(function(n){n.remove()},1800,r)}
});

/* ---------- Scroll progress ---------- */
var bar=D.createElement('div');bar.className='oc-progress';D.body.appendChild(bar);
addEventListener('scroll',function(){var m=D.documentElement.scrollHeight-H;bar.style.transform='scaleX('+(m>0?scrollY/m:0)+')'},{passive:true});

/* ---------- Reveal on scroll (staggered) ---------- */
var sel='h1,h2,h3,.eyebrow,section p,[class*="card"],[class*="-box"],figure,.sv,.trade-process-wrap,.hero-actions,.hero-note';
var els=[].slice.call(D.querySelectorAll(sel)).filter(function(e){return !e.closest('.site-nav,.site-footer')});
els.forEach(function(e,i){e.classList.add('oc-r');e.style.setProperty('--d',((i%5)*70)+'ms')});
var io=new IntersectionObserver(function(en){en.forEach(function(o){if(o.isIntersecting){o.target.classList.add('oc-in');io.unobserve(o.target)}})},{threshold:.08,rootMargin:'0px 0px -6% 0px'});
els.forEach(function(e){io.observe(e)});

/* ---------- 3D tilt + spotlight on cards ---------- */
D.querySelectorAll('[class*="card"],.trade-box').forEach(function(el){
  if(el.offsetWidth>560)return; el.classList.add('oc-tilt');
  el.addEventListener('pointermove',function(e){
    var r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
    el.style.setProperty('--rx',((.5-py)*8)+'deg');el.style.setProperty('--ry',((px-.5)*10)+'deg');
    el.style.setProperty('--mx',(px*100)+'%');el.style.setProperty('--my',(py*100)+'%');
  });
  el.addEventListener('pointerleave',function(){el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')});
});

/* ---------- Hero portrait float ---------- */
var im=D.querySelector('.home-hero img');if(im&&im.parentElement)im.parentElement.classList.add('oc-float');
})();
