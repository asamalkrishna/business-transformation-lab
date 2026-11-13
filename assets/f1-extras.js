(function(){
var D=document,$=function(s,r){return (r||D).querySelector(s)};
var q=$('.life-quote');if(!q)return;var anchor=q.closest('section');
/* hero stat strip */
var lede=$('.page-lede');
if(lede)lede.insertAdjacentHTML('afterend','<div class="f1-stats"><div><b>7</b><span>Official titles</span></div><div><b>8</b><span>My scorecard</span></div><div><b>44</b><span>The number</span></div></div>');

var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,P=window.F1P;
var html=
'<section><div class="wrap"><div class="section-head"><h2 class="section-title">Anatomy of a lap.</h2><span class="section-sub">Illustrative telemetry</span></div>'+
'<div class="lap-grid"><div class="f1-box lap-track"><svg viewBox="0 0 620 320" aria-label="Circuit"><path class="b" d="'+P+'"/><path class="l" id="lapPath" d="'+P+'"/><line id="lapGate"/><g id="lapCar" class="car r"><path d="M11 0L-8 -6.5-5 0-8 6.5Z"/></g></svg></div>'+
'<div class="f1-box lap-data"><div class="ro"><div><small>SPEED</small><b id="rS">0</b><i>km/h</i></div><div><small>GEAR</small><b id="rG">1</b></div><div><small>THROTTLE</small><b id="rT">0</b><i>%</i></div><div><small>BRAKE</small><b id="rB">0</b><i>%</i></div></div>'+
'<svg id="lapChart" viewBox="0 0 600 150" preserveAspectRatio="none"><polyline id="cSp" class="sp"/><polyline id="cTh" class="th"/><polyline id="cBr" class="br"/><line id="cCur" y1="0" y2="150"/></svg>'+
'<div class="ctl"><button type="button" id="lapPlay">Pause</button><input id="lapRange" type="range" min="0" max="1000" value="0" aria-label="Lap position"></div></div></div>'+
'<p class="f1-note">A synthetic model: speed is derived from the corner radius of the drawn track, so braking zones and throttle phases follow the shape. It shows how telemetry reads, not real car data.</p></div></section>'+

'<section><div class="wrap"><div class="section-head"><h2 class="section-title">The strategy lab.</h2><span class="section-sub">Illustrative · 57-lap race</span></div>'+
'<div class="f1-box strat"><div class="tabs" id="stTabs"></div><div class="bar" id="stBar"></div><div class="legend"><span><i class="S"></i>Soft</span><span><i class="M"></i>Medium</span><span><i class="H"></i>Hard</span></div><p id="stTxt"></p></div></div></section>'+

'<section><div class="wrap"><div class="section-head"><h2 class="section-title">A weekend through a data lens.</h2><span class="section-sub">What I look at, session by session</span></div>'+
'<div class="wk"><div class="f1-box"><small>FRIDAY</small><h3>Practice</h3><p>Baselines, long-run tyre data and car balance. The most honest numbers of the weekend.</p></div>'+
'<div class="f1-box"><small>SATURDAY</small><h3>Qualifying</h3><p>One-lap pace, sector deltas and track evolution, all compressed into a few minutes.</p></div>'+
'<div class="f1-box"><small>SUNDAY</small><h3>Race</h3><p>Degradation, pit windows, undercut and overcut. Strategy as a live optimisation problem.</p></div>'+
'<div class="f1-box"><small>MONDAY</small><h3>Debrief</h3><p>What the model predicted, what actually happened, and why the gap exists.</p></div></div></div></section>';
anchor.insertAdjacentHTML('beforebegin',html);

/* ---------- Lap model (same engine as the hero) ---------- */
var path=$('#lapPath'),M=F1Model(path,9000),N=M.N,sp=M.sp,th=M.th,br=M.br,gr=M.gr;
function poly(a,max){return a.map(function(v,k){return (k/N*600).toFixed(1)+','+(146-v/max*136).toFixed(1)}).join(' ')}
$('#cSp').setAttribute('points',poly(sp,330));$('#cTh').setAttribute('points',poly(th,100));$('#cBr').setAttribute('points',poly(br,100));
var p0=path.getPointAtLength(0),q0=path.getPointAtLength(4),gx=-(q0.y-p0.y),gy=q0.x-p0.x,gl=Math.hypot(gx,gy)||1,gt=$('#lapGate');
gt.setAttribute('x1',p0.x-gx/gl*15);gt.setAttribute('y1',p0.y-gy/gl*15);gt.setAttribute('x2',p0.x+gx/gl*15);gt.setAttribute('y2',p0.y+gy/gl*15);
var rng=$('#lapRange'),car=$('#lapCar'),btn=$('#lapPlay'),playing=!RM,u=0,last=null,vis=!('IntersectionObserver' in window),seen=false;
function show(f){F1Place(path,M.L,car,f);var k=Math.min(N-1,Math.floor(f*N));
  $('#rS').textContent=Math.round(sp[k]);$('#rG').textContent=gr[k];$('#rT').textContent=Math.round(th[k]);$('#rB').textContent=Math.round(br[k]);
  var cx=f*600;$('#cCur').setAttribute('x1',cx);$('#cCur').setAttribute('x2',cx);rng.value=Math.round(f*1000)}
(function tick(t){if(playing&&vis&&last!=null){u=(u+(t-last)/M.lapMs)%1;show(M.fOfU(u))}last=t;requestAnimationFrame(tick)})(performance.now());
rng.addEventListener('input',function(){playing=false;btn.textContent='Play';var f=rng.value/1000;u=M.uOfF(f);show(f)});
btn.addEventListener('click',function(){playing=!playing;btn.textContent=playing?'Pause':'Play'});
btn.textContent=playing?'Pause':'Play';show(0);
if(!vis)new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis&&!seen){seen=true;u=0;show(0)}},{threshold:.35}).observe($('.lap-grid'));

/* ---------- Strategy lab ---------- */
var T=57,ST=[
 {n:'One-stop',s:[['M',22],['H',35]],t:'One pit stop on lap 22. Track position is protected, but the hard tyre has to survive 35 laps. Tyre life is the constraint.'},
 {n:'Two-stop',s:[['M',18],['H',22],['M',17]],t:'Two stops buy fresher tyres and faster laps, but each pit stop costs roughly 20 seconds in the pit lane (it varies by circuit). The pace has to repay that loss.'},
 {n:'Early undercut',s:[['S',12],['H',26],['M',19]],t:'Stopping early to jump a rival on fresh rubber. It only works if the out-lap is quick and you rejoin in clean air.'}];
var tabs=$('#stTabs'),bar=$('#stBar'),txt=$('#stTxt');
ST.forEach(function(x,k){var b=D.createElement('button');b.type='button';b.textContent=x.n;b.onclick=function(){sel(k)};tabs.appendChild(b)});
function sel(k){var x=ST[k],ls=0;[].forEach.call(tabs.children,function(b,i){b.classList.toggle('on',i===k)});
  bar.innerHTML=x.s.map(function(s,i){ls+=s[1];return '<div class="st '+s[0]+'" style="flex:'+s[1]+';--i:'+i+'"><span>'+s[1]+' laps</span>'+(i<x.s.length-1?'<em>PIT · L'+ls+'</em>':'')+'</div>'}).join('')+'<u class="mk"></u>';
  txt.textContent=x.t}
sel(0);
function cnt(el,a,b,ms,dl){if(RM){el.textContent=b;return}el.textContent=a;setTimeout(function(){var t0=performance.now();(function s(t){var p=Math.min(1,(t-t0)/ms);el.textContent=Math.round(a+(b-a)*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(s)})(t0)},dl)}
var sb=D.querySelectorAll('.f1-stats b');if(sb.length==3){cnt(sb[0],0,7,1400,600);cnt(sb[1],7,8,450,2600);cnt(sb[2],0,44,1600,600);if(!RM)setTimeout(function(){sb[1].classList.add('pop')},2600)}
var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.25}):null;
D.querySelectorAll('.f1-car-card,.f1-year,.wk,.strat').forEach(function(e){io?io.observe(e):e.classList.add('in')});
})();
