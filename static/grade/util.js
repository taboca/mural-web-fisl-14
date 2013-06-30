var util_roomNameReplacer = new Array(); 
util_roomNameReplacer[8]='40T';
util_roomNameReplacer[1]='41A';
util_roomNameReplacer[2]='41B';
util_roomNameReplacer[3]='41C';
util_roomNameReplacer[4]='41D';
util_roomNameReplacer[5]='41E';
util_roomNameReplacer[6]='41F';
util_roomNameReplacer[7]='40A';
util_roomNameReplacer[716]='P09';
util_roomNameReplacer[11]='P11';
util_roomNameReplacer[701]='701';
util_roomNameReplacer[702]='702';
util_roomNameReplacer[715]='710';
util_roomNameReplacer[723]='713';
util_roomNameReplacer[714]='714';
util_roomNameReplacer[722]='715';
util_roomNameReplacer[717]='F12';
util_roomNameReplacer[718]='F13';

var util_columnOrderReference = new Array();
util_columnOrderReference[0]='40T';
util_columnOrderReference[1]='41A';
util_columnOrderReference[2]='41B';
util_columnOrderReference[3]='41C';
util_columnOrderReference[4]='41D';
util_columnOrderReference[5]='41E';
util_columnOrderReference[6]='41F';
util_columnOrderReference[7]='40A';
util_columnOrderReference[8]='P09';
util_columnOrderReference[9]='P11';
util_columnOrderReference[10]='701';
util_columnOrderReference[11]='702';
util_columnOrderReference[12]='710';
util_columnOrderReference[13]='713';
util_columnOrderReference[14]='714';
util_columnOrderReference[15]='715';
util_columnOrderReference[16]='F12';
util_columnOrderReference[17]='F13';


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



