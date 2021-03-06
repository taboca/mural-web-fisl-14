var app =  {
	feedURL : URL_DESTAQUES,
	feed    : null, 

	start : function() {
		this.element = document.createElement('div');
		this.element.className="destaquePanel";
		this.element.id = Math.random();
		this.tweetQueue = new Array();
		var first = document.createElement("div");
		this.firstId = "firstdestaque";
		first.id = this.firstId;
		this.tweetRepeated = {};
		this.element.appendChild(first);
		document.getElementById("container").appendChild(this.element);
		var self = this;
		setTimeout( function(){self.updateFeed()},500);
	},

	init : function () { 
		this.feed = new t8l.feeds.Feed(this.feedURL);
		this.feed.setResultFormat(t8l.feeds.Feed.XML_FORMAT);
		this.feed.setNumEntries(10);
	} ,
	
	popTweet : function() {
		if (this.tweetQueue.length == 0) return false;
		var obj = this.tweetQueue.pop();
		var t = obj.title; 
		var d = obj.desc; 
		
		var k = document.createElement('div');
		k.className = 'destaque_element';
		k.innerHTML = '<table height="100%" width="100%" border="0"><tr><td valign="middle"><div class="title">'+t+'</div></td></tr></table>';
		var old = this.element.firstChild;
		this.element.insertBefore(k, this.element.firstChild);
		this.element.removeChild(old);
		return true;
	},

	updateFeed : function() {
		var self = this;
		if (! this.popTweet()) {
			this.feed.load( function (e) { self.__feedUpdated(e) } );
		}
		setTimeout( function(){self.updateFeed()},15000);
	},

	__feedUpdated : function(result) {
		var self  = this;
		if (result.error) {
			return;
		}
  		$(result.xmlDocument).find('item').each(function(){
           var r = doFilter(this);
           self.tweetQueue.push( { title: r.title, desc: r.description } );
        });
	}
}


