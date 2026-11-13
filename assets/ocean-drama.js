(function(){
var D=document,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function add(c,h){var e=D.createElement('div');e.className=c;if(h)e.innerHTML=h;D.body.appendChild(e);return e}
add('oc-caustics');add('oc-depthshade');add('oc-vignette');
var g=add('oc-gauge','<div class="oc-gauge-line"><i></i></div><div class="oc-gauge-num"><b>0</b> m<small>DEPTH</small></div>');
var mark=g.querySelector('i'),num=g.querySelector('b');
function upd(){var m=D.documentElement.scrollHeight-innerHeight,p=m>0?Math.min(1,scrollY/m):0;
  D.documentElement.style.setProperty('--depth',p.toFixed(3));mark.style.top=(p*100)+'%';num.textContent=Math.round(p*3800).toLocaleString('en-US')}
addEventListener('scroll',upd,{passive:true});upd();
/* cinematic surfacing intro, once per session */
if(!reduce&&!sessionStorage.getItem('oc-intro')){
  sessionStorage.setItem('oc-intro','1');
  var n=add('oc-intro','<div class="oc-intro-txt"><span>Amal Krishna</span><em>Dive in</em></div><div class="oc-intro-line"></div>');
  setTimeout(function(){n.classList.add('go')},1700);setTimeout(function(){n.remove()},3000);
}
})();
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  window.ocFloat=function(root){
    var n=0;(root||document).querySelectorAll('[class*="card"],.f1-belief,.f1-story,.f1-year,blockquote,.f1-box').forEach(function(el){
      if(el.closest('.site-nav,.site-footer')||el.offsetWidth>760||el.offsetHeight>640||el.parentElement.closest('.oc-fbox'))return;
      el.classList.add('oc-fbox');el.style.setProperty('--fs',(6+(n%4)*1.1).toFixed(1)+'s');el.style.setProperty('--fd',(-(n*1.3)%7).toFixed(1)+'s');n++;
    });
  };
  window.addEventListener('load',function(){setTimeout(function(){window.ocFloat()},300)});
})();
