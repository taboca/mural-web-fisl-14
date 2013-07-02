
// returns unicode characters so we have a lot of possible table values

var charToElement = new Array();
var gridCharUsed=32000;

function mapCell(storeElement) { 
  var proposalUTFChar = getUnicodeCharacter(gridCharUsed++);
  charToElement[proposalUTFChar]=storeElement;
  return proposalUTFChar;
} 

var app = {

  evento: null, 
  chunkHourSpace:60,
  ratioForHeight:1.5,
  descricao : new Array(),
  gridCols: 0, 
  gridBuffer: null, 
  local : new Array(),

  fixScaleHeight : function (dd) {  
	return parseInt(dd*this.ratioForHeight);
  },

  start : function (queryDays) {
    document.getElementById('container').innerHTML='';
    for(var k in queryDays) { 
        //var ddate = new Date();
        //dday = ddate.getDate();
        dday = queryDays[k];
        var currentDay = this.evento[dday];
        if(parseInt(dday)>=(new Date()).getDate()) {
          if(currentDay) { 
			// gridFill for day will take things like 
			// event A = 8am - 10am, room a
			// event B = 9am - 11am, room b
			// event C = 10am - 12pm, room c 
			this.gridFillForDay(currentDay);
			// into a specification for the grid type 
			// str to divs inline API 
			// which wants something like this 
			// 8am:  a,_,_
			// 9am:  a,b,_
			// 10am: _,b,c
			// 11am: _,_,c
			// 12pm: _,_,_ 

			// So, before we actually generate the divs we 	
			// can cut based in a given interest area. For 
			// example, if current Time = 9:50am, we do not 
			// have to show 8-9am line one. 

            var dateTodayNow = new Date();
            var thresholdHour = dateTodayNow.getHours()*60+dateTodayNow.getMinutes()-60;
            var thresholdHourNow = dateTodayNow.getHours()*60+dateTodayNow.getMinutes();
            if(dateTodayNow.getDate()==dday) { 
                this.bufferStrip(thresholdHour, thresholdHourNow);
			} else { 
                var preHeaderElement= document.createElement("div");
                preHeaderElement.setAttribute("class","dayStamp");	
                preHeaderElement.innerHTML="<div style='clear:both'></div><h2>"+dday+" de "+( dateUtil.getPtBrMonth());
                document.getElementById('container').appendChild(preHeaderElement);
            }  
			// generateDivs are to use gridBuffer, cols 
			// and the inner util function gridtype to make
 			// 4,abcd format into DIVs inline 
			this.generateDivs();
          }
        }	
    } 
  }, 
 
  bufferStrip: function (dateTimeThresholdToCut, dateTimeNow) { 

	// Example, if cols = 3 we have in fact lines of 4 chars because 
	// the prior algorithm adds a first column for the sake of hours 
	// reference. 

    var i=0,j=0;
	var cutChars = false;
	var buffer2 = '';
	var collectBuffer = '';
	var one= true;
	var time_start=0; var time_end=0;
 
      for(var k = 0; k<this.gridBuffer.length; k++) { 
	
		var electChar = this.gridBuffer[k]; 
        charToElement[electChar].flagToday = true;

		if(i>0) { // we think for lines not the header.. 
			if(j==0) { 
				var currEl = charToElement[this.gridBuffer[k]];
				var currBegin = currEl.begin; // example 840 mins 
				// dateTimeThresholdToCut = 360 min  = 6AM 

				if(currBegin<dateTimeThresholdToCut) { 
					cutChars=true;	
					time_start = parseInt(charToElement[this.gridBuffer[k]].begin);
					time_end = parseInt(charToElement[this.gridBuffer[k]].end);
				} else { 

                    // If this has collected priorly..
					if(one==true && collectBuffer!='') { 
						one=false;
						var from = collectBuffer.length-this.gridCols-1;
						collectBuffer = collectBuffer.substring(from,collectBuffer.length);
						for(var cB=0;cB<collectBuffer.length;cB++) { 
					       	charToElement[collectBuffer[cB]].flag=true;
						} 
						buffer2+=collectBuffer;
					} 		
				}  
			}
            if(cutChars) { 
                if(j>0) { 
                    var el = charToElement[this.gridBuffer[k]]; 
                    if(el.type=='event') { 
                        var original = el.begin;
                        var dT = parseInt(time_end)-parseInt(time_start);
                        charToElement[this.gridBuffer[k]].begin=parseInt(original)+dT;
                    } 
                } 
                if(j==this.gridCols) { 
                    cutChars=false;
                } 
                collectBuffer+=this.gridBuffer[k];
                electChar='';
            }  
        } 
		
		buffer2+=electChar;
		j++;
		if(j>this.gridCols) { i++; j=0; } 	
      }  
	this.gridBuffer=buffer2;	

  },

  gridFillForDay: function (currentDay) { 

		var innerAll = "";
		// warning ( inverted ) 
		var eventBegins = new Array();
		var eventEnds = new Array();
		var listHourKeys = new Array();

		for(var k=currentDay.length-1;k>=0;k--) { 
			var eventItem = currentDay[k];
			var plainHour = strToMins(eventItem.inicio);
			if(!eventBegins[plainHour]) { 
				eventBegins[plainHour] = new Array();
			} 
			eventBegins[plainHour].push(eventItem);
			listHourKeys.push(plainHour);

		 	var plainHour = strToMins(eventItem.fim);
			if(!eventEnds[plainHour]) { 
				eventEnds[plainHour] = new Array();
			} 
			eventEnds[plainHour].push(eventItem);
			listHourKeys.push(plainHour);
		}

		// We sort 
		var hoursKeys = eventsBySortedHours(listHourKeys);
		var hourSlices = new Array();
		for(var k in hoursKeys) { 
			var hourToCheck =  listHourKeys[hoursKeys[k]];
			if(!hourSlices[hourToCheck]) { 
				hourSlices[hourToCheck]=true;
			} 
		} 

		// We count, collect the columns
		var updateColumns = new Array();
            		var slicesSequence = new Array();
		var slicesCount=0;
		for(var hour in hourSlices ) { 
			slicesSequence[slicesCount++]=hour; // this is for later use, we simply counting 
			for( var i in eventBegins[hour] ) { 
				  var item = eventBegins[hour][i];
				  item.cellMap=mapCell({'type':'event','value':item , 'begin': strToMins(item.inicio),'end': strToMins(item.fim), flag:false, flagToday:false});
				  if(!updateColumns[util_roomNameReplacer[item.local]]) { 
					updateColumns[util_roomNameReplacer[item.local]]=new Array();
				  } 
				  updateColumns[util_roomNameReplacer[item.local]].push(item);
			} 
		} 
		var cols = 0;
		for(var k in updateColumns) { cols++; } 

		var buffer = '';
		var hourIndex=0, roomIndex=0;
		var openElements = new Array();
		var dumpHeader=false;
		var dumpHours=0;

		for(var hour in hourSlices ) { 
			
            if(hourIndex==0&&!dumpHeader) { 
                dumpHeader = true; 
                buffer=mapCell({'type':'corner'});
                //for( var e in updateColumns ) { 
                for( var eee=0;eee<util_columnOrderReference.length;eee++ ) { 
                    var e = util_columnOrderReference[eee];
                    var roomChar = mapCell({'type':'header', 'value': e});
                    buffer+=roomChar;
                } 
            } 
            var columnCount=0;
            //for( var e in updateColumns ) { 
            for( var eee=0;eee<util_columnOrderReference.length;eee++ ) { 
                var e = util_columnOrderReference[eee];
    			if(columnCount==0) { 
                     var e2=null;
                     if(typeof slicesSequence[hourIndex+1] != 'undefined') { 
                        e2=slicesSequence[hourIndex+1];
                     } else { 
                        e2=parseInt(slicesSequence[hourIndex])+30;
                     } 
                     var delta = parseInt(e2-slicesSequence[hourIndex]);
                     var roomChar = mapCell({'type':'slices', 'value': hour, 'height': delta , 'begin':slicesSequence[hourIndex], 'end':e2, 'flag':false});
                     buffer+=roomChar;
    		    } 
    			var items = updateColumns[e];
    			var keyChar='';
    			for( var kk in items) { 
    				var item = items[kk];
    				if(strToMins(item.inicio)==parseInt(hour)) { 
    					keyChar = item.cellMap;  
    					openElements[e]=item;
    				} 
    			} 
    			if(keyChar=='') { 
    				if(openElements[e]) { 	
    					if(strToMins(openElements[e].fim)>parseInt(hour)) { 
    						keyChar = openElements[e].cellMap;
    					} else { 
    						// we may consider killing open elements
    					} 
    				} 
    			} 
    			if(keyChar=='') { 
    				var hEnd = slicesSequence[hourIndex+1];
    				var hBegin = slicesSequence[hourIndex];
    				var delta = parseInt(hEnd-hBegin);
    				keyChar = mapCell({'type':'none', 'value': delta, 'begin':slicesSequence[hourIndex], 'end':slicesSequence[hourIndex+1]}); 
    			} 
    			buffer+=keyChar;
    			roomIndex++;
    			columnCount++;
            } // columns = rooms  
            hourIndex++;

		}  // hours = slices 
		this.gridBuffer=buffer;
		this.gridCols=cols;
	}, 

  generateDivs: function () { 

        var buffer = this.gridBuffer; 
        var cols   = this.gridCols;
        var container=document.createElement('div');
        var cName = 'container_'+Math.random();
		container.setAttribute('id', cName);
		document.getElementById('container').appendChild(container);
		cssWidth = parseInt(parseInt(document.getElementById(cName).offsetWidth-50)/cols);
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
                    $(this).html('<div class="innerInnerCell">'+doFilter(el.descricao)+'</div>');
                    $(this).addClass('inner');
                    var delta = probeElement.end-probeElement.begin;

                    var addStyle='';
                    if(probeElement.flag) { 
                        delta=delta+these.chunkHourSpace;
                        addStyle+='background:rgb(250,190,00);color:black';
                        //marcio
                    } 
                    var dateTodayNow = new Date();
                    var thresholdHourNow = dateTodayNow.getHours()*60+dateTodayNow.getMinutes();
                    if(probeElement.flagToday) {
                       if(probeElement.begin<thresholdHourNow) { 
                           addStyle='background:rgb(250,190,0);color:black ! important;';
                        }
                        if(probeElement.end<thresholdHourNow) { 
                           addStyle='background:rgb(150,60,0)';
                        } 
                    }

                    if(el.descricao.indexOf('mudou')>-1) { 
                        addStyle='background:red ! important';
                    } 
 
                    //if(delta==0) { delta=200 } 
                    $(this).attr("style",';width:'+cssWidth+'px;height:'+these.fixScaleHeight(delta)+'px;');
                    $(this).find('div').attr("style",addStyle);
                } 

                if(probeElement.type == 'none') { 
                    var delta = probeElement.value;
                    if(probeElement.flag) { 
                        delta=these.chunkHourSpace;
                    } 
                    $(this).addClass('innerNone');
                    $(this).attr("style",'width:'+cssWidth+'px;height:'+these.fixScaleHeight(delta)+'px;');
                    $(this).html('');
                } 

                if(probeElement.type == 'slices') { 
                    var hour = probeElement.value;
                    var delta = probeElement.height;
                    if(!delta) { delta=these.chunkHourSpace; } 
                    $(this).addClass('innerHour');
                    var localWidth='50px';
                    var hourSliceId = 'hourSlice_'+Math.random(); 
                    var strHH = ''+Math.floor(parseInt(hour)/60);
                    var strMM = ''+parseInt(hour)%60; 
                    if(strMM<10) { strMM+='0'; } 
                    var strProposal = strHH+':'+strMM;

                    if(probeElement.flag) { 
                        strProposal='';
                        delta=these.chunkHourSpace;
                    }	
                    $(this).attr("style",'width:'+localWidth+';height:'+these.fixScaleHeight(delta)+'px;');
                    $(this).html('<div id="'+hourSliceId+'" class="innerInnerHour" style="display:inline-block;padding:0px"><div>'+strProposal+'</div></div>');
                    // This -20 is due to the padding and the 4 is for borders? 
                    var elWidth = document.getElementById(hourSliceId).offsetWidth; 
                } 

                if(probeElement.type == 'header') { 
                    var room = probeElement.value;
                    $(this).addClass('innerHeader');
                    $(this).attr("style",'width:'+cssWidth+'px;');
                    $(this).html('<div class="innerInnerHeader">'+room+'</div>');
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


