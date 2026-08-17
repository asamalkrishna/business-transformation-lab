
(function(){
  "use strict";
  function initAutomation(){
    var nodes=document.querySelectorAll(".pipeline-node");
    var progress=document.querySelector(".pipeline-progress span");
    if(!nodes.length) return;

    function update(){
      var vh=window.innerHeight||document.documentElement.clientHeight;
      var active=0;
      nodes.forEach(function(node,i){
        var r=node.getBoundingClientRect();
        if(r.top < vh*.68 && r.bottom > vh*.22){ node.classList.add("is-active"); active=i+1; }
        else if(r.top > vh*.72){ node.classList.remove("is-active"); }
      });
      if(progress){
        var section=document.querySelector(".automation-pipeline").getBoundingClientRect();
        var p=Math.min(1,Math.max(0,(vh*.62-section.top)/(section.height-vh*.18)));
        progress.style.height=(p*100)+"%";
      }
    }
    window.addEventListener("scroll",update,{passive:true});
    window.addEventListener("resize",update);
    update();
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",initAutomation);
  else initAutomation();
})();
