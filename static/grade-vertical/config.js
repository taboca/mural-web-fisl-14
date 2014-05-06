
var s = new DOMParser();
 s.parseFromString("<div></div>","text/html");
 var i=0; 
 while(i<100) { 
    s.appendChild('p');
i++;
 }

 ss = s.innerHTML(); 
 postMessage(ss);s