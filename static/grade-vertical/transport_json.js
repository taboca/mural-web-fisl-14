var transport =  {
 	timer_init  : 1000,
	timer_loop  : 45000, 
    feed        : null,
    feedURL     : '',
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
		if(result.error) { }; 
		var text = result.xmlDocument; 
		var objs = $.parseJSON(text);
		this.callback(objs);
		this.callAgain();
	}
}

