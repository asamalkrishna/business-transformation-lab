(function(){
var D=document,RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
D.body.classList.add('f1-page','js-rv');
var P=window.F1P='M200 276H430C505 276 556 250 556 206C556 168 526 150 490 150H438C402 150 386 134 386 112C386 90 404 80 426 82C470 86 500 70 500 48C500 30 480 24 456 24H300C262 24 248 46 222 52C196 58 176 40 150 40C100 40 66 66 66 108C66 150 112 158 112 196C112 250 150 276 200 276Z';
/* one lap model: speed from corner radius, time integrated from speed, so motion matches telemetry */
window.F1Model=function(path,lapMs){
var L=path.getTotalLength(),N=300,cv=[],ang=[],i;
function sm(a,r){return a.map(function(_,x){var s=0;for(var d=-r;d<=r;d++)s+=a[(x+d+N)%N];return s/(2*r+1)})}
for(i=0;i<N;i++){var s=L*i/N,a=path.getPointAtLength((s+3)%L),b=path.getPointAtLength((s-3+L)%L);ang.push(Math.atan2(a.y-b.y,a.x-b.x))}
for(i=0;i<N;i++){var d=ang[(i+1)%N]-ang[i];while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;cv.push(Math.abs(d))}
cv=sm(cv,5);var mx=Math.max.apply(null,cv);
var sp=sm(cv.map(function(c){return 320-250*Math.pow(c/mx,.55)}),4),th=[],br=[],gr=[];
for(i=0;i<N;i++){var dv=sp[(i+1)%N]-sp[i];br.push(dv<-.8?Math.min(100,-dv*30):0);gr.push(Math.max(2,Math.min(8,Math.round(sp[i]/40))))}
br=sm(br,3);for(i=0;i<N;i++)th.push(br[i]>4?0:100);th=sm(th,4).map(function(v,k){return v*(1-br[k]/100)});
var T=[0];for(i=0;i<N;i++)T.push(T[i]+1/sp[i]);var tot=T[N];
return{L:L,N:N,sp:sp,th:th,br:br,gr:gr,lapMs:lapMs,
fOfU:function(u){var t=(((u%1)+1)%1)*tot,lo=0,hi=N,m;while(hi-lo>1){m=(lo+hi)>>1;if(T[m]<=t)lo=m;else hi=m}return(lo+(t-T[lo])/(T[lo+1]-T[lo]))/N},
uOfF:function(f){var x=f*N,k=Math.min(N-1,Math.floor(x));return(T[k]+(x-k)*(T[k+1]-T[k]))/tot}}};
window.F1Place=function(path,L,g,f){var p=path.getPointAtLength(f*L),q=path.getPointAtLength((f*L+5)%L);g.setAttribute('transform','translate('+p.x.toFixed(1)+' '+p.y.toFixed(1)+') rotate('+(Math.atan2(q.y-p.y,q.x-p.x)*57.296).toFixed(1)+')')};

var h=D.querySelector('.page-header .wrap');if(!h)return;
var l=D.createElement('div');l.className='f1-hero-l';while(h.firstChild)l.appendChild(h.firstChild);h.appendChild(l);
var c='<path d="M11 0L-8 -6.5-5 0-8 6.5Z"/>',pa=function(k){return '<path class="'+k+'" d="'+P+'"/>'};
h.insertAdjacentHTML('beforeend','<div class="f1-hero-r"><div class="f1-panel"><div class="f1-lights" role="button" tabindex="0" aria-label="Replay race start"><i></i><i></i><i></i><i></i><i></i><span>Lights out to replay</span></div>'+
'<svg class="f1-circuit" viewBox="0 0 620 320" aria-hidden="true">'+pa('rd')+'<path class="cl" id="trk" d="'+P+'"/>'+pa('sc s1')+pa('sc s2')+pa('sc s3')+pa('tr t')+pa('tr t')+pa('tr r')+pa('tr r')+'<line class="gate" id="hGate"/><g class="car t" id="hG">'+c+'</g><g class="car r" id="hC">'+c+'</g></svg>'+
'<div class="f1-timing"><div><small>Lap</small><b id="hL">1</b></div><div><small>Time</small><b id="hT">0:00.000</b></div><div class="sec"><i></i><i></i><i></i></div><div><small>km/h</small><b id="hK">0</b></div></div></div></div>');
var Q=function(s){return h.querySelector(s)},A=function(s){return[].slice.call(h.querySelectorAll(s))},
path=Q('#trk'),M=F1Model(path,9000),C=Q('#hC'),G=Q('#hG'),S=A('.sc'),TR=A('.tr.r'),TT=A('.tr.t'),chips=A('.sec i'),lights=A('.f1-lights i'),lab=Q('.f1-lights span'),
eT=Q('#hT'),eL=Q('#hL'),eK=Q('#hK'),go=false,t0=0,timers=[],gap=.014;
var p0=path.getPointAtLength(0),q0=path.getPointAtLength(4),gx=-(q0.y-p0.y),gy=q0.x-p0.x,gl=Math.hypot(gx,gy)||1,gt=Q('#hGate');
gt.setAttribute('x1',p0.x-gx/gl*16);gt.setAttribute('y1',p0.y-gy/gl*16);gt.setAttribute('x2',p0.x+gx/gl*16);gt.setAttribute('y2',p0.y+gy/gl*16);
var L=M.L,TL=L*.07;Q('.f1-circuit').style.setProperty('--L',L);
[].concat(TR,TT).forEach(function(e){e.style.strokeDasharray=TL+' '+L*2});
function trail(a,f){var o=TL-f*L;a[0].style.strokeDashoffset=o;a[1].style.strokeDashoffset=o-L}
function fmt(ms){var s=(ms%60000)/1000;return Math.floor(ms/60000)+':'+(s<10?'0':'')+s.toFixed(3)}
function draw(f,g,tf,n){F1Place(path,M.L,C,f);F1Place(path,M.L,G,g);trail(TR,f);trail(TT,g);
S.forEach(function(e,k){var a=k*L/3,v=Math.max(0,Math.min(L/3,f*L-a));e.style.strokeDasharray='0 '+a.toFixed(1)+' '+v.toFixed(1)+' '+(L*2).toFixed(0)});
chips.forEach(function(e,k){e.classList.toggle('on',f>=(k+1)/3-.002&&tf>0)});
eK.textContent=Math.round(M.sp[Math.min(M.N-1,Math.floor(f*M.N))]);eT.textContent=fmt(tf*78400);eL.textContent=n}
function idle(){draw(0,((-gap)%1+1)%1,0,1)}
function frame(now){if(go){var u=(now-t0)/M.lapMs,tf=u-Math.floor(u);draw(M.fOfU(u),M.fOfU(u-gap),tf,Math.floor(u)+1)}requestAnimationFrame(frame)}
function start(){timers.forEach(clearTimeout);timers=[];go=false;lab.classList.remove('go');lab.textContent='Lights out to replay';lights.forEach(function(e){e.classList.remove('on')});idle();
for(var k=0;k<5;k++)(function(k){timers.push(setTimeout(function(){lights[k].classList.add('on')},700+k*620))})(k);
timers.push(setTimeout(function(){lights.forEach(function(e){e.classList.remove('on')});lab.classList.add('go');lab.textContent='Go';go=true;t0=performance.now()},700+5*620+950))}
var gl2=Q('.f1-lights');gl2.addEventListener('click',start);gl2.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();start()}});
idle();if(RM){draw(.62,.6,.62,1);lab.textContent='Motion reduced'}else{requestAnimationFrame(frame);var pn=Q('.f1-panel'),began=false;
function arm(){if(began)return;began=true;pn.classList.add('go');start()}
if('IntersectionObserver' in window){var io0=new IntersectionObserver(function(es){if(es[0].isIntersecting){io0.disconnect();arm()}},{threshold:.55});io0.observe(pn)}else setTimeout(arm,350)}
var it=['Mercedes · my team','Hamilton · my driver','Abu Dhabi 2021 · under review','Scorecard · 8 titles','Loyalty with a data-quality issue'].map(function(t){return'<span>'+t+'</span>'}).join('');
D.querySelector('.page-header').insertAdjacentHTML('afterend','<div class="f1-ticker" aria-hidden="true"><div>'+it+it+'</div></div>');
})();
