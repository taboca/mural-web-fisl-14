
var app =  {
    feed        : null,
	cycle: 0,
    feedURL     : URL_FOTOS,
    refElement   : null, 
    imageNumber  : 0,
    element      : null,
    picWidth     : 230,
    picHeight    : 230,
    timer        : 2000,
    picQueue     : null, 
    totalElements: 8, 
    refContainers: null, 
    refContainerCycle : -1, 
		
	start: function () { 

		this.picQueue = new Array();
		this.element = document.createElement('div');
		this.element.style.marginLeft="0px";
		document.getElementById("container").appendChild(this.element);
		this.refElement = document.createElement("div");
		this.element.appendChild(this.refElement);
		this.refContainers = new Array();

		for(var i=0; i<this.totalElements; i++) { 
			var k = document.createElement("span");
			k.style.width = this.picWidth + "px";
			k.style.height= this.picHeight + "px";
			k.style.overflow="hidden";
			k.style.display="inline-block";
			this.element.insertBefore(k, this.element.firstChild);
			this.refContainers[i]=k;
		}

		var scopedThis = this;
       	setTimeout( function () { scopedThis.popPic() }, this.timer);
	},

	init : function() {
		this.feed = new t8l.feeds.Feed(this.feedURL);
		this.feed.setResultFormat('text'); // differs from google now
		this.feed.setNumEntries(10);
	},

    flipContainers:0,

	popPic: function() {
		if (this.picQueue.length == 0) { 
			var self = this;
			this.feed.load( function (e) { self.__feedUpdated(e) } );
		} else { 
			var t = this.picQueue.pop();
			this.refContainerCycle++;
			if(this.refContainerCycle == this.totalElements) { 
				this.refContainerCycle=0;
			} 
			var currentContainer = this.refContainers[this.refContainerCycle];
			these = this;
			$(currentContainer).find("img").attr('class','fadeout');
			setTimeout(function () { 
				currentContainer.innerHTML = "<img id='posterimage"+these.imageNumber+"' src='"+t+"' class='loading'>";
				these.doExpire = true; 
				//setTimeout(function () { these.tryExpire() }, these.timer*20);
				setTimeout(function () { these.imageLoaded() }, these.timer)
				//document.getElementById("posterimage"+these.imageNumber).onload = function () { these.imageLoaded() };

			}, these.timer)
			
			return true;
		} 

	},

    tryExpire: function () { 
    		if(this.doExpire) { 
                 location.reload();
    		}
    },
     
    doExpire : true, 

	imageLoaded : function() { 

		//this.doExpire = false; 

		var currImage =  document.getElementById("posterimage"+this.imageNumber);
		var x= parseInt(currImage.width); 
		var y= parseInt(currImage.height); 

		if(x>=y) {
			currImage.width=this.picWidth;
			var yy = parseInt ((this.picHeight-parseInt((this.picWidth*y)/x))/2 );
			currImage.style.marginTop=yy+"px";
		} else { 
			currImage.height=this.picHeight;
			var xx = parseInt ((this.picWidth-parseInt((this.picHeight*x)/y))/2 );
			currImage.style.marginLeft=xx+"px";
		} 
		currImage.className='active';
		this.imageNumber++;
        this.kickFadeIn();
	},

	kickFadeIn : function () { 
        this.cycle++;	
        if(this.cycle<=this.totalElements) { 
            var scopedThis = this;
            setTimeout( function () { scopedThis.popPic() }, this.timer);
        }  else { 
            this.cycle=0;
            this.kickFadeIn();
        } 
	},

	__feedUpdated : function(result) {
		this.dataOut = new Array();
		if(result.error) { }; 
		var text = result.xmlDocument; 
		var objs = $.parseJSON(text);
		for( var k in objs) {
			var src = (objs[k].images.standard_resolution);
            this.picQueue.push(src.url);
		} 
		this.kickFadeIn();
	}
}

