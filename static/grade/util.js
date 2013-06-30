        var replaceRoom = new Array(); 
        replaceRoom[8]='40T';
        replaceRoom[1]='41A';
        replaceRoom[2]='41B';
        replaceRoom[3]='41C';
        replaceRoom[4]='41D';
        replaceRoom[5]='41E';
        replaceRoom[6]='41F';
        replaceRoom[7]='40A';
        replaceRoom[716]='P09';
        replaceRoom[11]='P11';
        replaceRoom[701]='701';
        replaceRoom[702]='702';
        replaceRoom[715]='710';
        replaceRoom[723]='713';
        replaceRoom[714]='714';
        replaceRoom[722]='715';
        replaceRoom[717]='F12';
        replaceRoom[718]='F13';

        var orderList = new Array();
        orderList[0]='40T';
        orderList[1]='41A';
        orderList[2]='41B';
        orderList[3]='41C';
        orderList[4]='41D';
        orderList[5]='41E';
        orderList[6]='41F';
        orderList[7]='40A';
        orderList[8]='P09';
        orderList[9]='P11';
        orderList[10]='701';
        orderList[11]='702';
        orderList[12]='710';
        orderList[13]='713';
        orderList[14]='714';
        orderList[15]='715';
        orderList[16]='F12';
        orderList[17]='F13';



/* http://tools.ietf.org/html/rfc5545 
   This will go up to the minutes */

function durationToMinutes(strDuration) { 
  	// example P15DT5H0M20S 
	var countMin = 0;
	if(strDuration.indexOf('P') > -1 ) { 
 		strDuration=strDuration.split('P')[1];
		if(strDuration.indexOf('D') > -1 ) { 
			var splitter = strDuration.split('D');
			strDuration=splitter[1];
			countMin += parseInt(splitter[0])*60*24;
		} 
		if(strDuration.indexOf('T') > -1) { 
			strDuration=strDuration.split('T')[1];
			if(strDuration.indexOf('H') > -1 ) {
				var splitter=strDuration.split('H');
				strDuration=splitter[1];
				countMin += parseInt(splitter[0])*60;
			}
			if(strDuration.indexOf('M') > -1 ) {
				var splitter=strDuration.split('M');
				strDuration=splitter[1];
				countMin += parseInt(splitter[0]);
			}
		} 
	} 
	return countMin;
} 

function eventsBySortedHours(values) {
   var array_with_keys = [];
   for (var i = 0; i < values.length; i++) {
     array_with_keys.push({ key: i, value: values[i] });
   }
   array_with_keys.sort(function(a, b) {
    if (parseInt(a.value) < parseInt(b.value)) { return -1; }
    if (parseInt(a.value) > parseInt(b.value)) { return  1; }
    return 0;
   });
   var keys = [];
   for (var i = 0; i < array_with_keys.length; i++) {
     keys.push(array_with_keys[i].key);
   }
   return keys;
}

function getUnicodeCharacter(cp) {
    if (cp >= 0 && cp <= 0xD7FF || cp >= 0xE000 && cp <= 0xFFFF) {
      return String.fromCharCode(cp);
    } else if (cp >= 0x10000 && cp <= 0x10FFFF) {
      cp -= 0x10000;
      var first = ((0xffc00 & cp) >> 10) + 0xD800
      var second = (0x3ff & cp) + 0xDC00;
      return String.fromCharCode(first) + String.fromCharCode(second);
    }
}

function strToMins(item) { 
  var currHour  = item.split(':'); 
  return parseInt(currHour[0])*60+parseInt(currHour[1]);
} 

var dateUtil =  {
 mos: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  getPtBrMonth: function () { 
    var ddd = new Date();
    return this.mos[ddd.getMonth()];
  }
}



