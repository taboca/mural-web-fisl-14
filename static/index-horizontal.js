$(document).ready(function() {
  register("/main/topheader", "topo", "./header/index.html", iframeTemplate);
  register("/main/flyershow", "flyer", "./grade/index.html", iframeTemplate);
  //register("/main/flyershow", "flyer", "./flyer/index.html", iframeTemplate);
  register("/main/thumbs", "thumbs", "./thumbs/index.html", iframeTemplate);
  compile();   
});

function animate() { 
  tv.add($('#animation li'));
  tv.play(document.getElementById('meio').contentDocument);
  setTimeout("animate()",TEMPO_REFRESH);
} 


