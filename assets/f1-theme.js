(function(){
var D=document;D.body.classList.add('f1-page');
var h=D.querySelector('.page-header .wrap');if(!h)return;
var p='M70 200 C70 130 150 110 210 140 S300 215 360 160 S410 60 490 78 S555 170 500 222 S380 262 300 244 S120 275 70 200Z';
h.insertAdjacentHTML('beforeend','<svg class="f1-circuit" viewBox="0 0 620 320" aria-hidden="true"><path class="base" d="'+p+'"/><path class="line" id="trk" d="'+p+'"/><path class="trail" d="'+p+'"/><line class="sf" x1="64" y1="188" x2="76" y2="212"/><text x="86" y="236">START / FINISH</text></svg>');
})();
