    var gridMaker = {

  evento: null, 
  chunkHourSpace:60,
  ratioForHeight:1.6,
  ratioForWidth:2.2,
  descricao : new Array(),
  gridCols: 0, 
  gridBuffer: null, 
  rawBuffer: null, 
  local : new Array(),
  flipMode : true,

  fixScaleHeight : function (dd) {  
  return parseInt(dd*this.ratioForHeight);
  },

  fixScaleWidth : function (dd) {  
  return parseInt(dd*this.ratioForWidth);
  },

  makeContainer: function () {


  },


  start : function (slots, rooms, currentDay) {

        var eventsByHours = [];
        var eventsByColumn = [];
        var hours = [];
        var columns = [];

        for(var key in slots) {

          var item = slots[key];
          if(item.date == currentDay ) {
             var fullDate = item.date.split('-'); 
             var da = parseFloat(fullDate[2]);
             var mo = parseFloat(fullDate[1]);
             var ye = parseFloat(fullDate[0]);        
             var ho = parseFloat(item.hour);
             var mi = parseFloat(item.minute);
             var c20 = parseFloat(item.colspan)*20;

             var aDate = new Date(parseInt(ye),parseInt(mo)-1,parseInt(da));
             aDate.setHours(ho);
             aDate.setMinutes(mi);
             item.getTimeBegin=aDate.getTime();
             var bDate = new Date(aDate.getTime() + c20*60000);
             item.getTimeEnd =bDate.getTime();

/*
             var processEvent=true;  
             var cropNow = true;

             if(cropNow) { 
               var dateTodayNow = new Date();
               var pastOne = dateTodayNow.getTime()-(1000*60*60); // go back one hour
               var justNow = dateTodayNow.getTime();
         
               if(item.getTimeEnd<pastOne) {
                    processEvent=false;
               } else { 
                   if(item.getTimeBegin<=pastOne) {
                        flagPastHour = item.getTimeBegin; 
                        item.getTimeBegin=pastOne;
                        item.flag=true; // so we can inflate the delta height 
                   }
               }
             }
*/

//             if(processEvent) {

                 var key=""+item.getTimeBegin;
                 if(!eventsByHours[key]) {
                    eventsByHours[key] = [];
                    hours.push(key);
                 }
                 eventsByHours[key].push(item);
                 hours.push(key);
     
                 var key=""+item.getTimeEnd;
                 if(!eventsByHours[key]) {
                   eventsByHours[key] = [];
                   hours.push(key);
                 }
                 eventsByHours[key].push(item);

                 var roomKey = ""+item.room;
                 if(!eventsByColumn[roomKey]) {
                   eventsByColumn[roomKey]=[];
                   columns.push(roomKey);
                 }

                 eventsByColumn[roomKey].push(item);

                 item.type ='event';
                 item.descricao = item.title;
                 var begin  = parseInt(item.getTimeBegin)/60000;
                 var end  = parseInt(item.getTimeEnd)/60000;

                 item.cellMap=mapCell({type:'event', value:item, 'begin':begin, 'end':end });
   //           } 

           }
        };

        //console.log(JSON.stringify(hours));
        hours.sort();
        columns.sort();


        var hoursByIndex=[];
        var hC=0;
        var compressHours = [];
        var oldHour = -1;
        for (var h in hours) {
          var curr = hours[h];
          if(oldHour!=curr) {
             oldHour = curr;
             hoursByIndex[curr]=hC;
             compressHours[hC]=curr; 
             hC++;
          }
        }

        var roomByPos = [];
        var listPosKeys = []; 
        for(key in rooms) {
             var currRoom = rooms[key];
             roomByPos[currRoom.position]=currRoom;
             listPosKeys.push(parseInt(currRoom.position));
        }

        listPosKeys.sort(function sortFunc(a,b) { return a-b; } );

        var linear =0;

        for(key in listPosKeys) {
            var currRoom= roomByPos[listPosKeys[key]];
            util_columnOrderReference[currRoom.id]=key;
            util_roomNameReplacer[currRoom.id]=currRoom.name;
        }

        var columnsByIndex=[];
        var hC=0;
        var compressColumns = [];
        var old = -1;
        for (var h in columns) {
          var curr = columns[h];

          if(old!=curr) {
             old = curr;
//             columnsByIndex[curr]=hC;
//               columnsByIndex[curr]=util_columnOrderReference[curr];

               compressColumns[hC]=curr; 
               hC++;
          }
        }

        var buffer = [];


        for(var i in compressHours) {
            for(var j in compressColumns) {

                /* Cols = hours and Rows = Rooms */
                if(i==0 && j==0) {

                  var list = compressHours; 

                  for(var jj=0; jj<list.length+1;jj++) {
                     if(jj==0) {
                        buffer[jj]= mapCell({type: 'corner'})
                     } 
                     else {
                        var curr = list[jj-1]/60000;
                        var end = list[jj]/60000;
                        var delta = (end-curr);
                        
                        var index = jj;
                        if(this.flipMode) {
                            index= (parseInt(jj))*(compressColumns.length+1);
                        }
                        buffer[index]=mapCell({type:'slices', value:list[jj-1], endHour:list[jj], 'width':delta});
                     }
                  }

                  var list = compressColumns; 

                  for(var jj=0;jj<list.length+1;jj++) {
                        if(jj==0) {
                        } 
                        else {
                          var index = (parseInt(jj))*(compressHours.length+1); 
                          if(this.flipMode) { 
                              index=jj;
                          }

                          buffer[index]=mapCell({type:'header', value: (""+roomByPos[(""+listPosKeys[jj-1])].name)   });
                        }
                  }
                }
                var delta  = parseInt(compressHours[parseInt(i)+1]-compressHours[i])/60000;
                if(!this.flipMode) { 
                  buffer[(parseInt(i)+1)+((compressHours.length+1)*(parseInt(j)+1))]=mapCell({type:'none' , value:delta});
                } else {
                  buffer[(parseInt(j)+1)+((compressColumns.length+1)*(parseInt(i)+1))]=mapCell({type:'none', value:delta});
                }
            }
        }



        for(var key in slots) {
          var item = slots[key]; 
          if(item.date == currentDay ) {
              var indexForHours = hoursByIndex[item.getTimeBegin];
              var indexForColumn = util_columnOrderReference[item.room];
              for (k in compressHours) {
                var curr = compressHours[k];
                if (curr >= item.getTimeBegin && curr < item.getTimeEnd) {
                   if(!this.flipMode) {
                      buffer[((parseInt(indexForColumn)+1)*(compressHours.length+1))+(parseInt(k)+1)]=item.cellMap;
                   } else {

                   //   ( (parseInt(k)+1) * compressHours.length+1 ) + parseInt(indexForColumn)+1)
                      buffer[(compressColumns.length+1)*(parseInt(k)+1)+(parseInt(indexForColumn)+1)]=item.cellMap;
                   }
                }
              }
          }
        }


        this.rawBuffer = buffer;

        var dateTodayNow = new Date();
        var hourPast = dateTodayNow.getTime()-(1000*60*60); // go back one hour
        var hourNow = dateTodayNow.getTime();
        if(dateTodayNow.getDate()==parseInt(currentDay.split('-')[2])) { 
           this.bufferStrip(hourPast, hourNow, compressColumns.length+1, compressHours.length+1);
        }

        this.gridBuffer = this.rawBuffer.join("");
        var len = compressHours.length;
        if(this.flipMode) {
            len = compressColumns.length;
        } 
        this.generateDivs(len);

  }, 


  bufferStrip: function (dateTimeThresholdToCut, dateTimeNow, lenCol, lenRows) { 

  // Example, if cols = 3 we have in fact lines of 4 chars because 
  // the prior algorithm adds a first column for the sake of hours 
  // reference. 

  var i=0,j=0;
  var cutChars = false;
  var buffer2 = [];
  var collectBuffer = [];
  var one= true;
  var time_start=0; var time_end=0;
  var counter = 0;
      var processLater = false; 
          var bottomCrop = null;

  for(var row = 0; row<lenRows; row++) {

      var processRow = false; 

      for (var col = 0; col<lenCol; col++) {

          var indexInline = col+(row*lenCol);

          var electChar = this.rawBuffer[indexInline]; 


          charToElement[electChar].flagToday = true;

          var currEl = charToElement[electChar];

          if(row == 0 ) { 
              buffer2[counter++]=electChar;
          }

          if(row>0) {

              var currBegin = currEl.type; 
              if(currEl.type == 'slices') { 
                    if(currEl.value<dateTimeThresholdToCut&&currEl.endHour>dateTimeThresholdToCut&&currEl.endHour<=dateTimeNow) {
                        processRow = true; 
                        bottomCrop = currEl.endHour;
                        currEl.value = dateTimeThresholdToCut;

                        currEl.width=null;
                        buffer2[counter++]=electChar;
                        currEl.flag=true;
                  
                    }
              }

              if(processLater) {
                  buffer2[counter++]=electChar;
              } 

              if(processRow) { 
                  if(currEl.type=='none') {
                       buffer2[counter++]=electChar;
                       currEl.delta=dateTimeThresholdToCut/60000;
                       currEl.flag=true;

                  }
                  if(currEl.type=='event') {
                       if(currEl.end<parseInt(bottomCrop/60000)) {
                           currEl.begin=currEl.end;
                       }
                       else { 
                           currEl.begin=parseInt(bottomCrop/60000);
                       }
                       currEl.flag=true;
                       buffer2[counter++]=electChar;

                  } 
                  if(col==lenCol-1) {
                      processRow=false;
                      processLater = true;

                  }
              }


          }
      }
  }


  this.rawBuffer=buffer2;  

  },

  generateDivs: function (len) { 

    var buffer = this.gridBuffer; 
    var cols   = len;

    var container=document.createElement('div');
    var cName = 'container_'+Math.random();
    container.setAttribute('id', cName);
    container.setAttribute('style','height:200%;width:1400px')
    document.getElementById('container').appendChild(container);
    cssWidth = parseInt(parseInt(document.getElementById(cName).offsetWidth-50)/cols);
    cssHeight = parseInt(parseInt(document.getElementById(cName).offsetHeight-650)/cols);
    
    var uniqueClassName = 'inner'+parseInt(Math.random()*1000);
    if(buffer.length>cols+1) { 
      grid(buffer, cols+1, cName, uniqueClassName);
    } 
    var proposedHeight=0;
    var these = this;

    $('.'+uniqueClassName).each(function() { 
      var probeElement = charToElement[$(this).attr('id')];

      if(probeElement)  { 

        if(probeElement.type=='event') { 
            var el = probeElement.value;
            $(this).html('<div class="innerInnerCell" onclick="callCalendar(this)"><div class="innerInnerInnerCell">'+doFilter(el.descricao)+'</div></div>');
            $(this).addClass('inner');
            var delta = probeElement.end-probeElement.begin;

            var addStyle='';
            if(probeElement.flag) { 
                delta=delta+these.chunkHourSpace;
                addStyle+='background:rgb(0,0,170);color:white';
            } 

            var dateTodayNow = new Date();
            var thresholdHourNow = dateTodayNow.getHours()*60+dateTodayNow.getMinutes();
            if(probeElement.flagToday) {
               if(probeElement.begin<thresholdHourNow) { 
                   addStyle='background:rgb(0,0,200);color:white ! important;';
                }
                if(probeElement.end<thresholdHourNow) { 
                   addStyle='background:rgb(0,70,0);color:white';
                } 
            }

            if(!these.flipMode) {
              $(this).attr("style",';width:'+these.fixScaleWidth(delta)+'px;height:'+cssHeight+'px;');
            } else { 
              $(this).attr("style",';width:'+cssWidth+'px;height:'+these.fixScaleHeight(delta)+'px;');
            }

            $(this).find('div').attr("style",addStyle);
        } 

        if(probeElement.type == 'none') { 
 
            var delta = probeElement.value;
            if(probeElement.flag) { 
                delta=these.chunkHourSpace;
            } 
            //alert(delta);

            if(!these.flipMode) {
              $(this).attr("style",';width:'+these.fixScaleWidth(delta)+'px;height:'+cssHeight+'px;');
              $(this).addClass('innerNone');
            } else { 
              $(this).attr("style",'width:'+cssWidth+'px;height:'+these.fixScaleHeight(delta)+'px;');
              $(this).addClass('innerNoneHor');
            }


             $(this).html('');
 
        } 

        if(probeElement.type == 'slices') { 
            var hour = probeElement.value;
            var delta = probeElement.width;
            if(!delta) { delta=these.chunkHourSpace; } 

            if(!these.flipMode) {
                $(this).addClass('innerHour');
            } else { 
                $(this).addClass('innerHourHor');
            }

            var localWidth='50px';
            var localHeight='50px';
            var hourSliceId = 'hourSlice_'+Math.random(); 
            var tempDate = new Date();
            tempDate.setTime(hour);
            var strHH = ''+tempDate.getHours();
            var strMM = ''+tempDate.getMinutes(); 
            if(strMM<10) { strMM+='0'; } 
            var strProposal = strHH+':'+strMM;

            if(probeElement.flag) { 
                strProposal='';
                delta=these.chunkHourSpace;
            } 
            //$(this).attr("style",'width:'+localWidth+';height:'+these.fixScaleHeight(delta)+'px;');
            if(!these.flipMode) {
              $(this).attr("style",'width:'+these.fixScaleWidth(delta)+';height:'+localHeight+'px;');
            } else { 
              $(this).attr("style",'width:'+localWidth+';height:'+these.fixScaleHeight(delta)+'px;');
            }
            $(this).html('<div id="'+hourSliceId+'" class="innerInnerHour" style="display:inline-block;padding:0px"><div>'+strProposal+'</div></div>');
            // This -20 is due to the padding and the 4 is for borders? 
            var elWidth = document.getElementById(hourSliceId).offsetWidth; 
        } 

        if(probeElement.type == 'header') { 
            var room = probeElement.value;
            var localWidth='50px';

            $(this).addClass('innerHeader');
            if(!these.flipMode) {
                $(this).attr("style",'width:'+localWidth+'px;');
            } else { 
                $(this).attr("style",'width:'+cssWidth+'px;');
            }
            $(this).html('<div class="innerInnerHeader">'+ room+'</div>');
        } 

        if(probeElement.type == 'corner') { 
            var localWidth='50px';
            var room = probeElement.value;
            $(this).attr("style",'width:'+localWidth+';');
            $(this).html('<div class="innerInnerCorner" style="-moz-transform-orifin:0px 0px; -moz-transform:rotate(-90deg)"> </div>');
        } 

      } 
    });
  //window.parent.parent.setHeight('middle',$('getElementById('container')').height());
  },

  init : function (eventData) {
    this.evento=eventData;
  } 

} // end of grade


// returns unicode characters so we have a lot of possible table values

var charToElement = new Array();
var gridCharUsed=32000;

function mapCell(storeElement) { 
  var proposalUTFChar = getUnicodeCharacter(gridCharUsed++);
  charToElement[proposalUTFChar]=storeElement;
  return proposalUTFChar;
} 

// if you want a cloud crazy wrap spans 
// style="float:left

function doFilter(str) { 
    //return str; 
    $('#temp').html(str);
    var str = $('#temp').text();
    var fontSize = INNER_FONT_SIZE;
    var s = str.split(' ');
    htmlMarkup = '';
    var gg = 255;
    for (var i=0;i<s.length;i++) { 
        var el = s[i];
        if(gg>50) { 
           gg-=30;
        } 
        var elMark = '<span style=";color:rgb('+gg+','+gg+','+gg+');margin-right:3px;font-size:'+fontSize+'px">'+el+'</span>';
        var elMark = '<span style="color:white;padding:.1em">'+el+'</span>';
        fontSize-=1;
        htmlMarkup+=elMark;
    }
    return htmlMarkup; 
} 
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

INNER_FONT_SIZE = 16;

var util_roomNameReplacer = new Array(); 

var util_columnOrderReference = new Array();






