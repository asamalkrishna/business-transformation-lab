(function(){
var D=document,$=function(s,r){return (r||D).querySelector(s)};
var q=$('.life-quote');if(!q)return;var anchor=q.closest('section');
/* hero stat strip */
var lede=$('.page-lede');
if(lede)lede.insertAdjacentHTML('afterend','<div class="f1-stats"><div><b>7</b><span>Official titles</span></div><div><b>8</b><span>My scorecard</span></div><div><b>44</b><span>The number</span></div></div>');

var P='M70 200 C70 130 150 110 210 140 S300 215 360 160 S410 60 490 78 S555 170 500 222 S380 262 300 244 S120 275 70 200Z';
var html=
'<section><div class="wrap"><div class="section-head"><h2 class="section-title">Anatomy of a lap.</h2><span class="section-sub">Illustrative telemetry</span></div>'+
'<div class="lap-grid"><div class="f1-box lap-track"><svg viewBox="0 0 620 320" aria-label="Circuit"><path class="b" d="'+P+'"/><path class="l" id="lapPath" d="'+P+'"/><circle id="lapDot" r="7" cx="70" cy="200"/></svg></div>'+
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

/* ---------- Lap model ---------- */
var path=$('#lapPath'),L=path.getTotalLength(),N=260,pts=[],ang=[],cv=[],sp=[],th=[],br=[],gr=[],i,j;
function sm(a,k){return a.map(function(_,x){var s=0,c=0;for(var d=-k;d<=k;d++){var y=(x+d+N)%N;s+=a[y];c++}return s/c})}
for(i=0;i<N;i++){var s=L*i/N,p=path.getPointAtLength(s),a=path.getPointAtLength((s+3)%L),b=path.getPointAtLength((s-3+L)%L);pts.push(p);ang.push(Math.atan2(a.y-b.y,a.x-b.x))}
for(i=0;i<N;i++){var d=ang[(i+1)%N]-ang[i];while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;cv.push(Math.abs(d))}
cv=sm(cv,5);var mx=Math.max.apply(null,cv);
sp=sm(cv.map(function(c){return 305-235*Math.pow(c/mx,.55)}),4);
for(i=0;i<N;i++){var dv=sp[(i+1)%N]-sp[i];th.push(dv>-.35?100:Math.max(0,100+dv*55));br.push(dv<-.9?Math.min(100,-dv*28):0);gr.push(Math.max(2,Math.min(8,Math.round(sp[i]/40))))}
th=sm(sm(th,6),4);br=sm(sm(br,5),3);
function poly(a,max){return a.map(function(v,k){return (k/(N-1)*600).toFixed(1)+','+(146-v/max*136).toFixed(1)}).join(' ')}
$('#cSp').setAttribute('points',poly(sp,320));$('#cTh').setAttribute('points',poly(th,100));$('#cBr').setAttribute('points',poly(br,100));
var rng=$('#lapRange'),dot=$('#lapDot'),playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,pos=0,btn=$('#lapPlay');
function show(f){var k=Math.min(N-1,Math.floor(f*N)),p=pts[k];dot.setAttribute('cx',p.x);dot.setAttribute('cy',p.y);
  $('#rS').textContent=Math.round(sp[k]);$('#rG').textContent=gr[k];$('#rT').textContent=Math.round(th[k]);$('#rB').textContent=Math.round(br[k]);
  var cx=f*600;$('#cCur').setAttribute('x1',cx);$('#cCur').setAttribute('x2',cx);rng.value=Math.round(f*1000)}
var last=0;(function tick(t){if(playing){pos=(pos+(t-last)/9000)%1;show(pos)}last=t;requestAnimationFrame(tick)})(0);
rng.addEventListener('input',function(){playing=false;btn.textContent='Play';pos=rng.value/1000;show(pos)});
btn.addEventListener('click',function(){playing=!playing;btn.textContent=playing?'Pause':'Play'});
btn.textContent=playing?'Pause':'Play';show(0);

/* ---------- Strategy lab ---------- */
var T=57,ST=[
 {n:'One-stop',s:[['M',22],['H',35]],t:'One pit stop on lap 22. Track position is protected, but the hard tyre has to survive 35 laps. Tyre life is the constraint.'},
 {n:'Two-stop',s:[['M',18],['H',22],['M',17]],t:'Two stops buy fresher tyres and faster laps, but each pit stop costs roughly 20 seconds in the pit lane (it varies by circuit). The pace has to repay that loss.'},
 {n:'Early undercut',s:[['S',12],['H',26],['M',19]],t:'Stopping early to jump a rival on fresh rubber. It only works if the out-lap is quick and you rejoin in clean air.'}];
var tabs=$('#stTabs'),bar=$('#stBar'),txt=$('#stTxt');
ST.forEach(function(x,k){var b=D.createElement('button');b.type='button';b.textContent=x.n;b.onclick=function(){sel(k)};tabs.appendChild(b)});
function sel(k){var x=ST[k],ls=0;[].forEach.call(tabs.children,function(b,i){b.classList.toggle('on',i===k)});
  bar.innerHTML=x.s.map(function(s,i){ls+=s[1];return '<div class="st '+s[0]+'" style="flex:'+s[1]+'"><span>'+s[1]+' laps</span>'+(i<x.s.length-1?'<em>PIT · L'+ls+'</em>':'')+'</div>'}).join('');
  txt.textContent=x.t}
sel(0);
if(window.ocFloat)window.ocFloat(anchor.parentElement);
})();
