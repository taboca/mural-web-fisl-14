var transport =  {
 	timer_init  : 1000,
	timer_loop  : 45000, 
    feed        : null,
    feedURL     : '',
	dataOut     : null, 
	callback    : null, 
	setUrl: function (url) { 
		this.feedURL = url; 
	},
	start: function (callback) { 
		var self = this;
		this.callback = callback;
               	setTimeout( function () { self.asyncCallData() }, this.timer_init);
	},
	callAgain : function () { 
		var self = this;
               	setTimeout( function () { self.asyncCallData() }, this.timer_loop);
	},
	init : function() {
		this.feed = new t8l.feeds.Feed(this.feedURL);
		this.feed.setResultFormat('text'); // differs from google now
		this.feed.setNumEntries(100);
	},

	asyncCallData: function() {
		var self = this;
		this.feed.load( function (e) { self.__feedUpdated(e) } );
	},

	__feedUpdated : function(result) {
		var self  = this;
		this.dataOut = new Array();
		if(result.error) { }; 
		var text = result.xmlDocument; 
		var objs = $.parseJSON(text);
		for( var k in objs[0].slot) {
			var fullDate = objs[0].slot[k].date.split('-'); 
			var da = parseFloat(fullDate[2]);
			var mo = parseFloat(fullDate[1]);
			var ye = parseFloat(fullDate[0]);

			var eda = parseFloat(fullDate[2]);
			var emo = parseFloat(fullDate[1]);
			var eye = parseFloat(fullDate[0]);

			var ho = parseFloat(objs[0].slot[k].hour);
			var mi = parseFloat(objs[0].slot[k].minute);
            var c20 = parseFloat(objs[0].slot[k].colspan)*20;

            var aDate = new Date();
            aDate.setHours(ho);
            aDate.setMinutes(mi);
            var bDate = new Date(aDate.getTime() + c20*60000);

			var eho = bDate.getHours();
			var emi = bDate.getMinutes();

			var local = objs[0].slot[k].room;
			var sum = objs[0].slot[k].title;
			var user = '';
			var para = '';
			if(!sum) { 
				sum='';
			} 
 			//alert(ye + ' ' + mo + ' ' + da + ' ' + ho + ' ' + mi + ' '+'<div class="title">' + sum + '</div><div class="item"><span class="mark">Reservado para: </span>'+para+'</div>'+eye + ' ' + emo + ' ' + eda + ' ' + eho + ' ' + emi + ' ' );
 			this.addEvento(ye,mo,da,ho,mi,'<div class="title">' + sum + '</div><div class="item"><span class="mark"></span>'+para+'</div>',eye,emo,eda,eho,emi, local);
		} 
		this.callback(this.dataOut);
		this.callAgain();
	}
	, 
	addEvento: function (ye,mo,da,ho,mi,sub, eye,emo,eda,eho,emi, local) { 
        var daStr = da+'';
        if(!this.dataOut[daStr]) { 
            this.dataOut[daStr]=new Array();
        } 
        try { 
        	ho-=0;
            if(ho<0) { 
                ho=24+ho;
                var newD=parseInt(daStr-1);
                daStr=newD;
            } 
            eho-=0;
            if(eho<0) { 
            	eho=24+eho;
            } 
            this.dataOut[daStr].push( { 'inicio': ho+":"+mi, 'fim': eho+':'+emi, 'descricao': sub, 'sigla': "- ",'local': local,'apresentador': ""});

        } catch (i) { } 
    } 
}

